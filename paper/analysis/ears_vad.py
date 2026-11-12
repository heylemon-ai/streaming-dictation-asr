"""The Whisper setups of the paper's Whisper guide on EARS (107 speakers, normal and whispered), for Table ears_vad.
Writes paper/analysis/ears_vad.json and paper/tables/ears_vad.tex. Only aggregates are written.

  <venv with whisper-normalizer>/bin/python -I paper/analysis/ears_vad.py

Reads the per-clip transcripts (local only): gated Whisper with its VAD and the self-hosted deployment that sends
everything come from the EARS run of every system (latest cache/clips/*-ears-all.tsv); gated Whisper with the VAD
off, and the self-hosted deployment with Silero dropping audio, TEN cutting and TEN dropping, from the 29 October runs
(cache/clips/*-ears-gated-nogate.tsv and *-ears-vad-sh.tsv). Scoring is that of external.py: Whisper's English
normaliser on both sides, a clip the VAD never sent or with no text within 30 s is an empty transcript, connection
faults are not scored, and intervals resample speakers (2,000 times, paired for differences).
"""
import csv, glob, json, random, sys
from whisper_normalizer.english import EnglishTextNormalizer

csv.field_size_limit(sys.maxsize)
norm = EnglishTextNormalizer()
# (label, engine id, clips TSV pattern)
SETUPS = [('Gated, VAD on', 'whisper', '*-ears-all.tsv'), ('Gated, VAD off', 'whisper', '*-ears-gated-nogate.tsv'),
          ('Self-hosted, Silero cuts', 'whisper-self-hosted', '*-ears-all.tsv'), ('Self-hosted, Silero drops', 'whisper-self-hosted-vad', '*-ears-vad-sh.tsv'),
          ('Self-hosted, TEN cuts', 'whisper-self-hosted-ten', '*-ears-vad-sh.tsv'), ('Self-hosted, TEN drops', 'whisper-self-hosted-ten-vad', '*-ears-vad-sh.tsv')]
BASE = 'Self-hosted, Silero cuts'


def align(r, h):
    n, m = len(r), len(h)
    d = [[(0, 0, 0, 0)] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1): d[i][0] = (i, 0, i, 0)
    for j in range(1, m + 1): d[0][j] = (j, 0, 0, j)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if r[i - 1] == h[j - 1]:
                d[i][j] = d[i - 1][j - 1]
            else:
                s, dl, ins = d[i - 1][j - 1], d[i - 1][j], d[i][j - 1]
                d[i][j] = min((s[0] + 1, s[1] + 1, s[2], s[3]), (dl[0] + 1, dl[1], dl[2] + 1, dl[3]), (ins[0] + 1, ins[1], ins[2], ins[3] + 1))
    e, sub, dele, ins = d[n][m]
    return {'err': e, 'sub': sub, 'del': dele, 'ins': ins, 'n': n}


spk = {r['id']: r['speaker'] for r in csv.DictReader(open('data-external/ears/manifest.tsv'), delimiter='\t', quoting=csv.QUOTE_NONE)}


def load(engine, pattern):
    """set -> clip -> scores, plus the number of clips the VAD never sent per set."""
    out, withheld = {}, {}
    for r in csv.DictReader(open(sorted(glob.glob(f'cache/clips/{pattern}'))[-1]), delimiter='\t', quoting=csv.QUOTE_NONE):
        if r['engine'] != engine or r['run'] != '0':
            continue
        err = r['error']
        if err and not (err.startswith('dropped') or err.startswith('timeout waiting')):
            continue
        if err.startswith('dropped'):
            withheld[r['set']] = withheld.get(r['set'], 0) + 1
        a = align(norm(r['reference']).split(), norm('' if err else r['transcript']).split())
        a['speaker'] = spk[r['clip']]
        out.setdefault(r['set'], {})[r['clip'].replace('-whisper', '').replace('-regular', '')] = a
    return out, withheld


rate = lambda xs, k='err': 100 * sum(x[k] for x in xs) / max(1, sum(x['n'] for x in xs))


def boot(clips, rnd):
    g = {}
    for k, a in clips.items(): g.setdefault(a['speaker'], []).append(k)
    sp = list(g)
    v = sorted(rate([clips[k] for s in (rnd.choice(sp) for _ in sp) for k in g[s]]) for _ in range(2000))
    return round(v[50], 1), round(v[1949], 1)


def paired(a, b, rnd):
    """Rate of b minus rate of a over the clips both have, speakers resampled."""
    ks = [k for k in a if k in b]
    g = {}
    for k in ks: g.setdefault(a[k]['speaker'], []).append(k)
    sp = list(g)
    d = sorted(rate([b[k] for k in x]) - rate([a[k] for k in x]) for x in ([k for s in (rnd.choice(sp) for _ in sp) for k in g[s]] for _ in range(2000)))
    return round(rate([b[k] for k in ks]) - rate([a[k] for k in ks]), 1), round(d[50], 1), round(d[1949], 1), len(ks)


rnd = random.Random(11)
data = {label: load(e, pat) for label, e, pat in SETUPS}
out = {}
for label, _, _ in SETUPS:
    c, wh = data[label]
    reg, whis = c['ears-regular'], c['ears-whisper']
    spk_wh = {}
    for a in whis.values(): spk_wh.setdefault(a['speaker'], []).append(a)
    out[label] = {'clips': [len(reg), len(whis)], 'regular': round(rate(reg.values()), 1), 'regularCI': boot(reg, rnd),
                  'whisper': round(rate(whis.values()), 1), 'whisperCI': boot(whis, rnd), 'whisperMinusRegular': paired(reg, whis, rnd),
                  'whisperDel': round(rate(whis.values(), 'del'), 1), 'withheld': wh.get('ears-whisper', 0), 'withheldRegular': wh.get('ears-regular', 0),
                  'speakersOver20': sum(1 for v in spk_wh.values() if rate(v) >= 20),
                  'whisperVsBase': None if label == BASE else paired(data[BASE][0]['ears-whisper'], whis, rnd),
                  'regularVsBase': None if label == BASE else paired(data[BASE][0]['ears-regular'], reg, rnd)}
# Gated Whisper with the client VAD off minus on, the paired comparison of Table vad
out['gatedOffMinusOn'] = {s: paired(data['Gated, VAD on'][0][s], data['Gated, VAD off'][0][s], rnd) for s in ['ears-regular', 'ears-whisper']}
json.dump(out, open('paper/analysis/ears_vad.json', 'w'), indent=1)

rows = []
for label, _, _ in SETUPS:
    a = out[label]; v = a['whisperVsBase']
    rows.append(f"{label} & {a['regular']:.1f} & {a['whisper']:.1f} {{\\scriptsize [{a['whisperCI'][0]}, {a['whisperCI'][1]}]}} & "
                + ('--' if v is None else f"{v[0]:+.1f} {{\\scriptsize [{v[1]:+.1f}, {v[2]:+.1f}]}}")
                + f" & {a['whisperDel']:.1f} & {a['withheld']} & {a['speakersOver20']} \\\\")
open('paper/tables/ears_vad.tex', 'w').write('\n'.join(rows) + '\n')
print(json.dumps(out['gatedOffMinusOn']))

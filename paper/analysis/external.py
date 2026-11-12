"""Scores the external sets (EARS, VOiCES) for the paper and writes paper/analysis/external.json plus the LaTeX table
bodies paper/tables/ext_ears.tex and paper/tables/ext_voices.tex. Reads the per-clip transcripts written by
`npm run report` (the latest cache/clips/<date>-ears-all.tsv and -voices-all.tsv; local only). Only aggregates are written.

  <venv>/bin/python -I paper/analysis/external.py

Scoring differs from the main sets on purpose:
  - Both reference and transcript go through Whisper's English normaliser (whisper-normalizer==0.1.12): the VOiCES
    references are LibriSpeech text (upper case, no punctuation, numbers as words), so as-written scoring would
    measure LibriSpeech's spelling conventions rather than recognition.
  - A clip with no text is an empty transcript: clips the client VAD never sent (gated Whisper) and sessions
    that ended with no transcript within 30 s ("timeout waiting for transcript"). The second is a recognition
    failure here, not a connection fault: a traced Gemini session on a babble clip returned "Add, and," after 17 s.
  - Intervals: percentile bootstrap over speakers (2,000 resamples), paired for differences.
"""
import csv, glob, json, random, re, sys
from whisper_normalizer.english import EnglishTextNormalizer

csv.field_size_limit(sys.maxsize)
ROWS = ['whisper-self-hosted', 'whisper', 'qwen', 'meta', 'gemini', 'gemini-smart', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro',
        'zoom-scribe', 'elevenlabs-scribe', 'elevenlabs-scribe-clean', 'openai-live-transcribe-low', 'openai-realtime-whisper']
SHORT = {'whisper-self-hosted': 'Whisper SH', 'whisper': 'Gated Whisper', 'qwen': 'Qwen', 'meta': 'Meta', 'gemini': 'Gemini', 'gemini-smart': 'Gemini Smart',
         'deepgram': 'Deepgram', 'assemblyai-3-6-pro': 'AAI 3.6', 'assemblyai-3-5-pro': 'AAI 3.5', 'zoom-scribe': 'Zoom', 'elevenlabs-scribe': 'ElevenLabs',
         'elevenlabs-scribe-clean': 'ElevenLabs NV', 'openai-live-transcribe-low': 'GPT-Live', 'openai-realtime-whisper': 'RT Whisper'}
norm = EnglishTextNormalizer()


def align(r, h):
    """Word-level Levenshtein with the substitution / deletion / insertion split."""
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


def load(root):
    spk = {r['id']: r['speaker'] for r in csv.DictReader(open(f'data-external/{root}/manifest.tsv'), delimiter='\t', quoting=csv.QUOTE_NONE)}
    out, notext = {}, {}
    for r in csv.DictReader(open(sorted(glob.glob(f'cache/clips/*-{root}-all.tsv'))[-1]), delimiter='\t', quoting=csv.QUOTE_NONE):
        if r['engine'] not in ROWS or r['run'] != '0':
            continue
        err = r['error']
        if err and not (err.startswith('dropped') or err.startswith('timeout waiting')):
            continue  # connection faults: not scored
        if err:
            notext[(r['set'], r['engine'])] = notext.get((r['set'], r['engine']), 0) + 1
        hyp = '' if err else r['transcript']
        a = align(norm(r['reference']).split(), norm(hyp).split())
        a['speaker'] = spk[r['clip']]
        out.setdefault(r['set'], {}).setdefault(r['engine'], {})[r['clip']] = a
    return out, notext


def rate(items, key='err'):
    return 100 * sum(x[key] for x in items) / max(1, sum(x['n'] for x in items))


def by_speaker(clips):
    g = {}
    for k, a in clips.items():
        g.setdefault(a['speaker'], []).append(k)
    return g


def boot(clips, rnd):
    g = by_speaker(clips); sp = list(g)
    vals = sorted(rate([clips[k] for s in (rnd.choice(sp) for _ in sp) for k in g[s]]) for _ in range(2000))
    return round(vals[50], 1), round(vals[1949], 1)


def paired(a, b, rnd):
    """Rate of b minus rate of a over the same items (matched by clip key), speakers resampled."""
    g = by_speaker(a); sp = list(g)
    point = rate([b[k] for k in a]) - rate(list(a.values()))
    diffs = []
    for _ in range(2000):
        ks = [k for s in (rnd.choice(sp) for _ in sp) for k in g[s]]
        diffs.append(rate([b[k] for k in ks]) - rate([a[k] for k in ks]))
    diffs.sort()
    return round(point, 1), round(diffs[50], 1), round(diffs[1949], 1)


out = {}
rnd = random.Random(11)
# EARS: same speaker, same passage, read normally and whispered.
E, E_notext = load('ears')
ears = {}
for e in ROWS:
    if e not in E.get('ears-whisper', {}) or e not in E.get('ears-regular', {}):
        continue
    reg, wh = E['ears-regular'][e], E['ears-whisper'][e]
    key = lambda c: c.replace('-whisper', '').replace('-regular', '')
    reg_k = {key(k): v for k, v in reg.items()}; wh_k = {key(k): v for k, v in wh.items()}
    common = {k: reg_k[k] for k in reg_k if k in wh_k}
    spk_wh = {}
    for k, a in wh_k.items():
        spk_wh.setdefault(a['speaker'], []).append(a)
    ears[e] = {'regular': round(rate(list(reg.values())), 1), 'regularCI': boot(reg, rnd),
               'whisper': round(rate(list(wh.values())), 1), 'whisperCI': boot(wh, rnd),
               'diff': paired(common, wh_k, rnd),
               'whisperSub': round(rate(list(wh.values()), 'sub'), 1), 'whisperDel': round(rate(list(wh.values()), 'del'), 1), 'whisperIns': round(rate(list(wh.values()), 'ins'), 1),
               'speakersOver20': sum(1 for v in spk_wh.values() if rate(v) >= 20), 'speakers': len(spk_wh),
               'noText': E_notext.get(('ears-whisper', e), 0), 'clips': len(wh)}
out['ears'] = ears

# VOiCES: the same sentence, clean and replayed in the room (far microphone; quiet, babble, TV).
V, V_notext = load('voices')
SETS = ['voices-clean', 'voices-far', 'voices-far-babble', 'voices-far-tv']
voices = {}
for e in ROWS:
    if not all(e in V.get(s, {}) for s in SETS):
        continue
    sent = lambda s: {k.split('/', 1)[1]: v for k, v in V[s][e].items()}
    c, f, b, t = (sent(s) for s in SETS)
    voices[e] = {s.replace('voices-', ''): round(rate(list(V[s][e].values())), 1) for s in SETS}
    voices[e].update({'farMinusClean': paired({k: c[k] for k in c if k in f}, f, rnd),
                      'babbleMinusFar': paired({k: f[k] for k in f if k in b}, b, rnd),
                      'tvMinusFar': paired({k: f[k] for k in f if k in t}, t, rnd),
                      'babbleIns': round(rate(list(V['voices-far-babble'][e].values()), 'ins'), 1),
                      'babbleDel': round(rate(list(V['voices-far-babble'][e].values()), 'del'), 1),
                      'babbleSub': round(rate(list(V['voices-far-babble'][e].values()), 'sub'), 1),
                      'babbleNoText': V_notext.get(('voices-far-babble', e), 0), 'tvNoText': V_notext.get(('voices-far-tv', e), 0)})
out['voices'] = voices
json.dump(out, open('paper/analysis/external.json', 'w'), indent=1)

# Table bodies.
pending = lambda e, cols: f"{SHORT[e]} & " + ' & '.join(['\\multicolumn{1}{c}{pending}'] + [''] * (cols - 1)) + r' \\'
rows = []
for e in ROWS:
    if e not in ears:
        rows.append(f"{SHORT[e]} & \\multicolumn{{5}}{{c}}{{run in progress}} \\\\"); continue
    a = ears[e]; d = a['diff']
    rows.append(f"{SHORT[e]} & {a['regular']:.1f} & {a['whisper']:.1f} {{\\scriptsize [{a['whisperCI'][0]}, {a['whisperCI'][1]}]}} & "
                f"{d[0]:+.1f} {{\\scriptsize [{d[1]:+.1f}, {d[2]:+.1f}]}} & {a['whisperSub']:.1f} / {a['whisperDel']:.1f} / {a['whisperIns']:.1f} & {a['speakersOver20']} \\\\")
open('paper/tables/ext_ears.tex', 'w').write('\n'.join(rows) + '\n')
rows = []
for e in ROWS:
    if e not in voices:
        rows.append(f"{SHORT[e]} & \\multicolumn{{6}}{{c}}{{run in progress}} \\\\"); continue
    v = voices[e]
    rows.append(f"{SHORT[e]} & {v['clean']:.1f} & {v['far']:.1f} & {v['far-babble']:.1f} & {v['far-tv']:.1f} & "
                f"{v['babbleSub']:.1f} / {v['babbleDel']:.1f} / {v['babbleIns']:.1f} & {v['babbleNoText']} \\\\")
open('paper/tables/ext_voices.tex', 'w').write('\n'.join(rows) + '\n')
print(json.dumps({k: len(v) for k, v in out.items()}))

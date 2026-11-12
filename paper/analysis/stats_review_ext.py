"""EARS and VOiCES part of paper/analysis/stats_review.ts (which runs this and merges the output). Prints JSON:
paired-bootstrap p-values and BCa intervals for the paired changes of Tables ears, ears_vad and voices, and VOiCES
WER with the no-text sessions left out. Scoring is that of external.py and ears_vad.py. Only aggregates are printed.

  cache/normenv/bin/python -I paper/analysis/stats_review_ext.py
"""
import csv, glob, json, math, random, statistics, sys
from whisper_normalizer.english import EnglishTextNormalizer

csv.field_size_limit(sys.maxsize)
norm = EnglishTextNormalizer()
B = 4000
ROWS = ['whisper-self-hosted', 'whisper', 'qwen', 'meta', 'gemini', 'gemini-smart', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro',
        'zoom-scribe', 'elevenlabs-scribe', 'elevenlabs-scribe-clean', 'openai-live-transcribe-low', 'openai-realtime-whisper']


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


def load(pattern, manifest, engines=None, key=lambda c: c):
    """(set, engine) -> clip key -> scores (with speaker and whether the session returned no text)."""
    spk = {r['id']: r['speaker'] for r in csv.DictReader(open(manifest), delimiter='\t', quoting=csv.QUOTE_NONE)}
    out = {}
    for r in csv.DictReader(open(sorted(glob.glob(f'cache/clips/{pattern}'))[-1]), delimiter='\t', quoting=csv.QUOTE_NONE):
        if (engines and r['engine'] not in engines) or r['run'] != '0':
            continue
        err = r['error']
        if err and not (err.startswith('dropped') or err.startswith('timeout waiting')):
            continue
        a = align(norm(r['reference']).split(), norm('' if err else r['transcript']).split())
        a['speaker'] = spk[r['clip']]; a['notext'] = err.startswith('timeout waiting')
        out.setdefault((r['set'], r['engine']), {})[key(r['clip'])] = a
    return out


def ncdf(x): return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def nppf(p):
    lo, hi = -10.0, 10.0
    for _ in range(100):
        mid = (lo + hi) / 2
        if ncdf(mid) < p: lo = mid
        else: hi = mid
    return (lo + hi) / 2


def paired(a, b, rnd):
    """Rate of b minus rate of a over clips both have, speakers resampled: point, percentile CI, BCa CI, two-sided p."""
    ks = [k for k in a if k in b]
    g = {}
    for k in ks: g.setdefault(a[k]['speaker'], []).append(k)
    units = [(sum(b[k]['err'] for k in v), sum(a[k]['err'] for k in v), sum(a[k]['n'] for k in v), sum(b[k]['n'] for k in v)) for v in g.values()]
    stat = lambda us: 100 * sum(u[0] for u in us) / max(1, sum(u[3] for u in us)) - 100 * sum(u[1] for u in us) / max(1, sum(u[2] for u in us))
    point = stat(units)
    n = len(units)
    d = sorted(stat([units[rnd.randrange(n)] for _ in range(n)]) for _ in range(B))
    p = max(1 / (B + 1), min(1.0, 2 * min(sum(x <= 0 for x in d), sum(x >= 0 for x in d)) / B))
    # BCa: bias from the share of draws below the point value, acceleration from the jackknife over speakers
    z0 = nppf(min(max(sum(x < point for x in d) / B, 1 / B), 1 - 1 / B))
    jack = [stat(units[:i] + units[i + 1:]) for i in range(n)]
    jm = statistics.fmean(jack)
    num, den = sum((jm - j) ** 3 for j in jack), 6 * sum((jm - j) ** 2 for j in jack) ** 1.5
    acc = num / den if den else 0.0
    q = lambda z: ncdf(z0 + (z0 + z) / (1 - acc * (z0 + z)))
    bca = (d[min(B - 1, max(0, int(q(-1.959964) * B)))], d[min(B - 1, max(0, int(q(1.959964) * B)))])
    r = lambda x: round(x, 1)
    return {'diff': r(point), 'ci': [r(d[int(0.025 * B)]), r(d[int(0.975 * B) - 1])], 'bca': [r(bca[0]), r(bca[1])], 'p': round(p, 4), 'units': n}


rnd = random.Random(11)
out = {}
strip = lambda c: c.replace('-whisper', '').replace('-regular', '')

# Table ears: whispered minus normal, per row.
E = load('*-ears-all.tsv', 'data-external/ears/manifest.tsv', ROWS, strip)
out['earsChange'] = {e: paired(E[('ears-regular', e)], E[('ears-whisper', e)], rnd) for e in ROWS if ('ears-whisper', e) in E}

# Table ears_vad: each Whisper setup's whispered WER minus that of the self-hosted deployment with Silero cutting,
# and gated Whisper VAD off minus on.
N = load('*-ears-gated-nogate.tsv', 'data-external/ears/manifest.tsv', ['whisper'], strip)
S = load('*-ears-vad-sh.tsv', 'data-external/ears/manifest.tsv', None, strip)
base = E[('ears-whisper', 'whisper-self-hosted')]
setups = {'Gated, VAD on': E[('ears-whisper', 'whisper')], 'Gated, VAD off': N[('ears-whisper', 'whisper')],
          'Self-hosted, Silero drops': S[('ears-whisper', 'whisper-self-hosted-vad')], 'Self-hosted, TEN cuts': S[('ears-whisper', 'whisper-self-hosted-ten')],
          'Self-hosted, TEN drops': S[('ears-whisper', 'whisper-self-hosted-ten-vad')]}
out['earsVadVsBase'] = {k: paired(base, v, rnd) for k, v in setups.items()}
out['earsGatedOffMinusOn'] = {s: paired(E[(s, 'whisper')], N[(s, 'whisper')], rnd) for s in ['ears-regular', 'ears-whisper']}
out['earsTenDropsMinusTenCuts'] = paired(setups['Self-hosted, TEN cuts'], setups['Self-hosted, TEN drops'], rnd)

# VOiCES: babble and TV minus the quiet far recording, per row; and WER with no-text sessions left out.
V = load('*-voices-all.tsv', 'data-external/voices/manifest.tsv', ROWS, lambda c: c)
Q = load('*-voices-qwen.tsv', 'data-external/voices/manifest.tsv', ['qwen'], lambda c: c)
for k, v in Q.items(): V.setdefault(k, v)
sent = lambda s, e: {k.split('/', 1)[1]: v for k, v in V[(s, e)].items()}
rate = lambda xs: round(100 * sum(x['err'] for x in xs) / max(1, sum(x['n'] for x in xs)), 1)
out['voicesBabbleMinusFar'], out['voicesTvMinusFar'], out['voicesWithoutNoText'] = {}, {}, {}
for e in ROWS:
    if not all((s, e) in V for s in ['voices-far', 'voices-far-babble', 'voices-far-tv']):
        continue
    f, b, t = sent('voices-far', e), sent('voices-far-babble', e), sent('voices-far-tv', e)
    out['voicesBabbleMinusFar'][e] = paired(f, b, rnd)
    out['voicesTvMinusFar'][e] = paired(f, t, rnd)
    w = {}
    for s, xs in [('babble', b), ('tv', t)]:
        keep = [x for x in xs.values() if not x['notext']]
        w[s] = {'all': rate(xs.values()), 'withoutNoText': rate(keep), 'noText': len(xs) - len(keep), 'delWithoutNoText': round(100 * sum(x['del'] for x in keep) / max(1, sum(x['n'] for x in keep)), 1)}
    out['voicesWithoutNoText'][e] = w
print(json.dumps(out))

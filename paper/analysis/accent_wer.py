"""Joins accent labels (cache/accent/inhouse.json) with per-clip WER against the word-for-word references
(cache/accent/verbatim-clips.json, from VERBATIM_CLIPS=... npx tsx paper/analysis/verbatim.ts) and writes aggregates to
paper/analysis/accent.json:  python3 paper/analysis/accent_wer.py
Per clip: share of confident windows (top probability >= 0.7) labelled 'indian' (CommonAccent's South Asian English
class), and the number of label switches between consecutive confident windows. Quiet and fan-noise sets only:
on whispered audio the model labels almost everything 'us' (no accent cue), so those clips are left out.
For each system: pooled WER on clips with a high South Asian share (>= 0.5) vs the rest, with a clip bootstrap
interval for the difference, and the Spearman correlation between a clip's share and its WER."""
import json, random
CONF = 0.7
A = json.load(open('cache/accent/inhouse.json')); V = json.load(open('cache/accent/verbatim-clips.json')); L = A['labels']; IN = L.index('indian')
E = json.load(open('cache/accent/ears-regular.json'))

def clipstats(c):
    conf = [w['probs'] for w in c['windows'] if max(w['probs']) >= CONF]
    seq = [p.index(max(p)) for p in conf]
    return {'share': sum(s == IN for s in seq) / max(1, len(seq)), 'switches': sum(a != b for a, b in zip(seq, seq[1:])), 'pairs': max(0, len(seq) - 1), 'labels': len(set(seq))}

def switchrate(d, sets=None):
    st = [clipstats(c) for c in d['clips'].values() if sets is None or c['set'] in sets]
    return {'clips': len(st), 'switchPerPair': round(sum(s['switches'] for s in st) / max(1, sum(s['pairs'] for s in st)), 3),
            'clipsWithSwitch': sum(s['switches'] > 0 for s in st), 'southAsianWindowShare': round(sum(s['share'] for s in st) / len(st), 3)}

out = {'confidence': CONF, 'window': A['window'], 'hop': A['hop'],
       'inhouse': {s: switchrate(A, {s}) for s in ['en-dictation', 'en-dictation-noise', 'en-dictation-whisper']},
       'earsRegular': switchrate(E)}
S = {cid: clipstats(c) for cid, c in A['clips'].items() if c['set'] != 'en-dictation-whisper'}
hi = [k for k in S if S[k]['share'] >= 0.5]; lo = [k for k in S if S[k]['share'] < 0.5]
out['split'] = {'high': len(hi), 'low': len(lo), 'highNoise': sum(A['clips'][k]['set'] == 'en-dictation-noise' for k in hi), 'lowNoise': sum(A['clips'][k]['set'] == 'en-dictation-noise' for k in lo)}
rate = lambda ks, e: 100 * sum(V[e][k]['err'] for k in ks) / max(1, sum(V[e][k]['n'] for k in ks))
def rank(x): o = sorted(range(len(x)), key=lambda i: x[i]); r = [0] * len(x); [r.__setitem__(i, k) for k, i in enumerate(o)]; return r
def spearman(a, b):
    ra, rb = rank(a), rank(b); n = len(a); return 1 - 6 * sum((x - y) ** 2 for x, y in zip(ra, rb)) / (n * (n * n - 1))
rnd = random.Random(11); res = {}
for e in V:
    if not all(k in V[e] for k in S): continue
    d = []
    for _ in range(2000):
        h = [rnd.choice(hi) for _ in hi]; l = [rnd.choice(lo) for _ in lo]; d.append(rate(h, e) - rate(l, e))
    d.sort()
    ks = list(S)
    res[e] = {'high': round(rate(hi, e), 1), 'low': round(rate(lo, e), 1), 'diff': round(rate(hi, e) - rate(lo, e), 1), 'diffCI': [round(d[50], 1), round(d[1949], 1)],
              'spearman': round(spearman([S[k]['share'] for k in ks], [V[e][k]['err'] / max(1, V[e][k]['n']) for k in ks]), 2)}
out['wer'] = res
json.dump(out, open('paper/analysis/accent.json', 'w'), indent=1)
print(json.dumps({k: out[k] for k in ['inhouse', 'earsRegular', 'split']}, indent=1))
for e, v in sorted(res.items(), key=lambda x: -x[1]['diff']): print(f"{e:30s} high {v['high']:5.1f} low {v['low']:5.1f} diff {v['diff']:+5.1f} {v['diffCI']} rho {v['spearman']}")

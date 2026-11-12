"""Traces numbers in the paper that had no saved source to the per-clip data, and writes paper/analysis/trace.json.

    python3 paper/analysis/trace.py

Reads cache/clips/*.tsv, cache/accent/inhouse.json, cache/rtt.jsonl, data/*/transcripts.tsv,
paper/analysis/names-checked.json, paper/analysis/extras.json and results/*gemini-*/. Only aggregates are written.
"""
import csv, json, os, re, unicodedata
from collections import Counter, defaultdict
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
P = lambda *a: os.path.join(ROOT, *a)
tsv = lambda f: list(csv.DictReader(open(P(f)), delimiter='\t'))
out = {}

main = [r for r in tsv('cache/clips/2026-10-21-main.tsv') if r['run'] == '0']
ROWS = ['whisper-self-hosted', 'qwen', 'meta', 'gemini', 'gemini-smart', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro',
        'zoom-scribe', 'elevenlabs-scribe', 'elevenlabs-scribe-clean', 'openai-live-transcribe-low', 'openai-realtime-whisper']


# 1. Writing system of the Urdu and Hindi transcripts
def script_counts(t):
    c = Counter()
    for ch in t:
        o = ord(ch)
        if 0x900 <= o <= 0x97f: c['devanagari'] += 1
        elif 0xa80 <= o <= 0xaff: c['gujarati'] += 1
        elif 0x600 <= o <= 0x6ff or 0x750 <= o <= 0x77f or 0xfb50 <= o <= 0xfeff: c['arabic'] += 1
        elif ch.isalpha() and o < 0x250: c['latin'] += 1
    return c

scripts = {}
for s in ['ur-pk', 'hi-in']:
    for e in ROWS:
        rs = [r for r in main if r['set'] == s and r['engine'] == e]
        mostly, anyDeva = Counter(), 0
        for r in rs:
            c = script_counts(r['transcript'])
            mostly[max(c, key=c.get) if c else 'empty'] += 1
            anyDeva += c['devanagari'] > 0
        scripts.setdefault(s, {})[e] = {'clips': len(rs), 'mostly': dict(mostly), 'anyDevanagari': anyDeva}
out['writingSystem'] = scripts
# Qwen receives audio_language=ur (src/engines/baseten.ts: supportsLanguage is always true); Meta, AAI 3.5, Gemini and Zoom have no Urdu option.

# 2. Two-language recordings: romanised Hindi parts for Gemini, and which languages Zoom loses
cs = tsv('cache/clips/2026-11-05-codeswitch-main.tsv')
EN_FUNCTION = set("the a an of to and in is are was were be for on with that this it as at by from or but not have has had will would can could i you he she we they his her their our which who what when where there been more some all".split())
words = lambda t: re.findall(r"[a-z']+", t.lower())
def latin_share(t):
    L = [ch for ch in t if unicodedata.category(ch).startswith('L')]
    return sum(1 for ch in L if 'LATIN' in unicodedata.name(ch, '')) / max(1, len(L))
lost = lambda v: v in ('missing', 'replaced')
csout = {}
for filt, rows in [('all', cs), ('kept', [r for r in cs if r['counted'] == 'yes'])]:
    rep = {}
    for e in ['gemini', 'gemini-smart', 'deepgram']:
        for st in ['both', 'auto', 'en']:
            c = Counter()
            for r in rows:
                if r['engine'] != e or r['kind'] != 'english' or r['setting'] != st: continue
                en_first = r['first_language'] == 'en'
                ol = r['second_language'] if en_first else r['first_language']
                if ol not in ('ar', 'hi', 'zh'): continue
                c['n'] += 1; c[f'n_{ol}'] += 1
                ov = r['second_verdict'] if en_first else r['first_verdict']
                if ov == 'replaced' and latin_share(r['transcript']) > 0.9:
                    enref = set(words(r['first_reference'] if en_first else r['second_reference']))
                    rest = [w for w in words(r['transcript']) if w not in enref]
                    fn = sum(w in EN_FUNCTION for w in rest) / max(1, len(rest))
                    k = 'translated' if len(rest) >= 4 and fn >= 0.15 else 'romanised'
                    c[k] += 1; c[f'{k}_{ol}'] += 1
            rep[f'{e}|{st}'] = dict(c)
    zoom = {}
    for kind in ['english', 'pair']:
        d = defaultdict(Counter)
        for r in rows:
            if r['engine'] != 'zoom-scribe' or r['kind'] != kind or r['setting'] != 'both': continue
            for l, v in [(r['first_language'], r['first_verdict']), (r['second_language'], r['second_verdict'])]:
                if l == 'en': continue
                d[l]['parts'] += 1; d[l]['lost'] += lost(v)
        zoom[kind] = {l: dict(c) for l, c in sorted(d.items())}
    csout[filt] = {'nonLatinReplacements': rep, 'zoomLostByLanguage': zoom}
out['twoLanguage'] = csout


# 3. Names: the capital-letter rule, the checked list, and the 183 scored name words
def norm_tokens(t):
    t = unicodedata.normalize('NFKC', t).lower()
    t = re.sub(r"['’ʼ`´]", '', t)
    t = re.sub(r'(?<=[^\W\d_])\.(?=[^\W\d_])', '', t)
    t = ''.join(' ' if unicodedata.category(ch)[0] in 'PS' else ch for ch in t)
    return t.split()
clean = lambda w: re.sub(r'[^\w]', '', w).lower()
checked = json.load(open(P('paper/analysis/names-checked.json')))
listed = set(checked['names'])
cap_tok, cap_types, cap_name_tok, scored, caught, used = 0, set(), 0, 0, set(), set()
outside_rule, lowercase_counted = 0, 0
for s in ['en-dictation', 'en-dictation-noise', 'en-dictation-whisper']:
    for r in tsv(f'data/{s}/transcripts.tsv'):
        clip = f"{s}/{r['file'][:-4]}"
        ok = set(listed) | {w for w, cl in checked['perClip'].items() if clip in cl}
        ws = r['reference'].split()
        mid = {i for i, w in enumerate(ws) if i > 0 and not re.search(r'[.!?:]$', ws[i - 1]) and re.match(r'^[A-Z][a-zA-Z]+', w)}
        for i in mid:
            n = clean(ws[i]); cap_tok += 1; cap_types.add(n)
            if n in ok: cap_name_tok += 1; caught.add(n)
        names_here = {clean(w) for w in ws if w[:1].isupper()} & ok
        used |= names_here
        outside_rule += sum(1 for i, w in enumerate(ws) if w[:1].isupper() and clean(w) in ok and i not in mid)
        lowercase_counted += sum(1 for w in ws if w[:1].islower() and clean(w) in names_here)
        scored += sum(1 for t in norm_tokens(r['reference']) if t in names_here)
out['names'] = {'capitalisedMidSentence': cap_tok, 'capitalisedTypes': len(cap_types), 'capitalisedThatAreNames': cap_name_tok,
                'listedNamesTheRuleMisses': sorted(used - caught), 'nameOccurrencesOutsideTheRule': outside_rule,
                'lowercaseWordsCountedAsNames': lowercase_counted, 'scoredNameWords': scored}


# 4. Accent windows (cache/accent/inhouse.json, from accent.py), confident windows only (top probability >= 0.7)
acc = json.load(open(P('cache/accent/inhouse.json'))); L = acc['labels']
top = lambda w: L[w['probs'].index(max(w['probs']))]
def windows(sets):
    return [[top(w) for w in c['windows'] if max(w['probs']) >= 0.7] for c in acc['clips'].values() if c['set'] in sets]
spoken = windows({'en-dictation', 'en-dictation-noise'})
wl = Counter(x for seq in spoken for x in seq); n = sum(wl.values())
ww = Counter(x for seq in windows({'en-dictation-whisper'}) for x in seq); nw = sum(ww.values())
whole = Counter(L[max(range(len(L)), key=lambda i: c['probs'][i])] for c in acc['clips'].values() if c['set'] in ('en-dictation', 'en-dictation-noise'))
out['accent'] = {'spokenMessages': len(spoken), 'windows': n, 'share': {k: round(100 * v / n, 1) for k, v in wl.most_common()},
                 'englandNzIreland': round(100 * (wl['england'] + wl['newzealand'] + wl['ireland']) / n, 1),
                 'messagesWithSouthAsianWindow': sum('indian' in seq for seq in spoken), 'wholeMessageSouthAsian': whole['indian'],
                 'whisperedUS': round(100 * ww['us'] / nw, 1)}


# 5. One-week replay: the 42 speech clips of the 8 October smoke run against the 1 October run
oct1 = {(r['clip'], r['engine']): r for r in tsv('cache/clips/2026-10-08-oct1.tsv')}
rep = {}
for e in ['whisper', 'gemini', 'meta']:
    pairs = [(r, oct1[(r['clip'], e)]) for r in tsv('cache/clips/2026-10-08-smoke.tsv') if r['engine'] == e and r['set'] != 'nonspeech' and (r['clip'], e) in oct1]
    scoredp = [(a, b) for a, b in pairs if a['errors'] and b['errors']]
    wer = lambda k: round(100 * sum(int(x[k]['errors']) for x in [dict(zip('ab', p)) for p in scoredp]) / sum(int(x[k]['ref_tokens']) for x in [dict(zip('ab', p)) for p in scoredp]), 1)
    rep[e] = {'clips': len(pairs), 'scored': len(scoredp), 'sameText': sum(a['transcript'].strip() == b['transcript'].strip() for a, b in pairs),
              'werOct1': wer('b'), 'werOct8': wer('a'), 'failedSessions': [a['error'] for a, b in pairs if not a['errors']]}
out['replay'] = rep


# 6-7. Network probes during the 29 October timing runs
probes = [json.loads(l) for l in open(P('cache/rtt.jsonl'))]
at = sorted({p['at'] for p in probes})
out['rtt'] = {'samples': dict(Counter(p['provider'] for p in probes)),
              'longestGapMinutes': round(max(b - a for a, b in zip(at, at[1:])) / 60, 1)}


# 8. Gemini under repeated and parallel use (two runs: 21 October, and 22 October at another time of day)
def stress_table(d):
    rows = {}
    for line in open(P(f'results/{d}/summary.md')):
        m = re.match(r'\| (gemini(?:-smart)?) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \|', line)
        if m: rows[f'{m[1]}@{m[2]}'] = {'sessions': int(m[3]), 'failed': int(m[4]), 'p50': int(m[5]), 'p90': int(m[6])}
    return rows
def repeat_summary(d):
    txt = open(P(f'results/{d}/summary.md')).read()
    same = re.findall(r'\| (\S+) \| [\d.]+ s \| (gemini(?:-smart)?) \|.*\| (\d+)% \|', txt)
    m = re.search(r'Smart faster in (\d+) of (\d+)', txt)
    return {'smartFaster': f'{m[1]}/{m[2]}', 'sameTextPerClip': {f'{c}|{e}': int(p) for c, e, p in same}}
out['geminiLoad'] = {d: stress_table(d) for d in ['2026-10-21-gemini-stress', '2026-10-22-gemini-stress-repeat']}
out['geminiRepeat'] = {d: repeat_summary(d) for d in ['2026-10-21-gemini-repeat', '2026-10-22-gemini-repeat-2']}


# 9. Paired bootstrap of the unweighted per-set average WER (clips resampled within each set, the same draw for every system)
SETS = ['ar-eg', 'ar-sa', 'ar-ae', 'de-de', 'es-419', 'es-es', 'es-pr', 'fr-fr', 'hi-in', 'zh-cn', 'ur-pk']
rng = np.random.default_rng(1)
avg = {}
for name, sets in [('without Urdu', SETS[:-1]), ('with Urdu', SETS)]:
    E, R = {}, {}
    for s in sets:
        clips = sorted({r['clip'] for r in main if r['set'] == s})
        idx = {c: i for i, c in enumerate(clips)}
        E[s] = np.zeros((len(ROWS), len(clips))); R[s] = np.zeros((len(ROWS), len(clips)))
        for r in main:
            if r['set'] == s and r['engine'] in ROWS and r['errors']:
                E[s][ROWS.index(r['engine']), idx[r['clip']]] = int(r['errors']); R[s][ROWS.index(r['engine']), idx[r['clip']]] = int(r['ref_tokens'])
    point = np.mean([E[s].sum(1) / R[s].sum(1) for s in sets], axis=0) * 100
    boots = np.zeros((2000, len(ROWS)))
    for b in range(2000):
        acc_ = np.zeros(len(ROWS))
        for s in sets:
            k = rng.integers(0, E[s].shape[1], E[s].shape[1])
            acc_ += E[s][:, k].sum(1) / R[s][:, k].sum(1)
        boots[b] = acc_ / len(sets) * 100
    best = int(np.argmin(point))
    diffs = {}
    for i, e in enumerate(ROWS):
        if i == best: continue
        d = boots[:, i] - boots[:, best]
        diffs[e] = {'avg': round(float(point[i]), 1), 'diff': round(float(point[i] - point[best]), 1),
                    'ci': [round(float(np.percentile(d, 2.5)), 1), round(float(np.percentile(d, 97.5)), 1)]}
    avg[name] = {'lowest': ROWS[best], 'lowestAvg': round(float(point[best]), 1), 'others': diffs}
out['languageAverages'] = avg


# 10. Hindi character against word error rate (paper/analysis/extras.json)
cer = json.load(open(P('paper/analysis/extras.json')))['cer']['hi-in']
out['hindiCer'] = {e: {**v, 'cerOverWer': round(v['cer'] / v['wer'], 3)} for e, v in cer.items()}

json.dump(out, open(P('paper/analysis/trace.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(out, indent=1, ensure_ascii=False))

"""GPT-Live's two delay settings, low (used in the main tables) and minimal, run on the same day on each test set.
Writes paper/analysis/gptdelay.json and the table body paper/tables/gptdelay.tex. Only aggregates are written.

  cache/normenv/bin/python -I paper/analysis/gptdelay.py

Sources (local only):
  - our sets: cache/clips/2026-11-05-gptdelay.tsv, both settings in one run on 5 November. WER is the per-clip error
    and token counts the run wrote (the scoring of the main tables); formatted WER and waits from its results.json.
  - EARS and VOiCES: cache/clips/2026-11-05-gptlow-{ears,voices}.tsv and -gptmin-{ears,voices}.tsv, both 5 November,
    scored as in external.py (Whisper's English normaliser; no text within 30 s counts as an empty transcript).
  - two languages: cache/clips/2026-11-05-codeswitch-gptdelay.tsv, the report of both settings' sessions of 19 October.
Intervals: paired percentile bootstrap (2,000 resamples) over clips for our sets, over speakers for EARS and VOiCES,
and over recordings for the two-language test. Differences are minimal minus low.
"""
import csv, json, random, sys
from whisper_normalizer.english import EnglishTextNormalizer

csv.field_size_limit(sys.maxsize)
norm = EnglishTextNormalizer()
LOW, MIN = 'openai-live-transcribe-low', 'openai-live-transcribe-minimal'
SETS = [('en-dictation', 'Quiet'), ('en-dictation-noise', 'Fan on'), ('en-dictation-whisper', 'Whispered'),
        ('ar-eg', 'Arabic MSA (Egypt)'), ('ar-sa', 'Saudi Arabic'), ('ar-ae', 'Emirati Arabic'), ('de-de', 'German'),
        ('es-419', 'Spanish (Latin America)'), ('es-es', 'Spanish (Spain)'), ('es-pr', 'Spanish (Puerto Rico)'),
        ('fr-fr', 'French'), ('hi-in', 'Hindi'), ('ur-pk', 'Urdu'), ('zh-cn', 'Mandarin')]


def tsv(path):
    return list(csv.DictReader(open(path), delimiter='\t', quoting=csv.QUOTE_NONE))


def paired(units, a, b, rnd):
    """units: keys; a, b: key -> (errors, tokens). Returns minimal-minus-low difference in WER points and its 95% interval."""
    w = lambda m, ks: 100 * sum(m[k][0] for k in ks) / max(1, sum(m[k][1] for k in ks))
    d = sorted(w(b, s) - w(a, s) for s in ([rnd.choice(units) for _ in units] for _ in range(2000)))
    return {'diff': round(w(b, units) - w(a, units), 1), 'ci': [round(d[50], 1), round(d[1949], 1)], 'p': pval(d)}


def grouped(groups, a, b, rnd):
    """As paired, resampling groups (speakers) of keys."""
    w = lambda m, ks: 100 * sum(m[k][0] for k in ks) / max(1, sum(m[k][1] for k in ks))
    g = list(groups)
    flat = lambda pick: [k for s in pick for k in groups[s]]
    d = sorted(w(b, flat(p)) - w(a, flat(p)) for p in ([rnd.choice(g) for _ in g] for _ in range(2000)))
    allk = flat(g)
    return {'diff': round(w(b, allk) - w(a, allk), 1), 'ci': [round(d[50], 1), round(d[1949], 1)], 'p': pval(d)}


def pval(d):
    """Two-sided bootstrap p-value of a zero difference."""
    return round(max(1 / (len(d) + 1), min(1, 2 * min(sum(x <= 0 for x in d), sum(x >= 0 for x in d)) / len(d))), 4)


rnd = random.Random(23)
out = {'ours': {}, 'external': {}, 'twoLanguages': {}}

# Our sets
rows = [r for r in tsv('cache/clips/2026-11-05-gptdelay.tsv') if r['run'] == '0']
res = json.load(open('results/2026-11-05-gptdelay/results.json'))['aggregates']
for s, _ in SETS:
    m = {}
    for r in rows:
        if r['set'] == s and not (r['error'] and not r['error'].startswith('dropped')):
            m.setdefault(r['engine'], {})[r['clip']] = (int(r['errors']), int(r['ref_tokens']))
    ks = sorted(set(m[LOW]) & set(m[MIN]))
    out['ours'][s] = {'clips': len(ks), 'low': round(100 * res[f'{s}/{LOW}']['headline']['value'], 1), 'minimal': round(100 * res[f'{s}/{MIN}']['headline']['value'], 1),
                      'formattedLow': round(100 * res[f'{s}/{LOW}']['formatted'], 1), 'formattedMinimal': round(100 * res[f'{s}/{MIN}']['formatted'], 1),
                      **paired(ks, m[LOW], m[MIN], rnd)}
out['ours']['noSpeechOutput'] = {e: res[f'nonspeech/{e}']['nonSpeechOutputRate'] for e in (LOW, MIN)}
out['ours']['latency'] = {e: res[f'latency/{e}'] for e in (LOW, MIN)}

# EARS and VOiCES
for root, sets in [('ears', ['ears-regular', 'ears-whisper']), ('voices', ['voices-clean', 'voices-far', 'voices-far-babble', 'voices-far-tv'])]:
    spk = {r['id']: r['speaker'] for r in tsv(f'data-external/{root}/manifest.tsv')}
    m, notext = {}, {}
    for e, path in [(LOW, f'cache/clips/2026-11-05-gptlow-{root}.tsv'), (MIN, f'cache/clips/2026-11-05-gptmin-{root}.tsv')]:
        for r in tsv(path):
            if r['engine'] != e or r['run'] != '0':
                continue
            err = r['error']
            if err and not (err.startswith('dropped') or err.startswith('timeout waiting')):
                continue
            if err:
                notext[f"{r['set']}/{e}"] = notext.get(f"{r['set']}/{e}", 0) + 1
            ref, hyp = norm(r['reference']).split(), norm('' if err else r['transcript']).split()
            d = list(range(len(hyp) + 1))
            for i in range(1, len(ref) + 1):
                prev, d[0] = d[0], i
                for j in range(1, len(hyp) + 1):
                    prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ref[i - 1] != hyp[j - 1]))
            m.setdefault(r['set'], {}).setdefault(e, {})[r['clip']] = (d[len(hyp)], len(ref))
    for s in sets:
        ks = sorted(set(m[s][LOW]) & set(m[s][MIN]))
        groups = {}
        for k in ks:
            groups.setdefault(spk[k], []).append(k)
        w = lambda e: round(100 * sum(m[s][e][k][0] for k in ks) / sum(m[s][e][k][1] for k in ks), 1)
        out['external'][s] = {'clips': len(ks), 'speakers': len(groups), 'low': w(LOW), 'minimal': w(MIN), **grouped(groups, m[s][LOW], m[s][MIN], rnd),
                              'noTextLow': notext.get(f'{s}/{LOW}', 0), 'noTextMinimal': notext.get(f'{s}/{MIN}', 0)}

# Two languages: share of all recordings with one language missing or replaced
lost = lambda r: r['first_verdict'] in ('missing', 'replaced') or r['second_verdict'] in ('missing', 'replaced')
by = {}
for r in tsv('cache/clips/2026-11-05-codeswitch-gptdelay.tsv'):
    by.setdefault(f"{r['kind']}/{r['setting']}", {}).setdefault(r['engine'], {})[r['recording']] = (int(lost(r)), 1)
for k, v in by.items():
    ks = sorted(set(v[LOW]) & set(v[MIN]))
    out['twoLanguages'][k] = {'recordings': len(ks), 'low': round(100 * sum(v[LOW][x][0] for x in ks) / len(ks), 1),
                              'minimal': round(100 * sum(v[MIN][x][0] for x in ks) / len(ks), 1), **paired(ks, v[LOW], v[MIN], rnd)}

# Holm correction over every comparison in the table (one group); "clear" = interval excludes zero and survives Holm
tests = [(g, k, v) for g in ('ours', 'external', 'twoLanguages') for k, v in out[g].items() if isinstance(v, dict) and 'p' in v]
m = len(tests)
running = 0
for i, (g, k, v) in enumerate(sorted(tests, key=lambda t: t[2]['p'])):
    running = max(running, min(1, (m - i) * v['p']))
    v['pHolm'] = round(running, 4)
    v['clear'] = v['pHolm'] < 0.05 and (v['ci'][0] > 0 or v['ci'][1] < 0)
out['holm'] = {'tests': m, 'clear': [f'{g}/{k}' for g, k, v in tests if v['clear']]}
json.dump(out, open('paper/analysis/gptdelay.json', 'w'), indent=1)

# Table body: one row per measure, low, minimal, difference with interval
fmt = lambda x: f'{x:.1f}'
ci = lambda t: f"{t['diff']:+.1f} [{t['ci'][0]:.1f}, {t['ci'][1]:.1f}]".replace('-', '$-$').replace('+', '$+$')
lines = [r'\multicolumn{4}{@{}l}{\emph{Our sets, WER}} \\']
for s, name in SETS:
    o = out['ours'][s]
    lines.append(f"{name} & {fmt(o['low'])} & {fmt(o['minimal'])} & {ci(o)} \\\\")
lines[-1] += '[3pt]'
lines.append(r'\multicolumn{4}{@{}l}{\emph{EARS and VOiCES, WER}} \\')
for s, name in [('ears-regular', 'EARS, normal'), ('ears-whisper', 'EARS, whispered'), ('voices-clean', 'VOiCES, clean'), ('voices-far', 'VOiCES, far'),
                ('voices-far-babble', 'VOiCES, far + babble'), ('voices-far-tv', 'VOiCES, far + TV')]:
    o = out['external'][s]
    lines.append(f"{name} & {fmt(o['low'])} & {fmt(o['minimal'])} & {ci(o)} \\\\")
lines[-1] += '[3pt]'
lines.append(r'\multicolumn{4}{@{}l}{\emph{Two languages, share of recordings with a language lost}} \\')
for k, name in [('english/both', 'EN + X, both selected'), ('english/en', 'EN + X, English only'), ('english/auto', 'EN + X, auto-detect'),
                ('pair/both', 'X + Y, both selected'), ('pair/auto', 'X + Y, auto-detect')]:
    o = out['twoLanguages'][k]
    name = name.replace(' + ', r'\,+\,')
    lines.append(f"{name} & {fmt(o['low'])} & {fmt(o['minimal'])} & {ci(o)} \\\\")
open('paper/tables/gptdelay.tex', 'w').write('\n'.join(lines) + '\n')
print(json.dumps(out, indent=1))

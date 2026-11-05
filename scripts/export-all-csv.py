"""Exports every benchmark result into one long-format CSV (aggregates only, no audio or transcripts).

    python3 scripts/export-all-csv.py [--out results/all-benchmarks.csv]

One row per engine x test x metric. Columns:
  benchmark      single-language | latency | reliability | two-language | failure-analysis
  engine, engine_label, model
  voice_check    on | off | n/a   (the client VAD gate; only Whisper and Qwen have one)
  test, language, condition, setting
  metric, value, ci_low, ci_high, n, unit, run_date, notes
"""
import csv, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda p: json.load(open(os.path.join(ROOT, p)))
out_path = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(ROOT, 'results', 'all-benchmarks.csv')

# Single-language runs: the main run (gate on for Whisper/Qwen), the gate-off reruns, and any later engines.
RUNS = [('results/2026-10-14-all-engines', None)]
for d, eng in [('results/2026-10-13-whisper-no-vad', 'whisper'), ('results/2026-10-13-qwen-no-vad', 'qwen')]:
    if os.path.exists(os.path.join(ROOT, d, 'results.json')):
        RUNS.append((d, eng))
GATED = {'whisper', 'qwen'}
SET_INFO = {}
rows = []

def row(**k):
    base = dict(benchmark='', engine='', engine_label='', model='', voice_check='n/a', test='', language='', condition='', setting='', metric='', value='', ci_low='', ci_high='', n='', unit='', run_date='', notes='')
    base.update({a: ('' if b is None else b) for a, b in k.items()})
    rows.append(base)

r4 = lambda x: None if x is None else round(x * 100, 2)
labels, models = {}, {}
for d, only in RUNS:
    r = J(d + '/results.json')
    gate = r.get('options', {}).get('gate', True)
    date = r.get('date', '')
    for s in r['sets']:
        SET_INFO[s['id']] = s
    engines = [only] if only else list(r['labels'])
    for e in engines:
        if e not in r['labels']:
            continue
        labels[e] = r['labels'][e]
        model = r['models'].get(e, '')
        if model.startswith('baseten:') or model.startswith('self-hosted'):
            model = 'self-hosted streaming deployment'
        models[e] = model
        vc = ('on' if gate else 'off') if e in GATED else 'n/a'
        common = dict(engine=e, engine_label=r['labels'][e], model=model, voice_check=vc, run_date=date)
        for s in r['sets']:
            a = r['aggregates'].get(f"{s['id']}/{e}")
            if not a:
                continue
            ts = dict(test=s['id'], language=s['language'], condition=s['condition'])
            note = 'engine has no option for this language; auto-detected' if a.get('languageNotSupported') else ''
            if s['id'] == 'nonspeech':
                row(benchmark='single-language', **common, **ts, metric='text_returned_on_nonspeech', value=r4(a.get('nonSpeechOutputRate')), unit='% of clips', notes=note)
                continue
            h = a.get('headline') or {}
            unit = 'MER %' if s['language'] == 'zh' else 'WER %'
            row(benchmark='single-language', **common, **ts, metric='error_rate', value=r4(h.get('value')), ci_low=r4(h.get('lo')), ci_high=r4(h.get('hi')), n=h.get('speakers'), unit=unit, notes=note)
            row(benchmark='single-language', **common, **ts, metric='formatted_error_rate', value=r4(a.get('formatted')), unit='% (case and punctuation counted)', notes=note)
        L = r['aggregates'].get(f'latency/{e}')
        if L:
            for k, m in [('waitP50', 'wait_after_speech_p50'), ('waitP90', 'wait_after_speech_p90'), ('connectP50', 'connect_p50'), ('connectP90', 'connect_p90')]:
                row(benchmark='latency', **common, test='all single-language clips', metric=m, value=L.get(k), n=L.get('n'), unit='ms')
        F = r['aggregates'].get(f'failures/{e}')
        if F:
            row(benchmark='reliability', **common, test='all single-language clips', metric='dropped_before_engine', value=F.get('dropped'), n=F.get('clips'), unit='clips')
            row(benchmark='reliability', **common, test='all single-language clips', metric='connection_or_timeout_failures', value=F.get('failed'), n=F.get('clips'), unit='clips')

# Two languages in one recording
cs = J('results/2026-10-14-codeswitch/codeswitch.json')  # 7 engines incl. Zoom; fairness filter over all 7
for k, v in cs['aggregates'].items():
    kind, setting, e = k.split('/')
    if not v.get('fair'):
        continue
    common = dict(benchmark='two-language', engine=e, engine_label=labels.get(e, e), model=models.get(e, ''), voice_check='on' if e in GATED else 'n/a', test='english+other' if kind == 'english' else 'two non-english', setting=setting, n=v['fair'], run_date=cs.get('date', ''))
    row(**common, metric='language_lost', value=round(100 * v['languageLost'] / v['fair'], 2), unit='% of recordings')
    for m in ['englishLost', 'otherLost', 'firstLost', 'secondLost']:
        if m in v and not (kind == 'pair' and m == 'englishLost'):
            row(**common, metric={'englishLost': 'english_half_lost', 'otherLost': 'other_language_lost', 'firstLost': 'first_half_lost', 'secondLost': 'second_half_lost'}[m], value=v[m], unit='recordings')

# Failure analysis (paper), if present
fp = os.path.join(ROOT, 'paper/analysis/failures.json')
if os.path.exists(fp):
    O = json.load(open(fp))['out']
    for e, n in O.get('numbers', {}).items():
        c = dict(benchmark='failure-analysis', engine=e, engine_label=labels.get(e, e), voice_check='off' if e in GATED else 'n/a', test='english dictation')
        row(**c, metric='digits_kept_as_digits', value=round(100 * n.get('digitHit', 0) / n['digitRef'], 1), n=n['digitRef'], unit='%')
        row(**c, metric='digits_spelled_out', value=round(100 * n.get('digitAsWord', 0) / n['digitRef'], 1), n=n['digitRef'], unit='%')
        row(**c, metric='number_words_turned_into_digits', value=round(100 * n.get('wordAsDigit', 0) / n['wordRef'], 1), n=n['wordRef'], unit='%')
    for e, n in O.get('names', {}).items():
        c = dict(benchmark='failure-analysis', engine=e, engine_label=labels.get(e, e), voice_check='off' if e in GATED else 'n/a', test='english dictation')
        row(**c, metric='proper_noun_accuracy', value=round(100 * n['properHit'] / n['properRef'], 1), n=n['properRef'], unit='%')
        row(**c, metric='other_word_accuracy', value=round(100 * n['otherHit'] / n['otherRef'], 1), n=n['otherRef'], unit='%')
    for e, m in O.get('mix:en-dictation-whisper', {}).items():
        c = dict(benchmark='failure-analysis', engine=e, engine_label=labels.get(e, e), voice_check='off' if e in GATED else 'n/a', test='en-dictation-whisper', condition='whisper')
        for k in ['sub', 'del', 'ins']:
            row(**c, metric={'sub': 'substitutions', 'del': 'deletions', 'ins': 'insertions'}[k], value=round(100 * m.get(k, 0) / m['ref'], 1), n=m['ref'], unit='% of reference words')

cols = list(rows[0].keys())
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    w.writerows(rows)
print(f'{len(rows)} rows -> {os.path.relpath(out_path, ROOT)}')

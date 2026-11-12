"""Which systems voted for each proposed edit of the word-for-word references (input to said_loo.ts).

  cache/normenv/bin/python -I paper/analysis/said_votes.py

data/verbatim/draft.json stores only how many systems heard each edit. This repeats the alignment of
tools/verbatim/draft.py and records which systems they were, so said_loo.ts can rebuild the references without one
system's votes. Writes cache/review/said_votes.json (local: it is keyed by clip id, like data/).
"""
import importlib.util, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Import draft.py's functions without running its main block (it writes draft.json at import).
src = open(os.path.join(ROOT, 'tools', 'verbatim', 'draft.py')).read().split('\nmanifest = ')[0]
mod = {'__file__': os.path.join(ROOT, 'tools', 'verbatim', 'draft.py')}
exec(compile(src, 'draft.py', 'exec'), mod)
words, edits, VOTERS, SETS, csv = mod['words'], mod['edits'], mod['VOTERS'], mod['SETS'], mod['csv']

draft = json.load(open(os.path.join(ROOT, 'data', 'verbatim', 'draft.json')))
hyps = {}
for r in csv.DictReader(open(os.path.join(ROOT, 'cache', 'clips', '2026-10-21-main.tsv')), delimiter='\t', quoting=csv.QUOTE_NONE):
    if r['set'] in SETS and r['engine'] in VOTERS and r['run'] == '0' and not r['error']:
        hyps.setdefault(r['clip'], {})[r['engine']] = r['transcript']

out, mismatch = {}, 0
for c in draft['clips']:
    script = words(' '.join(c['script']))
    keyed = [i for i, (_, k) in enumerate(script) if k]
    ref_keys = [script[i][1] for i in keyed]
    votes = {}
    for eng, text in hyps.get(c['id'], {}).items():
        for typ, at, w in set(edits(ref_keys, words(text))):
            pos = keyed[at] if at < len(keyed) else len(script)
            votes.setdefault((typ, pos, w), []).append(eng)
    row = []
    for p in c['proposals']:
        v = sorted(votes.get((p['type'], p['at'], p['words']), []))
        if len(v) != p['systems']:
            mismatch += 1
        row.append(v)
    out[c['id']] = row
os.makedirs(os.path.join(ROOT, 'cache', 'review'), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, 'cache', 'review', 'said_votes.json'), 'w'))
print(f"{sum(len(v) for v in out.values())} proposals, {mismatch} with a voter count that differs from draft.json", file=sys.stderr)

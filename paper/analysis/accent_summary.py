"""Summarises cache/accent/<name>.json (from accent.py): whole-clip labels, and from the sliding windows the
accents a clip moves between. A window counts when its top label has probability >= CONF; a switch is a change of
label between consecutive counted windows.   python3 paper/analysis/accent_summary.py inhouse [ears-regular ...]"""
import json, sys
from collections import Counter
CONF = 0.7
for name in sys.argv[1:]:
    d = json.load(open(f'cache/accent/{name}.json')); L = d['labels']
    print(f'== {name}: {len(d["clips"])} clips')
    by = {}
    for cid, c in d['clips'].items(): by.setdefault(c['set'], []).append(c)
    for s, cs in by.items():
        top = Counter(L[max(range(len(L)), key=lambda i: c['probs'][i])] for c in cs)
        wins = [w for c in cs for w in c['windows']]
        conf = [w for w in wins if max(w['probs']) >= CONF]
        wl = Counter(L[w['probs'].index(max(w['probs']))] for w in conf)
        sw, multi, nsw = 0, 0, 0
        for c in cs:
            seq = [L[w['probs'].index(max(w['probs']))] for w in c['windows'] if max(w['probs']) >= CONF]
            k = sum(a != b for a, b in zip(seq, seq[1:])); nsw += k
            sw += k > 0; multi += len(set(seq)) >= 2
        print(f'  {s}: {len(cs)} clips; whole-clip top {dict(top.most_common(5))}')
        print(f'    windows {len(wins)}, confident {len(conf)} ({100*len(conf)/max(1,len(wins)):.0f}%): {dict(wl.most_common(6))}')
        print(f'    clips with >=1 switch {sw}/{len(cs)} ({nsw} switches); clips with >=2 confident accents {multi}')

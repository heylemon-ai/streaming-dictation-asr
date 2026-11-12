"""Drafts word-for-word references for the 106 in-house English recordings, for a person to confirm.

  <venv with whisper-normalizer>/bin/python -I tools/verbatim/draft.py

The reader was given a script, but sometimes said something slightly different (an added "so", a repeated word, a
changed word). This lines every verbatim-style system's transcript up with the script and proposes an edit to the
script wherever several systems heard the same deviation:
  - systems: the eleven distinct systems in their word-for-word settings (Gemini Smart and ElevenLabs NV remove
    fillers by design, so they do not vote);
  - an added word is proposed (pre-ticked) when at least 4 systems added exactly the same words at the same place, and
    a dropped or changed word when at least 6 did (a majority); one fewer system lists it unticked;
  - an edit that only rewrites a number, currency or time next to a number in the script ("$5" / "five dollars")
    is not proposed;
  - differences in how a number or spelling is written ("7" / "seven", "OK" / "okay") are not edits: words that
    Whisper's English normaliser makes equal count as the same word.
Writes data/verbatim/draft.json (local, git-ignored with the rest of data/: it contains the private scripts).
"""
import csv, json, os, re, sys
from whisper_normalizer.english import EnglishTextNormalizer

csv.field_size_limit(sys.maxsize)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VOTERS = ['whisper-self-hosted', 'qwen', 'meta', 'gemini', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro', 'zoom-scribe',
          'elevenlabs-scribe', 'openai-live-transcribe-low', 'openai-realtime-whisper']
SETS = ['en-dictation', 'en-dictation-noise', 'en-dictation-whisper']
# Added words need 4 systems; a dropped or changed word needs a majority (6 of 11), because on whispered clips four
# systems (both AAI models, Zoom, Qwen) drop the same quiet words, and that is their error, not the reader's.
NEED = {'ins': (4, 3), 'del': (6, 5), 'sub': (6, 5)}
NUMBERISH = re.compile(r"^(\d[\d.,:%]*|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\w+teen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|dollars?|cents?|percent|pm|am|first|second|third|\w+th)$")
norm = EnglishTextNormalizer()


def key(w):
    k = re.sub(r"[^\w']", '', w.lower().replace('’', "'"))
    return norm(k) or k


def words(text):
    """Display words and their comparison keys; words that are only punctuation are kept for display, keyless."""
    out = []
    for w in text.split():
        out.append((w, key(w)))
    return out


def align(ref, hyp):
    """Levenshtein alignment of key lists; returns ops: ('eq'|'sub'|'del', i, j) and ('ins', i, j)."""
    n, m = len(ref), len(hyp)
    d = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1): d[i][0] = i
    for j in range(m + 1): d[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (ref[i - 1] != hyp[j - 1]))
    ops, i, j = [], n, m
    while i or j:
        if i and j and d[i][j] == d[i - 1][j - 1] + (ref[i - 1] != hyp[j - 1]):
            ops.append(('eq' if ref[i - 1] == hyp[j - 1] else 'sub', i - 1, j - 1)); i, j = i - 1, j - 1
        elif i and d[i][j] == d[i - 1][j] + 1:
            ops.append(('del', i - 1, j)); i -= 1
        else:
            ops.append(('ins', i, j - 1)); j -= 1
    return ops[::-1]


def edits(ref_keys, hyp):
    """A system's changes to the script as hashable edits: ('ins', before_index, words), ('del', index, ''),
    ('sub', index, word). Consecutive inserted words at one place form one edit."""
    hk = [k for _, k in hyp if k]
    hw = [w for w, k in hyp if k]
    out, pending = [], None
    for op, i, j in align(ref_keys, hk):
        if op == 'ins':
            pending = (i, (pending[1] + ' ' if pending and pending[0] == i else '') + hw[j])
            continue
        if pending:
            out.append(('ins', pending[0], pending[1])); pending = None
        if op == 'del': out.append(('del', i, ''))
        elif op == 'sub': out.append(('sub', i, hw[j]))
    if pending:
        out.append(('ins', pending[0], pending[1]))
    return out


manifest = {r['id']: r for r in csv.DictReader(open(os.path.join(ROOT, 'data', 'manifest.tsv')), delimiter='\t', quoting=csv.QUOTE_NONE)}
hyps = {}
for r in csv.DictReader(open(os.path.join(ROOT, 'cache', 'clips', '2026-10-21-main.tsv')), delimiter='\t', quoting=csv.QUOTE_NONE):
    if r['set'] in SETS and r['engine'] in VOTERS and r['run'] == '0' and not r['error']:
        hyps.setdefault(r['clip'], {})[r['engine']] = r['transcript']

clips = []
for cid, m in manifest.items():
    if m['set'] not in SETS:
        continue
    script = words(m['reference'])
    keyed = [i for i, (_, k) in enumerate(script) if k]           # positions of real words in the display list
    ref_keys = [script[i][1] for i in keyed]
    votes = {}
    for eng, text in hyps.get(cid, {}).items():
        for e in set(edits(ref_keys, words(text))):
            votes.setdefault(e, []).append(eng)
    props = []
    for (typ, at, w), engs in sorted(votes.items(), key=lambda x: (x[0][1], x[0][0])):
        propose, show = NEED[typ]
        if len(engs) < show:
            continue
        pos = keyed[at] if at < len(keyed) else len(script)       # index in the display word list
        near = ' '.join(script[max(0, pos - 2):pos + 2][k][0] for k in range(len(script[max(0, pos - 2):pos + 2])))
        if re.search(r'\d|\$', near) and all(NUMBERISH.match(t) for t in (w or script[pos][1]).lower().split()):
            continue
        props.append({'type': typ, 'at': pos, 'words': w, 'systems': len(engs), 'of': len(hyps.get(cid, {})),
                      'proposed': len(engs) >= propose, 'old': script[pos][0] if typ != 'ins' and pos < len(script) else ''})
    clips.append({'id': cid, 'set': m['set'], 'file': m['file'], 'duration': float(m['duration_sec']),
                  'script': [w for w, _ in script], 'proposals': props})

os.makedirs(os.path.join(ROOT, 'data', 'verbatim'), exist_ok=True)
json.dump({'thresholds': NEED, 'voters': VOTERS, 'clips': clips},
          open(os.path.join(ROOT, 'data', 'verbatim', 'draft.json'), 'w'), indent=1)
n = sum(len(c['proposals']) for c in clips); pre = sum(p['proposed'] for c in clips for p in c['proposals'])
print(f"{len(clips)} clips, {n} spots shown, {pre} pre-ticked, {sum(1 for c in clips if not c['proposals'])} clips with nothing to check")

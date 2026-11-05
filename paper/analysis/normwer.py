"""English WER with numbers and spellings normalised, next to the as-written WER, and whether the lowest row in each
English column is clearly lower than the next (paired bootstrap over clips). Reads the main run's per-clip transcripts
(cache/clips/2026-10-21-main.tsv, local only); writes aggregates only.

  <venv>/bin/python -I paper/analysis/normwer.py > paper/analysis/normwer.json

Needs whisper-normalizer (pip install whisper-normalizer==0.1.12), the English normaliser published with Whisper:
it turns number words into digits ("seven" -> "7", "twenty five dollars" -> "$25"), expands contractions and
standardises British/American spellings. Applied to both the reference and the transcript.
"""
import csv, json, random, re, sys

from whisper_normalizer.english import EnglishTextNormalizer

csv.field_size_limit(sys.maxsize)
ROWS = ['whisper-self-hosted', 'qwen', 'meta', 'gemini', 'gemini-smart', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro', 'zoom-scribe', 'elevenlabs-scribe', 'elevenlabs-scribe-clean', 'openai-live-transcribe-low', 'openai-realtime-whisper']
SETS = ['en-dictation', 'en-dictation-noise', 'en-dictation-whisper']
norm = EnglishTextNormalizer()
plain = lambda t: re.sub(r"[^\w' ]+", ' ', t.lower().replace('’', "'")).split()


def edits(r, h):
    """Word-level Levenshtein distance."""
    prev = list(range(len(h) + 1))
    for i, rw in enumerate(r, 1):
        cur = [i] + [0] * len(h)
        for j, hw in enumerate(h, 1):
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (rw != hw))
        prev = cur
    return prev[-1]


clips = {}
for row in csv.DictReader(open('cache/clips/2026-10-21-main.tsv'), delimiter='\t', quoting=csv.QUOTE_NONE):
    if row['set'] in SETS and row['engine'] in ROWS and row['run'] == '0':
        ref, hyp = row['reference'], row['transcript'] or ''
        n_ref, n_hyp = norm(ref).split(), norm(hyp).split()
        clips.setdefault(row['set'], {}).setdefault(row['engine'], {})[row['clip']] = {
            'raw': (edits(plain(ref), plain(hyp)), len(plain(ref))),
            'norm': (edits(n_ref, n_hyp), len(n_ref)),
        }

rate = lambda pairs: 100 * sum(e for e, _ in pairs) / max(1, sum(n for _, n in pairs))
out = {'wer': {}, 'best': {}}
for s in SETS:
    out['wer'][s] = {e: {k: round(rate([c[k] for c in clips[s][e].values()]), 1) for k in ('raw', 'norm')} for e in ROWS}
    for k in ('raw', 'norm'):
        order = sorted(ROWS, key=lambda e: out['wer'][s][e][k])
        a, b = order[0], order[1]
        ids = sorted(set(clips[s][a]) & set(clips[s][b]))
        rnd, diffs = random.Random(11), []
        for _ in range(2000):
            pick = [rnd.choice(ids) for _ in ids]
            diffs.append(rate([clips[s][a][i][k] for i in pick]) - rate([clips[s][b][i][k] for i in pick]))
        diffs.sort()
        out['best'][f'{s}/{k}'] = {'best': a, 'next': b, 'hi': round(diffs[int(0.975 * 1999)], 2), 'clear': diffs[int(0.975 * 1999)] < 0}
print(json.dumps(out, indent=1))

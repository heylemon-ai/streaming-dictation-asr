"""When the first finalised text arrives, and the waits net of the network round trip, for the latency table.
Writes paper/analysis/ttft.json. Only aggregates are written.

  python3 -I paper/analysis/ttft.py

Reads the 29 October runs of the 106 English messages (cache/clips/2026-10-29-ttft-*.tsv, local only), made after the
test client started recording the arrival of the first finalised text, and paper/analysis/rtt.json (rtt.py), the
round trip to each provider measured during those runs. First text: from the start of playback to the first finalised
text. Live: the share of messages whose first finalised text arrived before the audio ended. Partial (not yet final)
text is not counted, because not every system was asked for it (Appendix, Table settings).
"""
import csv, glob, json, statistics, sys

csv.field_size_limit(sys.maxsize)
PROVIDER = {'whisper-self-hosted': 'baseten', 'qwen': 'baseten', 'meta': 'meta', 'gemini': 'gemini', 'gemini-smart': 'gemini',
            'deepgram': 'deepgram', 'assemblyai-3-6-pro': 'assemblyai', 'assemblyai-3-5-pro': 'assemblyai', 'zoom-scribe': 'zoom',
            'elevenlabs-scribe': 'elevenlabs', 'elevenlabs-scribe-clean': 'elevenlabs', 'openai-live-transcribe-low': 'openai',
            'openai-realtime-whisper': 'openai'}
rtt = json.load(open('paper/analysis/rtt.json'))
by = {}
for path in sorted(glob.glob('cache/clips/2026-10-29-ttft-*.tsv')):
    for r in csv.DictReader(open(path), delimiter='\t', quoting=csv.QUOTE_NONE):
        if r['run'] != '0' or r['error'] or not r.get('first_final_ms'):
            continue
        by.setdefault(r['engine'], []).append(r)
out = {}
for e, rs in sorted(by.items()):
    first = [int(r['first_final_ms']) / 1000 for r in rs]
    live = [r for r in rs if r['first_final_before_end'] == 'true']
    wait = statistics.median(int(r['latency_ms']) for r in rs)
    rt = rtt.get(PROVIDER[e], {}).get('median')
    out[e] = {'messages': len(rs), 'firstTextS': round(statistics.median(first), 1), 'livePct': round(100 * len(live) / len(rs)),
              'liveFirstTextS': round(statistics.median(int(r['first_final_ms']) / 1000 for r in live), 1) if live else None,
              'waitP50': round(wait), 'rttP50': rt, 'waitMinusRtt': round(wait - rt) if rt is not None else None}
json.dump(out, open('paper/analysis/ttft.json', 'w'), indent=1)
print(json.dumps(out, indent=1))

"""Network round trip from the test machine to each provider, so the waits in the paper can be read net of it.

  python3 -I paper/analysis/rtt.py probe <minutes>    # while a run is going: appends to cache/rtt.jsonl
  python3 -I paper/analysis/rtt.py summary            # median per provider -> paper/analysis/rtt.json

One TCP handshake takes one round trip, so its time is taken as the round trip (DNS is resolved beforehand and not
counted). Each provider is probed 3 times a minute. The Baseten host names carry deployment ids, so they are read
from .env and only the provider name is written.
"""
import json, os, socket, statistics, sys, time

HOSTS = {'deepgram': 'api.deepgram.com', 'elevenlabs': 'api.elevenlabs.io', 'openai': 'api.openai.com', 'zoom': 'api.zoom.us',
         'assemblyai': 'streaming.assemblyai.com', 'meta': 'api.meta.ai', 'gemini': 'generativelanguage.googleapis.com'}
OUT = 'cache/rtt.jsonl'


def baseten():
    env = dict(l.strip().split('=', 1) for l in open('.env') if '=' in l and not l.startswith('#'))
    mid = env.get('BASETEN_WHISPER_SELF_HOSTED_MODEL_ID', '').strip('"\'')
    return {'baseten': f'model-{mid}.api.baseten.co'} if mid else {}


def handshake_ms(ip):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(5)
    t = time.perf_counter()
    try:
        s.connect((ip, 443))
        return (time.perf_counter() - t) * 1000
    except OSError:
        return None
    finally:
        s.close()


if sys.argv[1] == 'probe':
    hosts = {**HOSTS, **baseten()}
    end = time.time() + 60 * float(sys.argv[2])
    with open(OUT, 'a') as f:
        while time.time() < end:
            for name, h in hosts.items():
                try:
                    ip = socket.gethostbyname(h)
                except OSError:
                    continue
                for _ in range(3):
                    ms = handshake_ms(ip)
                    if ms is not None:
                        f.write(json.dumps({'provider': name, 'ms': round(ms, 1), 'at': int(time.time())}) + '\n')
            f.flush()
            time.sleep(60)
else:
    by = {}
    for l in open(OUT):
        r = json.loads(l)
        by.setdefault(r['provider'], []).append(r['ms'])
    out = {k: {'samples': len(v), 'median': round(statistics.median(v)), 'p90': round(sorted(v)[int(0.9 * len(v))])} for k, v in sorted(by.items())}
    json.dump(out, open('paper/analysis/rtt.json', 'w'), indent=1)
    print(out)

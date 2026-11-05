"""Local page for confirming the word-for-word references (localhost only; the scripts and audio are private).

  python3 tools/verbatim/server.py [port]       then open http://localhost:5196

Serves the page, data/verbatim/draft.json (from draft.py), the clips' audio from data/, and keeps every decision in
data/verbatim/decisions.json, saved on each change. paper/analysis/verbatim.ts applies the decisions to the draft to make the references.
"""
import functools, http.server, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, 'data')
DECISIONS = os.path.join(DATA, 'verbatim', 'decisions.json')


class Handler(http.server.SimpleHTTPRequestHandler):
    def send_json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split('?')[0]
        if path in ('/', '/index.html'):
            return self.send_file(os.path.join(HERE, 'index.html'), 'text/html; charset=utf-8')
        if path == '/draft':
            return self.send_file(os.path.join(DATA, 'verbatim', 'draft.json'), 'application/json')
        if path == '/decisions':
            return self.send_json(json.load(open(DECISIONS)) if os.path.exists(DECISIONS) else {})
        if path.startswith('/audio/'):
            rel = os.path.normpath(path[len('/audio/'):]).lstrip('/')
            full = os.path.join(DATA, rel)
            if not full.startswith(DATA) or not rel.endswith('.wav'):
                return self.send_error(404)
            return self.send_file(full, 'audio/wav')
        self.send_error(404)

    def do_POST(self):
        if self.path != '/decisions':
            return self.send_error(404)
        body = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        tmp = DECISIONS + '.tmp'
        json.dump(body, open(tmp, 'w'), indent=1)
        os.replace(tmp, DECISIONS)
        self.send_json({'ok': True})

    def send_file(self, path, ctype):
        """Serves a file, honouring a single byte Range (the audio player needs it to seek and resume)."""
        if not os.path.exists(path):
            return self.send_error(404)
        data = open(path, 'rb').read()
        start, end = 0, len(data) - 1
        rng = self.headers.get('Range', '')
        if rng.startswith('bytes='):
            a, _, b = rng[6:].split(',')[0].partition('-')
            if a:
                start, end = int(a), min(int(b), end) if b else end
            elif b:
                start = max(0, len(data) - int(b))
            if start > end:
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{len(data)}')
                self.end_headers()
                return
            self.send_response(206)
            self.send_header('Content-Range', f'bytes {start}-{end}/{len(data)}')
        else:
            self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        self.wfile.write(data[start:end + 1])

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5196
    print(f'http://localhost:{port}')
    http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()

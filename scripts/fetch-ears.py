"""Builds data-external/ears/ (EARS, CC BY-NC 4.0) for the benchmark: every speaker, Rainbow Passage parts 1-4,
whispered and read normally, as 16 kHz mono 16-bit WAV with transcripts.tsv per set.

  python3 scripts/fetch-ears.py

Each speaker's archive is read with HTTP range requests and only the 8 needed files are taken; each is converted
with ffmpeg and the 48 kHz original is never kept, so the whole set stays under ~200 MB. Safe to re-run: clips
already converted are skipped. Speaker gender comes from the dataset's speaker_statistics.json.
EARS is third-party audio: it lives in data-external/, apart from our own data/, and is never committed.
"""
import io, json, os, re, subprocess, sys, tempfile, urllib.request, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'data-external', 'ears')
BASE = 'https://github.com/facebookresearch/ears_dataset'
PARTS = [1, 2, 3, 4]
STYLES = ['whisper', 'regular']


class RangeFile(io.RawIOBase):
    """A remote file read on demand with HTTP range requests, so zipfile can pick single entries."""

    def __init__(self, url):
        r = urllib.request.urlopen(urllib.request.Request(url, method='HEAD'), timeout=60)
        self.url, self.size, self.pos = r.url, int(r.headers['Content-Length']), 0

    def seekable(self): return True
    def readable(self): return True
    def tell(self): return self.pos

    def seek(self, off, whence=0):
        self.pos = off if whence == 0 else self.pos + off if whence == 1 else self.size + off
        return self.pos

    def readinto(self, b):
        if self.pos >= self.size:
            return 0
        end = min(self.size, self.pos + len(b)) - 1
        data = urllib.request.urlopen(urllib.request.Request(self.url, headers={'Range': f'bytes={self.pos}-{end}'}), timeout=120).read()
        b[:len(data)] = data
        self.pos += len(data)
        return len(data)


def get_json(path):
    return json.loads(urllib.request.urlopen(f'https://raw.githubusercontent.com/facebookresearch/ears_dataset/main/{path}', timeout=60).read())


def main():
    texts = get_json('transcripts.json')
    speakers = get_json('speaker_statistics.json')
    for style in STYLES:
        os.makedirs(os.path.join(OUT, f'ears-{style}'), exist_ok=True)
    for sp in sorted(speakers):
        want = {f'rainbow_0{n}_{s}': (n, s) for n in PARTS for s in STYLES}
        todo = {k: v for k, v in want.items() if not os.path.exists(os.path.join(OUT, f'ears-{v[1]}', f'{sp}-rainbow{v[0]}-{v[1]}.wav'))}
        if not todo:
            continue
        z = zipfile.ZipFile(io.BufferedReader(RangeFile(f'{BASE}/releases/download/dataset/{sp}.zip'), buffer_size=1 << 20))
        for name in z.namelist():
            m = re.search(r'(rainbow_0\d_(?:whisper|regular))\.wav$', name)
            if not m or m.group(1) not in todo:
                continue
            n, s = todo[m.group(1)]
            with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
                tmp.write(z.read(name))
                tmp.flush()
                subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp.name, '-ac', '1', '-ar', '16000', '-sample_fmt', 's16',
                                os.path.join(OUT, f'ears-{s}', f'{sp}-rainbow{n}-{s}.wav')], check=True)
        print(sp, flush=True)
    for style in STYLES:
        rows = ['file\treference\tspeaker\tgender\tdialect\tsource_id']
        for sp in sorted(speakers):
            for n in PARTS:
                f = f'{sp}-rainbow{n}-{style}.wav'
                if os.path.exists(os.path.join(OUT, f'ears-{style}', f)):
                    rows.append(f"{f}\t{texts[f'rainbow_0{n}_{style}']}\t{sp}\t{speakers[sp].get('gender', '')}\t\tEARS {sp} rainbow_0{n}_{style}")
        open(os.path.join(OUT, f'ears-{style}', 'transcripts.tsv'), 'w').write('\n'.join(rows) + '\n')
        print(style, len(rows) - 1, 'clips')


if __name__ == '__main__':
    sys.exit(main())

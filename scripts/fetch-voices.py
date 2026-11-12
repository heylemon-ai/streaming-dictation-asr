"""Builds data-external/voices/raw/ from the VOiCES devkit (CC BY 4.0) without storing the 30 GB archive.

  python3 scripts/fetch-voices.py            (then: python3 scripts/build-voices-sets.py)

VOiCES is only distributed as .tar.gz archives, which cannot be read out of order, so the archive is streamed
once and only the files we want are written:
  - 100 sentences, one per speaker: the first sentences met in the first room's far-microphone speech folders
    (whichever of no distractor, babble or TV the archive reaches first, so no version has already gone by);
  - for each, every far-position microphone recording with no distractor, babble and TV;
  - each sentence's clean source recording;
  - every small non-audio file (transcripts, speaker lists, documentation).
Streaming stops as soon as all of these are in hand. Progress is printed every 500 MB.
VOiCES is third-party audio: it lives in data-external/, apart from our own data/, and is never committed.
"""
import os, re, sys, tarfile, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'data-external', 'voices', 'raw')
URL = 'https://lab41openaudiocorpus.s3.amazonaws.com/VOiCES_devkit.tar.gz'
N_SENTENCES = 100
NOISES = ('none', 'babb', 'tele')
DISTANT = re.compile(r'Lab41-SRI-VOiCES-(rm\d)-(none|babb|musi|tele)-sp(\d+)-ch(\d+)-sg(\d+)-mc(\d+)-(\w+?)-(\w+?)-dg(\d+)\.wav$')
SOURCE = re.compile(r'Lab41-SRI-VOiCES-src-sp(\d+)-ch(\d+)-sg(\d+)\.wav$')


class Counting:
    """The archive as one byte stream. A stalled or dropped connection is reopened at the next byte with an HTTP
    range request, so the gzip/tar reader downstream never sees the break."""

    def __init__(self, url): self.url, self.n, self.mark, self.r = url, 0, 0, None

    def read(self, k=-1):
        for attempt in range(20):
            try:
                if self.r is None:
                    req = urllib.request.Request(self.url, headers={'Range': f'bytes={self.n}-'} if self.n else {})
                    self.r = urllib.request.urlopen(req, timeout=120)
                b = self.r.read(k if k and k > 0 else 1 << 20)
                break
            except Exception as e:
                print(f'  reconnecting at {self.n / 1e9:.2f} GB after {type(e).__name__}', flush=True)
                self.r = None
                time.sleep(min(60, 2 ** attempt))
        else:
            raise RuntimeError('gave up after 20 reconnects')
        self.n += len(b)
        if self.n - self.mark >= 500_000_000:
            self.mark = self.n
            print(f'  {self.n / 1e9:.1f} GB streamed', flush=True)
        return b


def main():
    os.makedirs(OUT, exist_ok=True)
    chosen = {}          # (sp, ch, sg) -> room the sentence was chosen in
    have = set()         # (sp, ch, sg, kind) with kind in NOISES or 'src'
    meta = False
    src = Counting(URL)
    with tarfile.open(fileobj=src, mode='r|gz') as t:
        for m in t:
            if not m.isfile():
                continue
            name = os.path.basename(m.name)
            d = DISTANT.search(name)
            s = SOURCE.search(name)
            keep = False
            if d:
                room, noise, sp, ch, sg, mc, mtype, pos, dg = d.groups()
                key = (sp, ch, sg)
                if noise in NOISES and pos == 'far' and key not in chosen and len(chosen) < N_SENTENCES and all(k[0] != sp for k in chosen):
                    chosen[key] = room
                if key in chosen and chosen[key] == room and noise in NOISES and pos == 'far':
                    keep = True
                    have.add(key + (noise,))
            elif s:
                key = s.groups()
                if key in chosen:
                    keep = True
                    have.add(key + ('src',))
            elif not name.endswith('.wav') and m.size < 50_000_000:
                keep = True
                meta = meta or bool(re.search(r'transcript|refer', m.name, re.I))
            if keep:
                rel = m.name.split('/', 1)[-1] if not d and not s else name
                dst = os.path.join(OUT, rel)
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                with t.extractfile(m) as f, open(dst, 'wb') as g:
                    g.write(f.read())
            full = len(chosen) == N_SENTENCES and all(k + (kind,) in have for k in chosen for kind in NOISES + ('src',))
            if full and meta:
                print(f'complete after {src.n / 1e9:.1f} GB', flush=True)
                break
    missing = [k for k in chosen for kind in NOISES + ('src',) if k + (kind,) not in have]
    print(f'sentences {len(chosen)}, files kept {len(have)}, transcripts found: {meta}, missing pieces: {len(missing)}')


if __name__ == '__main__':
    sys.exit(main())

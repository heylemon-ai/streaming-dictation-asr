"""TEN VAD over stdin/stdout, one process per recording (fresh model state each time).

Reads frames of 256 little-endian int16 samples (16 ms at 16 kHz) from stdin and writes
one line per frame: "<probability> <flag>". Threshold 0.5, TEN VAD's default.
"""
import sys
import numpy as np
from ten_vad import TenVad

HOP = 256
vad = TenVad(hop_size=HOP, threshold=0.5)
inp, out = sys.stdin.buffer, sys.stdout
while True:
    b = inp.read(HOP * 2)
    if len(b) < HOP * 2:
        break
    p, flag = vad.process(np.frombuffer(b, dtype=np.int16))
    out.write(f"{float(p):.6f} {int(flag)}\n")
    out.flush()

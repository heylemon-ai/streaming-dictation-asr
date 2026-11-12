"""Accent labels for recordings, from CommonAccent (Zuluaga-Gomez et al., Interspeech 2023; English, 16 accents).

  cache/accentenv/bin/python -I paper/analysis/accent.py <data_root> <manifest.tsv> <sets,comma|*> <out.json> [win_s hop_s]

The model is rebuilt here from its hyperparams.yaml rather than by running the repository's own code:
wav2vec2-large-xlsr-53 (the fine-tuned weights in wav2vec2.ckpt) -> layer norm on the last hidden state (output_norm)
-> mean over time (StatisticsPooling without std) -> Linear(1024, 16, no bias) -> softmax. The input is normalised to
zero mean and unit variance, as speechbrain's Wav2Vec2 wrapper does for XLSR. Files live in cache/models/ (git-ignored):
cache/models/commonaccent (Jzuluaga/accent-id-commonaccent_xlsr-en-english) and cache/models/xlsr-config
(config.json of facebook/wav2vec2-large-xlsr-53). Check: the model's four sample files come out as their own labels.

Writes, per clip, the whole-clip probabilities and the probabilities for sliding windows (default 4 s every 2 s), to
a git-ignored path under cache/. No audio or text is written.
"""
import csv, json, sys
import numpy as np, soundfile as sf, torch
import torch.nn.functional as F
from transformers import Wav2Vec2Config, Wav2Vec2Model

csv.field_size_limit(sys.maxsize)
MODEL, CONFIG = 'cache/models/commonaccent', 'cache/models/xlsr-config'
droot, manifest, sets, outp = sys.argv[1:5]
win, hop = (float(sys.argv[5]), float(sys.argv[6])) if len(sys.argv) > 6 else (4.0, 2.0)
labels = [l.split("'")[1] for l in open(f'{MODEL}/label_encoder.txt') if '=>' in l and 'starting_index' not in l]
w2v = Wav2Vec2Model(Wav2Vec2Config.from_pretrained(CONFIG))
sd = torch.load(f'{MODEL}/wav2vec2.ckpt', map_location='cpu', weights_only=True)
missing, unexpected = w2v.load_state_dict({k.removeprefix('model.'): v for k, v in sd.items()}, strict=False)
assert not [m for m in missing if 'masked_spec_embed' not in m] and not unexpected, (missing[:5], unexpected[:5])
W = torch.load(f'{MODEL}/model.ckpt', map_location='cpu', weights_only=True)['0.w.weight']  # [16, 1024]
dev = 'mps' if torch.backends.mps.is_available() else 'cpu'
w2v.eval().to(dev); W = W.to(dev)


@torch.no_grad()
def probs(x):
    x = torch.tensor(x, dtype=torch.float32, device=dev)
    x = (x - x.mean()) / (x.std() + 1e-7)
    h = w2v(x[None]).last_hidden_state
    h = F.layer_norm(h, h.shape[-1:])
    return torch.softmax(h.mean(1) @ W.T, -1)[0].cpu().numpy()


r3 = lambda p: [round(float(v), 3) for v in p]
rows = [r for r in csv.DictReader(open(manifest), delimiter='\t', quoting=csv.QUOTE_NONE) if sets == '*' or r['set'] in sets.split(',')]
out = {'labels': labels, 'window': win, 'hop': hop, 'clips': {}}
for i, r in enumerate(rows):
    a, sr = sf.read(f"{droot}/{r['file']}", dtype='float32')
    if a.ndim > 1: a = a.mean(1)
    assert sr == 16000, sr
    whole = probs(a)
    wins = [{'t': round(float(s), 1), 'probs': r3(probs(a[int(s * sr): int((s + win) * sr)]))}
            for s in np.arange(0, max(0.0, len(a) / sr - win) + 1e-6, hop)]
    out['clips'][r['id']] = {'set': r['set'], 'speaker': r.get('speaker', ''), 'dur': round(len(a) / sr, 1), 'probs': r3(whole), 'windows': wins}
    print(i + 1, len(rows), r['id'], labels[int(whole.argmax())], round(float(whole.max()), 2), flush=True)
json.dump(out, open(outp, 'w'))

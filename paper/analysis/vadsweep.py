"""Collects the VAD threshold sweep into paper/analysis/vadsweep.json for make_figures.py and make_tables.py.

  python3 paper/analysis/vadsweep.py

Thresholds 0.2-0.4 come from the sweep run (results/*-vad-sweep); 0.5 is the self-hosted dropping setups of the
Whisper family run. The share of whispered audio each VAD calls speech comes from vadshare.json.
"""
import glob, json

TH = [0.2, 0.3, 0.4, 0.5]
sweep = json.load(open(sorted(glob.glob('results/*-vad-sweep/results.json'))[-1]))['aggregates']
fam = json.load(open('results/2026-10-21-whisper-family/results.json'))['aggregates']
share = json.load(open('paper/analysis/vadshare.json'))['shareOfWindowsAtOrAbove']


def engine(vad, t):
    if t == 0.5:
        return ('whisper-self-hosted-ten-vad' if vad == 'ten' else 'whisper-self-hosted-vad'), fam
    return f"whisper-self-hosted-{'ten-' if vad == 'ten' else ''}vad-t0{int(t * 10)}", sweep


out = {'thresholds': TH}
for key, set_, field in [('whisperWer', 'en-dictation-whisper', 'wer'), ('noiseWer', 'en-dictation-noise', 'wer'), ('silenceText', 'nonspeech', 'text')]:
    out[key] = {}
    for vad in ('silero', 'ten'):
        vals = []
        for t in TH:
            e, src = engine(vad, t)
            a = src[f'{set_}/{e}']
            vals.append(round(a['headline']['value'] * 100, 1) if field == 'wer' else round(a['nonSpeechOutputRate'] * 10))
        out[key][vad] = vals
out['speechShare'] = {vad: [share['en-dictation-whisper'][vad][str(t)] for t in TH] for vad in ('silero', 'ten')}
out['silenceShare'] = {vad: [share['nonspeech'][vad][str(t)] for t in TH] for vad in ('silero', 'ten')}
json.dump(out, open('paper/analysis/vadsweep.json', 'w'), indent=1)
print(json.dumps(out))

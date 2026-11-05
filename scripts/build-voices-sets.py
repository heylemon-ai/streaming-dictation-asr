"""Turns the VOiCES sample in data-external/voices/raw/ (scripts/fetch-voices.py) into four benchmark sets:

  voices-clean       the original LibriSpeech recording of each sentence (VOiCES "source")
  voices-far         the same sentence replayed in the room, far microphone, no distractor
  voices-far-babble  far microphone, babble playing
  voices-far-tv      far microphone, television playing

  python3 scripts/build-voices-sets.py && ASR_DATA=data-external/voices npm run manifest

References come from LibriSpeech (references/librispeech_text.tsv: id, text), the corpus VOiCES replays: upper case,
no punctuation, numbers written as words, so only word error rates are meaningful for these sets. Speaker gender
comes from the devkit's references/Test-Set_Speakers.csv. Each sentence keeps the same source_id in all four sets,
so the versions can be paired.
"""
import csv, json, os, re, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, 'data-external', 'voices')
RAW = os.path.join(BASE, 'raw')
SETS = {'src': ('voices-clean', 'clean', 'original recording'), 'none': ('voices-far', 'far', 'far microphone, no distractor'),
        'babb': ('voices-far-babble', 'far+babble', 'far microphone, babble'), 'tele': ('voices-far-tv', 'far+tv', 'far microphone, television')}

text = {r['id']: r['text'] for r in csv.DictReader(open(os.path.join(RAW, 'references', 'librispeech_text.tsv')), delimiter='\t')}
gender = {str(int(r['Speaker'])): r['Gender'] for r in csv.DictReader(open(os.path.join(RAW, 'references', 'Test-Set_Speakers.csv')))}
rows = {k: [] for k in SETS}
for f in sorted(os.listdir(RAW)):
    m = re.search(r'-(src|none|babb|tele)-sp(\d+)-ch(\d+)-sg(\d+)', f) or re.search(r'-(src)-sp(\d+)-ch(\d+)-sg(\d+)', f)
    if not f.endswith('.wav') or not m:
        continue
    kind, sp, ch, sg = m.groups()
    lid = f'{int(sp)}-{int(ch)}-{int(sg):04d}'
    if lid not in text:
        raise SystemExit(f'no transcript for {lid}')
    set_id = SETS[kind][0]
    os.makedirs(os.path.join(BASE, set_id), exist_ok=True)
    out = f'sp{sp}-ch{ch}-sg{sg}.wav'
    shutil.copyfile(os.path.join(RAW, f), os.path.join(BASE, set_id, out))
    rows[kind].append([out, text[lid].lower(), f'sp{int(sp)}', gender.get(str(int(sp)), ''), '', f'VOiCES {f[:-4]}'])
for kind, (set_id, _, _) in SETS.items():
    with open(os.path.join(BASE, set_id, 'transcripts.tsv'), 'w') as g:
        g.write('file\treference\tspeaker\tgender\tdialect\tsource_id\n')
        g.writelines('\t'.join(r) + '\n' for r in rows[kind])
    print(set_id, len(rows[kind]), 'clips')
json.dump({'sets': [{'id': s, 'language': 'en', 'condition': c, 'source': f'VOiCES devkit (CC BY 4.0), room 4, {d}'} for s, c, d in SETS.values()]},
          open(os.path.join(BASE, 'sets.json'), 'w'), indent=2)

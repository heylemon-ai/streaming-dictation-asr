# Third-party audio (kept apart from our own recordings)

Each folder here is a separate data root with its own `sets.json` and `manifest.tsv`. Nothing here is our
audio, and none of it may be included in a release of our own data.

- `ears/`: EARS dataset (Richter et al. 2024, CC BY-NC 4.0, non-commercial). All 107 speakers, Rainbow Passage
  parts 1-4, whispered (`ears-whisper`) and read normally (`ears-regular`), 16 kHz mono. Built by
  `scripts/fetch-ears.py`, which reads only the needed files from each speaker's archive.
- `voices/`: VOiCES devkit (Richey et al. 2018, CC BY 4.0). 100 LibriSpeech sentences, one per speaker, in one
  room: clean source, far microphone with no distractor, with babble and with TV. Built by
  `scripts/fetch-voices.py` (streams the 30 GB archive once, keeps only the sample in `raw/`) and
  `scripts/build-voices-sets.py` (makes the sets and transcripts).

Each root: `ASR_DATA=data-external/<root> npm run manifest`. Everything at once: `scripts/run-all.sh`.

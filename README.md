# Streaming Dictation ASR Benchmark

A speech recognition benchmark that plays audio the way a live dictation app
does: streamed in real time, through a client's audio handling, with the wait
measured from the moment the speaker stops. It is the code behind the paper
*Beyond Word Error Rate: A Failure Taxonomy of Streaming Dictation ASR* (source in
[`paper/`](paper/)).

Most ASR leaderboards test models offline, on whole files, and score
normalised text. This benchmark streams every clip at the speed of speech,
scores the text as written (numbers, punctuation and capitals included), and
sorts each error by the pipeline stage it points to: recognition, output
formatting, language handling, or the audio path before the model.

## What it tests

| Test | What it contains | What it shows |
|---|---|---|
| **Quiet dictation** | 73 English messages written to resemble chat, email, notes and prompts to AI assistants, read in a quiet room | Accuracy on the kind of text people dictate |
| **Fan on** | 17 further messages, read with a fan running nearby | Whether a running fan changes accuracy (different messages, so not a controlled noise test) |
| **Whispered speech** | 16 further messages, whispered | Whether quiet speech is transcribed, or dropped |
| **Separate languages** | 11 sets of 20 public clips: Arabic (Modern Standard, Saudi, Emirati), Spanish (Latin American, Spain, Puerto Rico), German, French, Hindi, Urdu, Mandarin | Accuracy per language and per dialect, and whether the output uses the right writing system |
| **Two languages in one recording** | 400 recordings that join clips in two languages; played with both languages selected, English only, and automatic detection | Whether both languages survive, and if not, whether a part is dropped, romanised or translated |
| **No speech** | 10 generated clips of silence, room noise and hum | Whether a system writes text when nobody spoke |
| **EARS** (external) | 107 speakers reading the same passage normally and whispered | Whether the whispering results hold across many voices |
| **VOiCES** (external) | 100 sentences from 100 speakers: clean, far microphone, far with babble, far with TV | Accuracy at a distance and in noise |

The English messages come from one speaker, so the EARS and VOiCES tests
repeat the whispering and noise results with many speakers.

## What it measures

| Measure | What it tells you |
|---|---|
| WER (MER for Mandarin), with 95% intervals | How many words were wrong, missing or extra |
| Formatted error rate | The same, also counting capital letters and punctuation |
| Wrong, missing and extra words | The three parts of WER separately, plus missing stretches and cut-off endings |
| Name accuracy | Words that are names against all other words |
| Number format | Digits written as words and the other way round |
| Writing system | Output in a different writing system from the chosen language |
| Lost language | Two-language recordings in which one language goes missing, and what replaced it |
| Output on no speech | How often a system writes text when nobody spoke |
| Wait after speaking | End of audio to final text, median and 90th percentile |
| Connect time | Time to open a streaming session |
| Audio dropped by the client | Recordings, or parts of them, that a client VAD never sent |

## Quick start

```bash
npm install
cp .env.example .env            # add keys for the systems you want to run
./scripts/fetch-silero.sh       # Silero VAD model, for the client VAD
./scripts/setup-tenvad.sh       # optional: TEN VAD, for the TEN Whisper setups
npm run nonspeech               # generate the no-speech clips
npm run manifest                # index every set under data/
npm test && npm run typecheck
npm run run -- --limit 3        # smoke test: 3 clips per set
npm run run                     # full run
```

Results are written to `results/<date>[-label]/` as `summary.md` and
`results.json`. They contain aggregates only. Per-clip transcripts are written
to `cache/clips/`, which is never committed.

## The data

**In-house English recordings.** 106 scripted messages (73 quiet, 17 fan on,
16 whispered) read by one speaker, a member of our team, who consented to
their public release, plus the 10 no-speech clips. The audio, both references
for each message (the script, and a reviewed record of what was
said) and every tested system's transcripts are released at
[huggingface.co/datasets/hey-lemon/streaming-dictation-asr](https://huggingface.co/datasets/hey-lemon/streaming-dictation-asr)
under CC BY 4.0, with every tested system's per-clip output (`outputs/clips/`),
the list of public language clips used (`data/third-party-clips.tsv`) and the
recipe for the two-language recordings (`data/codeswitch/mixes.tsv`). See
[Rebuild the paper's tables](#rebuild-the-papers-tables-no-api-keys-needed).

| Set | Clips | Audio | Script words | Clip length | Condition |
|---|---|---|---|---|---|
| `en-dictation` | 73 | 61.6 min | 8,324 | 10–177 s | Quiet room |
| `en-dictation-noise` | 17 | 8.7 min | 1,039 | 13–52 s | Fan running nearby |
| `en-dictation-whisper` | 16 | 11.1 min | 1,264 | 13–141 s | Whispered |

**Public language clips.** 20 short read or spoken sentences per set
(3–9 s each), taken from public datasets under their own licences. They are
not redistributed; `data/third-party-clips.tsv` in the dataset lists each clip
by source id, or by its transcript where the source has no id.

| Set | Language | Source |
|---|---|---|
| `ar-eg` | Arabic, Modern Standard (Egyptian speakers) | FLEURS |
| `ar-sa` | Arabic, Saudi | SADA |
| `ar-ae` | Arabic, Emirati | Casablanca |
| `de-de` | German | FLEURS |
| `es-419` | Spanish, Latin American | FLEURS |
| `es-es` | Spanish, Spain | VoxPopuli |
| `es-pr` | Spanish, Puerto Rico | OpenSLR SLR74 |
| `fr-fr` | French | FLEURS |
| `hi-in` | Hindi | FLEURS |
| `ur-pk` | Urdu | FLEURS |
| `zh-cn` | Mandarin Chinese | FLEURS |

**Two-language recordings.** Built by `npm run make-codeswitch` from the clips
above: each joins a clip in one language to a clip in another with a 300 ms
pause, both trimmed to speech and brought to the same loudness. 100 pair
English with one of the 10 other sets (Urdu is left out), half with English
first; 300 pair two non-English languages (15 pairs of German, Spanish, French,
Arabic, Hindi and Mandarin, 20 each). The 100 English parts come from 10 English
messages, each used in 10 recordings, and some other clips are used in up to 5
recordings, so intervals resample the source clips. The paper's main measure uses
all 400 recordings. As a check, it repeats the test on the recordings whose parts
every system gets at least 50% right when played alone: 85 with English and 232
without (the `counted` column of the per-recording TSV; `npm run codeswitch`
reports this filtered set).

**No speech.** 10 clips, 1.8 minutes, built by `npm run nonspeech`: digital
silence (3, 10 and 30 s), pink room noise at three levels, mains hum at 50, 60
and 120 Hz, and a louder noise burst.

**External corpora.** EARS (CC BY-NC 4.0) and VOiCES (CC BY 4.0) are fetched
from their sources into `data-external/`, kept apart from our own data and
never committed. See [`data-external/README.md`](data-external/README.md).

```bash
python3 scripts/fetch-ears.py
python3 scripts/fetch-voices.py && python3 scripts/build-voices-sets.py
ASR_DATA=data-external/ears npm run manifest
```

The local layout and how to add a set are in [`data/README.md`](data/README.md);
set definitions are in [`config/sets.json`](config/sets.json). More detail is in
[docs/DATASET.md](docs/DATASET.md).

## Systems

The thirteen rows of the paper's main comparison: eleven systems, two of them
also run with a clean-up setting.

| Id | Paper name | System | Audio sent | Configured in |
|---|---|---|---|---|
| `whisper-self-hosted` | Whisper SH | Whisper Large V3, our own deployment on Baseten; the client cuts segments at pauses and sends every sample | 16 kHz, 32 ms | `src/engines/whisper-self-hosted.ts` |
| `qwen` | Qwen | Qwen3-ASR, our own deployment on Baseten | 16 kHz, 32 ms | `src/engines/baseten.ts` |
| `meta` | Meta | Meta Muse Voice Transcribe (`muse-voice-transcribe-1.0`) | 24 kHz, 32 ms | `src/engines/meta.ts` |
| `gemini` | Gemini | Gemini 3.5 Transcribe, Live API, verbatim mode | 16 kHz, 32 ms | `src/engines/gemini.ts` |
| `gemini-smart` | Gemini Smart | The same, Smart mode (removes fillers, applies spoken corrections) | 16 kHz, 32 ms | `src/engines/gemini.ts` |
| `deepgram` | Deepgram | Deepgram Nova-3 | 16 kHz, 32 ms | `config/engines/deepgram.json` |
| `assemblyai-3-6-pro` | AAI 3.6 | AssemblyAI Universal-3.6 Pro | 16 kHz, 100 ms | `config/engines/assemblyai-3-6-pro.json` |
| `assemblyai-3-5-pro` | AAI 3.5 | AssemblyAI Universal-3.5 Pro | 16 kHz, 100 ms | `config/engines/assemblyai-3-5-pro.json` |
| `zoom-scribe` | Zoom | Zoom Scribe, Live API | 16 kHz, 100 ms | `config/engines/zoom-scribe.json` |
| `elevenlabs-scribe` | ElevenLabs | ElevenLabs Scribe v2 Realtime, default (verbatim) | 16 kHz, 32 ms | `config/engines/elevenlabs-scribe.json` |
| `elevenlabs-scribe-clean` | ElevenLabs NV | The same with `no_verbatim` | 16 kHz, 32 ms | `config/engines/elevenlabs-scribe-clean.json` |
| `openai-live-transcribe-low` | GPT-Live | OpenAI GPT-Live-Transcribe, Realtime API, `delay: low` | 24 kHz, 32 ms | `config/engines/openai-live-transcribe-low.json` |
| `openai-realtime-whisper` | RT Whisper | OpenAI GPT-Realtime-Whisper, Realtime API | 24 kHz, 32 ms | `config/engines/openai-realtime-whisper.json` |

**Other ways of running Whisper** (the paper's Whisper case study):
`whisper` (our first deployment, behind a Silero VAD gate on the client; run
with `--no-gate` to send all audio), `whisper-self-hosted-vad` (Silero also
drops audio), `whisper-self-hosted-ten` and `whisper-self-hosted-ten-vad` (TEN
VAD in place of Silero), `openai-whisper-1` (whole recording uploaded at the
end) and `openai-whisper-1-split` (each segment uploaded as the client cuts
it).

**Two-language test only:** `elevenlabs-scribe-vad` and
`elevenlabs-scribe-clean-vad` finalise text at each 300 ms pause instead of
once at the end.

**Also supported, not in the paper:** `openai-live-transcribe` and
`openai-live-transcribe-minimal` (other `delay` settings), `rime` (Rime STT)
and `openai-transcribe` (an example upload engine).

Each system is given the language a user would choose; if it has no option for
that language, none is sent and the system detects it, and the report marks
the score. The exact settings sent to each system are in
[METHODOLOGY.md](METHODOLOGY.md). Results name our own deployments only as
"self-hosted (Baseten)".

**Adding a system.** Most need no code: any streaming WebSocket API or
file-upload API can be added as a JSON file in
[`config/engines/`](config/engines/). Systems that need custom logic get an
adapter in `src/engines/`. See [CONTRIBUTING.md](CONTRIBUTING.md#adding-an-engine).

## How a run works

1. **Playback.** Each clip is read from disk and fed in small chunks paced to
   the clock, so a 20-second clip takes 20 seconds, as a live microphone would.
2. **Client shaping.** [`config/client-profile.json`](config/client-profile.json)
   decides what is sent. Only the gated `whisper` setup has a VAD in front of
   it; every other system receives every sample, resampled or re-chunked to
   what its API expects.
3. **Session.** The adapter opens a new streaming session for the clip, sends
   the language setting, streams the audio, signals the end of the audio and
   waits up to 30 seconds for the final text.
4. **Timing.** Connect time and the wait after the end of the audio are
   recorded for every clip.
5. **Caching.** Every result is cached under a key covering the system, its
   model or config, the audio, the language setting and the client profile, so
   reruns only play what changed. Rate limits and network drops are retried
   with growing waits.
6. **Scoring and report.** Transcripts are scored against the references, with
   95% bootstrap intervals and paired comparisons between systems. See
   [METHODOLOGY.md](METHODOLOGY.md).

### Commands

```bash
npm run run -- --engines deepgram,assemblyai-3-6-pro       # chosen systems, every set
npm run run -- --sets en-dictation,ar-eg --limit 5         # chosen sets, 5 clips each
npm run run -- --concurrency 2 --gap 500                   # gentler on rate-limited providers
npm run run -- --runs 3                                    # repeat each clip (latency spread)
npm run run -- --engines whisper --no-gate                 # gated Whisper with its VAD off
npm run report -- --cache a,b --label all                  # one report from several cached runs
npm run make-codeswitch                                    # build the two-language recordings
npm run codeswitch -- --engines meta,deepgram              # two-language test
scripts/run-all.sh [--family]                              # every system on every data root
python3 scripts/export-all-csv.py                          # every aggregate result in one CSV
npm run leaderboard -- --run results/<folder> --codeswitch results/<folder>
```

Qwen's deployment accepts one session at a time, so run it with
`--concurrency 1`. A full single-language run is about 100 minutes of audio
per system: roughly 15–20 minutes at 6 sessions, or an hour at 2.

## Rebuild the paper's tables (no API keys needed)

Requires Node 20+, Python 3.10+ and, for the PDF, [tectonic](https://tectonic-typesetting.github.io/).

```bash
npm install
npm test

# 1. In-house audio, references and every system's transcripts
pip install -U huggingface_hub
hf download hey-lemon/streaming-dictation-asr --repo-type dataset --local-dir hf
cp -R hf/data/* data/
mkdir -p cache/clips && cp hf/outputs/clips/*.tsv cache/clips/
npm run manifest

# 2. Analyses (each writes a JSON of aggregates to paper/analysis/)
npx tsx paper/analysis/failures.ts  > paper/analysis/failures.json
npx tsx paper/analysis/intervals.ts > paper/analysis/intervals.json
npx tsx paper/analysis/verbatim.ts  > paper/analysis/verbatim.json
npx tsx paper/analysis/extras.ts    > paper/analysis/extras.json
python3 paper/analysis/ttft.py
python3 paper/analysis/vadsweep.py
python3 paper/analysis/trace.py

# 3. EARS and VOiCES (downloads about 200 MB and streams one 30 GB archive)
python3 scripts/fetch-ears.py
python3 scripts/fetch-voices.py && python3 scripts/build-voices-sets.py
python3 -m venv .venv-norm && .venv-norm/bin/pip install whisper-normalizer==0.1.12
.venv-norm/bin/python -I paper/analysis/external.py
.venv-norm/bin/python -I paper/analysis/ears_vad.py
.venv-norm/bin/python -I paper/analysis/normwer.py
.venv-norm/bin/python -I paper/analysis/gptdelay.py          # GPT-Live delay check (needs the EARS/VOiCES TSVs, see below)
NORM_PYTHON=.venv-norm/bin/python npx tsx paper/analysis/stats_review.ts > paper/analysis/stats_review.json

# 4. Tables, figures and the PDF
python3 paper/make_tables.py
python3 paper/make_figures.py
cd paper && tectonic main.tex
```

Not every input can be released. EARS and VOiCES are not redistributed, so the per-clip TSVs of those runs
(`*-ears*.tsv`, `*-voices*.tsv`, including the GPT-Live delay check) stay local; rebuilding those tables means
fetching the corpora (step 3) and running the systems again. The spoken-reference rebuild (`said_votes.py`,
`said_loo.ts`), the accent labels and the network round-trip log (`rtt.py`) also read local files keyed by clip id.
For all of these, the committed JSON outputs are the ones used in the paper.

Analyses that need the third-party language clips themselves (`extras.ts`, `insertions.ts`, `accent*.py`) or the audio
(`vadshare.ts`) run once those sets are fetched into `data/` and `npm run manifest` has been rerun. Their committed
JSON outputs are the ones used in the paper.

## Benchmark your own ASR

Clone the repository and run the same method on your own recordings or on the
released English recordings.

1. **Add your audio.** Put 16 kHz mono WAV files in `data/<set>/` with a
   `transcripts.tsv` (`file`, `reference`, and ideally `speaker`), and add the
   set to `config/sets.json`. See [`data/README.md`](data/README.md).
2. **Add your system** if it is not already supported: a JSON file in
   `config/engines/` for a streaming WebSocket or file-upload API, or a copy of
   [`src/engines/_template.ts`](src/engines/_template.ts) registered in
   `src/engines/index.ts`.
3. **Run it.**
   ```bash
   npm run manifest
   npm run run -- --engines my-engine --limit 3   # smoke test
   npm run run -- --engines my-engine
   ```

## Documentation

- [METHODOLOGY.md](METHODOLOGY.md): how audio is streamed, scored and aggregated, the settings sent to each system, and known limits
- [CONTRIBUTING.md](CONTRIBUTING.md): adding a system or a set, running tests
- [docs/DATASET.md](docs/DATASET.md): what each set contains
- [docs/RECORDING_GUIDE.md](docs/RECORDING_GUIDE.md), [docs/TRANSCRIPTION_GUIDE.md](docs/TRANSCRIPTION_GUIDE.md), [docs/CONSENT_TEMPLATE.md](docs/CONSENT_TEMPLATE.md): for recording new sets
- [CHANGELOG.md](CHANGELOG.md): changes to sets and scoring

## License

- **Code:** Apache License 2.0 ([LICENSE](LICENSE)).
- **Documentation, results and paper:** CC BY 4.0.
- **In-house English recordings, references and transcripts:** CC BY 4.0, on Hugging Face (above).
- **Public language clips, EARS and VOiCES:** not included; each is used under its own licence.

See [NOTICE](NOTICE).

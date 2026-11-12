# Contributing

Thanks for helping improve the benchmark. This page covers setting up, adding
an engine (a system) or a test set, and submitting an engine to be scored.

## Setup

```bash
npm install
cp .env.example .env
./scripts/fetch-silero.sh
./scripts/setup-tenvad.sh     # optional: only for the TEN VAD Whisper setups
npm run nonspeech
npm run manifest
npm test
npm run typecheck
```

Node 20 or later is required. The paper's analysis scripts need Python 3.

## Never commit data

Nothing under `data/`, `data-external/` or `cache/` is committed. The
in-house English recordings are released separately on Hugging Face, and the
public and external clips keep their own licences, so pull requests must not
contain audio, reference transcripts, system transcripts or API keys. Results
in `results/` and `paper/analysis/` are aggregates only. If a change makes a
report write any per-clip text outside `cache/`, it will not be merged.

## Adding an engine

### With a config file (most engines)

If the engine has a streaming WebSocket API or a file-upload API, add a JSON
file to `config/engines/`. Every file there is loaded as an engine. Start from
`deepgram.json` (streaming) or `openai-transcribe.json` (upload); the fields are
documented at the top of `src/engines/generic.ts`.

- **websocket**: `url` and `headers`, an optional `setup` message, `audio`
  (`"binary"` or a JSON template using `${audio_base64}`), an `end` message, and
  how to recognise final text (`final.match`, `final.textPath`) and the end of
  a clip (`done.match` or `done.onClose`).
- **upload**: `url`, `headers`, `body` (`"multipart"` with `fileField` and
  `fields`, or `"raw"`), and `textPath` for the transcript in the JSON reply.
  The whole recording is uploaded when the audio ends, so latency includes
  upload time.

Templates can use `${env:NAME}`, `${model}`, `${language}` and
`${sample_rate}`. Empty values are removed from URLs, messages and form
fields, so auto-detection simply leaves the language out. Add a `languages` map
if the engine supports only some languages; scores for others are marked in the
report.

Then add the keys to `.env.example` and follow steps 6 and 7 below.

### With code

1. Copy `src/engines/_template.ts` to `src/engines/<name>.ts`.
2. Implement the adapter:
   - `id`: short, lowercase, unique (used on the command line and in results).
   - `label`: the name shown in reports.
   - `model()`: the model or version string recorded with every result. Read
     it from an environment variable where the provider supports versions.
   - `env`: the environment variables it needs. The runner skips the engine
     when any are missing.
   - `supportsLanguage(code)`: whether the engine has an option for an ISO
     639-1 language code. Scores for unsupported languages are marked in the
     report.
   - `connect()`: open a streaming session, send the setup, and map the
     engine's messages to `onFinal`, `onDone` and `onError`.
3. Register it in `ENGINES` in `src/engines/index.ts`.
4. If the engine needs a sample rate or chunk size other than 16 kHz and 512
   samples, add an entry under `engineAudio` in `config/client-profile.json`.
5. Add its variables to `.env.example`.
6. Run a smoke test on a few clips and check the transcripts in
   `cache/clips/`:
   ```bash
   npm run run -- --engines <id> --limit 3
   ```
7. List the engine and its settings in the README and in METHODOLOGY.md.

Adapters should use the provider's public API with default or documented
settings. Any non-default setting must be listed in METHODOLOGY.md.


## Adding a test set

1. Add the set to `config/sets.json` with its id, ISO language code,
   condition and source.
2. Put the audio (16 kHz mono WAV) and a `transcripts.tsv` in `data/<id>/`.
   Include a `speaker` column; intervals are only honest with speaker labels.
3. Follow [docs/TRANSCRIPTION_GUIDE.md](docs/TRANSCRIPTION_GUIDE.md) for
   references, and get a second review.
4. For new recordings, follow [docs/RECORDING_GUIDE.md](docs/RECORDING_GUIDE.md)
   and collect consent ([docs/CONSENT_TEMPLATE.md](docs/CONSENT_TEMPLATE.md)).
5. Run `npm run manifest`, describe the set in [docs/DATASET.md](docs/DATASET.md),
   and add a line to CHANGELOG.md.

## Changing scoring or playback

Changes to normalization, scoring, statistics, the client profile or playback
change results. Each one needs:

- a test in `test/` covering the new behaviour,
- an update to METHODOLOGY.md,
- a CHANGELOG.md entry, so results from before and after are not compared.

Use `npm run compare-runs` to check how a change affects an existing run.

## Submitting an engine

To have an engine scored on the full benchmark, including the public language
clips and the two-language recordings, under the same conditions as the
systems in the paper:

1. Open an issue using the **Engine submission** template.
2. Provide an adapter (as a pull request) or point to an existing one.
3. Provide API access for the run: a key or a test endpoint with enough
   capacity for about 100 minutes of audio, streamed in real time, with up to
   six sessions at once.

What we do:

- Run the engine on the full dataset under the same conditions as every other
  engine, on the same day as the engines it is compared with.
- Record the model or version string, the date and the settings used.
- Publish aggregate results: error rates with intervals, formatted error
  rate, error types, non-speech output, latency and failures.
- Share the results with the submitter before publishing and include a short
  written response if they want one.
- Rerun listed engines when a new version is announced, or at least every six
  months.

We may decline submissions that cannot run in real time or whose terms do not
allow benchmarking.

## Reporting problems

Open an issue with the command you ran, the output, and your Node version.
Never include audio, transcripts or keys.

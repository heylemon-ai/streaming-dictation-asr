# Methodology

How audio is played to each system, how the text is scored, and the settings
each system was called with. The paper in [`paper/`](paper/) reports the
results; this page is the reference for the method.

## 1. Playback

Each clip is played to each system the way a microphone would deliver it:

- Audio is 16 kHz mono 16-bit PCM, fed in small chunks paced to the clock, so a
  20-second clip takes 20 seconds.
- Every clip uses a new session, and all systems are called from the same
  client machine.
- When the clip ends, the client tells the system the audio is over and waits
  up to 30 seconds for the final text. A session with no text by then counts
  as an empty transcript on the external corpora and as a failure elsewhere.
- Only finalised text is scored. Partial text, where a system sends it, is not
  used.

Chunk size and sample rate follow each API (`engineAudio` in
[`config/client-profile.json`](config/client-profile.json)):

| Systems | Audio sent |
|---|---|
| Most systems | 16 kHz, 512-sample (32 ms) chunks |
| Meta, GPT-Live, RT Whisper | 24 kHz, 768-sample (32 ms) chunks, resampled from 16 kHz |
| AssemblyAI (both models), Zoom | 16 kHz, 1,600-sample (100 ms) chunks: AssemblyAI rejected chunks shorter than 50 ms, and Zoom's sample app uses 100 ms |

### The client VAD

A voice activity detector (VAD) decides whether audio contains speech. In the
main comparison no VAD drops audio: every system receives every sample. A VAD
is used only in the Whisper setups described in section 7, where it either
cuts the audio into segments or also drops what it judges to be silence. The
gated `whisper` setup uses these client settings, published in
`config/client-profile.json`:

| Setting | Value |
|---|---|
| VAD | Silero VAD, in front of the gated `whisper` setup only |
| Speech threshold | 0.5 (Silero speech probability) |
| Lead-in | 3 windows (about 96 ms) kept from just before speech starts |
| Pause sent when speech resumes | Up to 512 ms |
| Gate closes after | 544 ms of silence |
| Boundary pause | After 5 s of streamed audio, the closing pause is sent so the system sees a sentence boundary |
| Minimum audio submitted | 100 ms; shorter recordings are not sent |

Run the gated setup with `--no-gate` to send all of its audio. A local
`config/client-profile.local.json` can override these settings for
experiments; every result records which profile was used.

## 2. Timing

- **Wait after speaking:** from the client's end-of-audio signal to the final
  text. Because the client signals the end, this does not include the time a
  system would take to decide by itself that the speaker has stopped.
- **Connect time:** from opening the connection to the session being ready. A
  client can hide this by connecting before the person speaks.
- Both are reported as the median and the 90th percentile. They are measured
  from one client location and vary between days, so they are indicative.

## 3. Scoring

**References.** English is scored against the script the reader was given.
Each English message also has a spoken reference: a record of what was said,
drafted from the systems' transcripts and confirmed by a person who listened
to every message (`tools/verbatim/`); the paper reports WER against both. The
other sets use the references of their source datasets.

**Normalisation (WER).** Both reference and transcript are cleaned the same
way before alignment ([`src/score.ts`](src/score.ts)):

- Unicode NFKC and lower case
- apostrophes removed ("don't" = "dont"); dots inside abbreviations removed ("U.S." = "US")
- all other punctuation and symbols treated as spaces
- Arabic and Urdu: short-vowel marks and the elongation character removed
- Arabic: alif with and without hamza (أ إ آ) treated as ا, ta marbuta (ة) as ه, and alif maqsura (ى) as ي
- Chinese: traditional characters converted to simplified

Numbers are **not** normalised: "7" against "seven" is an error, because a
dictation user receives the written form.

**Units.** WER for every language except Mandarin, which is scored by mixed
error rate (MER): each Chinese character, and each run of Latin letters or
digits, is one unit. Character error rate (CER) is also computed for every
language.

**Formatted error rate** keeps capital letters and punctuation, with each
punctuation mark as its own token, so a wrong capital or a missing comma each
counts as one error.

**Aggregation.** Rates are corpus-level: total errors divided by total
reference words across a set, not an average of per-clip rates. Accuracy uses
the first run of each clip.

**Error types.** Each transcript is aligned with its reference by the fewest
edits (Levenshtein), giving wrong words (substitutions), missing words
(deletions) and extra words (insertions). The paper's failure taxonomy adds
rules on top of this alignment, for example a missing stretch (5 or more
words in a row missing), a cut-off ending (the last 3 or more words missing)
and a failed clip (WER of 50% or more); the rules are in the paper's Table 2
and in [`paper/analysis/failures.ts`](paper/analysis/failures.ts).

**No speech.** Clips with an empty reference are scored only on whether any
text came back.

## 4. Two languages in one recording

Built by `scripts/make-codeswitch.ts` and run with `npm run codeswitch`.

- **Recordings.** 100 join an English clip with a clip from one of the 10
  other language sets (Urdu is left out), half with English first. 300 join two
  non-English languages: every pair of German, Spanish, French, Arabic, Hindi
  and Mandarin, 20 per pair, half in each order. Each part is trimmed to speech,
  brought to the same loudness, and joined with a 300 ms pause.
- **Language settings.** Each recording is played with both languages
  selected and with automatic detection; recordings with English are also
  played with only English selected. Systems that take one language get none
  when both are selected.
- **Scoring.** The transcript is aligned against both parts. A part with less
  than 20% of its words present is lost: *missing* if mostly absent,
  *replaced* if other text took its place. A replaced part written in Latin
  letters that is not English is *romanised*; one of at least 4 words with at
  least 15% common English function words is *translated*.
- **All recordings, then a filtered check.** The paper's main results use
  all 100 recordings with English and 300 without. As a check, it repeats
  them on the recordings whose parts every system gets at least 50% right
  when played alone (85 with English, 232 without), so that a lost part can
  be blamed on the switch rather than on the language being hard. This
  filter uses the tested systems themselves, so it keeps easy recordings.

## 5. External corpora (EARS and VOiCES)

Fetched into `data-external/` by `scripts/fetch-ears.py`,
`scripts/fetch-voices.py` and `scripts/build-voices-sets.py`, run as separate
data roots (`ASR_DATA=data-external/<root>`), and scored by
`paper/analysis/external.py`. Their scoring differs from the main sets on
purpose: the VOiCES references are LibriSpeech text (lower case, no
punctuation, numbers as words), so both reference and transcript go through
Whisper's English text normaliser and only WER is reported. Clips a client VAD
never sent, and sessions with no text within 30 seconds, count as empty
transcripts.

## 6. Statistics

- 95% intervals come from a percentile bootstrap (2,000 resamples, fixed
  seed). The English recordings come from one speaker, so they resample
  messages; EARS and VOiCES resample speakers.
- Systems, or one system under two conditions, are compared with a **paired
  bootstrap** on the same clips. A difference is clear when the 95% interval
  of the paired difference excludes zero.
- The language sets have 20 clips each and the whispered set 16, so
  differences of a few points there are within chance.

## 7. Settings sent to each system

Anything not listed was left at the provider's default.

| System | Model | Language setting | End of audio | When text is finalised | Other settings |
|---|---|---|---|---|---|
| Whisper SH (`whisper-self-hosted`) | Whisper Large V3, own deployment | `audio_language`; two languages as `language_options` | the client cuts the last segment | each segment the client cuts | beam width 5; partial text off |
| Gated Whisper (`whisper`) | Whisper Large V3, own deployment | `audio_language` | `end_audio` | server's own speech detection (threshold 0.7, 480 ms silence) | beam width 5; partial text off; client VAD in front |
| Qwen | Qwen3-ASR, own deployment | `audio_language` | `input_audio_buffer.commit` | server | partial text off |
| Meta | `muse-voice-transcribe-1.0` | `languageBias` | `endStream` | once, at the end | push-to-talk mode; cumulative partial text |
| Gemini, Gemini Smart | `gemini-3.5-transcribe-live` | `languageCodes` | `activityEnd` | once, at the end (automatic activity detection off) | `mode`: `VERBATIM` or `SMART` |
| Deepgram | `nova-3` | `language`; `multi` for two languages or none | `CloseStream` | server's endpointing, at its default | `punctuate`, `smart_format` |
| AAI 3.6, AAI 3.5 | `universal-3-6-pro`, `universal-3-5-pro` | `language_codes` | `Terminate` | server's turn detection, at its default | `format_turns` |
| Zoom | Zoom Scribe (Live API) | one locale per session | `session.close` | server's turn detection | partial text off; text clean-up off |
| ElevenLabs, ElevenLabs NV | `scribe_v2_realtime` | `language_code`; second language as `secondary_languages` | a final empty chunk with `commit` | once, at the end (`commit_strategy`: `manual`); the `-vad` configs: at each 300 ms pause | NV: `no_verbatim` |
| GPT-Live | `gpt-live-transcribe` | `languages` | `input_audio_buffer.commit` | once, at the end (server turn detection off) | `delay`: `low` |
| RT Whisper | `gpt-realtime-whisper` | `language` (one only) | `input_audio_buffer.commit` | once, at the end (server turn detection off) | |

GPT-Live's `delay` has no documented default. `low` is used, first chosen on
50 of the English test clips; both `low` and `minimal` were then run on the same
day on every test set (`paper/analysis/gptdelay.py`): the waits are the same and
`minimal` has the higher WER on every English set.

**Checks of 5 November.** Three questions raised in review were tested with extra
engine variants, kept in `config/engines/` and `src/engines/baseten.ts`:
- Is a missing whispered word lost by the service's turn detection? AssemblyAI with
  `ForceEndpoint` before `Terminate` (`assemblyai-*-flush`) and with turn detection
  effectively off (`assemblyai-*-noturn`), and Zoom with 5 s instead of 600 ms of
  silence ending a segment (`zoom-scribe-longturn`).
- Is Qwen's whispered loss in the model or in our deployment's speech detection?
  `qwen-lowvad` sends a relaxed `streaming_vad_config` (threshold 0.3, 2 s silence).
- Do regional language codes matter? `npm run run -- --language regional` sends each
  set's own locale (e.g. `ar-SA`) to systems that document one, and falls back to the
  bare language otherwise. Each system is told the language a user would choose; if it has no
option for that language, none is sent and the report marks the score.

**Whisper setups.** The paper's Whisper case study compares nine ways of
running Whisper: the gated deployment with its VAD on and off (`whisper`,
`--no-gate`); the self-hosted deployment with Silero only cutting segments
(`whisper-self-hosted`) or also dropping audio (`whisper-self-hosted-vad`);
the same two with TEN VAD (`whisper-self-hosted-ten`,
`whisper-self-hosted-ten-vad`); RT Whisper; OpenAI Whisper-1 with the whole
recording uploaded at the end (`openai-whisper-1`); and Whisper-1 sent each
segment as the client cuts it (`openai-whisper-1-split`). The self-hosted
client ends a segment at a pause of 544 ms after speech, once at least 5
seconds have been sent, and always before 30 seconds. The exact rules of each
setup are in the comments of `src/engines/whisper-self-hosted.ts` and
`src/engines/openai-whisper-split.ts`.

Upload systems receive the whole recording as one WAV file when the audio
ends, so their wait includes upload and processing time and is not comparable
with streaming systems.

## 8. Known limits

- The in-house English is scripted, read aloud and from one speaker, and each
  message was recorded in only one condition, so the quiet, fan-on and
  whispered sets differ in their messages as well as their condition.
- The language sets have 20 short clips each, and each dialect comes from a
  single corpus, so dialect and recording source cannot be separated.
- Clips drawn from public datasets, EARS's Rainbow Passage and VOiCES's
  LibriSpeech sentences may be in some systems' training data.
- Hosted systems were run over a few weeks in October 2026; providers can
  change their models without notice.
- Playback starts from recorded files, so microphone capture is not covered.
- Timing is measured from one client location and is indicative.

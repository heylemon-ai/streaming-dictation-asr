# Changelog

Changes to test sets, scoring or playback. Results produced under different
versions should not be compared directly.

## 1.0.0 (2026-11)

First public release, with the paper *Beyond Word Error Rate: A Failure
Taxonomy of Streaming Dictation ASR*.

- **Playback:** real-time streaming of every clip, a new session per clip,
  per-system chunk size and sample rate, and an optional client VAD (Silero or
  TEN) that cuts the audio into segments or also drops it.
- **Systems:** thirteen rows in the main comparison (Whisper Large V3
  self-hosted, Qwen3-ASR, Meta Muse, Gemini 3.5 Transcribe and its Smart mode,
  Deepgram Nova-3, AssemblyAI Universal-3.6 Pro and 3.5 Pro, Zoom Scribe,
  ElevenLabs Scribe v2 Realtime with and without `no_verbatim`, OpenAI
  GPT-Live-Transcribe and GPT-Realtime-Whisper), and nine ways of running
  Whisper.
- **Generic adapters:** any streaming WebSocket or file-upload API can be added
  as a JSON file in `config/engines/`.
- **Sets:** 106 in-house English dictations (quiet, fan on, whispered), 11
  language and dialect sets of 20 public clips, 10 no-speech clips, 400
  two-language recordings, and the external corpora EARS and VOiCES.
- **Scoring:** WER (MER for Mandarin) with numbers scored as written, formatted
  error rate, CER, wrong, missing and extra words, and a word-for-word second
  reference for the English recordings.
- **Arabic normalisation:** alif variants, ta marbuta (ة to ه) and alif
  maqsura (ى to ي) are treated as equal. Arabic error rates from earlier
  internal versions, which folded alif variants only, are not comparable.
- **Two-language test:** per-part scoring (missing, romanised, translated)
  under each language setting, with a filter that keeps only recordings whose
  parts every system transcribes when played alone.
- **Statistics:** percentile bootstrap intervals and paired comparisons.
- **Caching:** results are keyed on everything that can change a transcript,
  including each system's config file, so reruns only play what changed.

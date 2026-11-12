# ASR benchmark results — 2026-10-22 (leaderboard)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Qwen3-ASR | self-hosted (Baseten) |
| Meta Muse | muse-voice-transcribe-1.0 |
| Gemini 3.5 Transcribe | gemini-3.5-transcribe-live |
| Gemini 3.5 Transcribe (Smart) | gemini-3.5-transcribe-live |
| Whisper Self-Hosted | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN VAD) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN VAD drops audio) | self-hosted (Baseten) |
| AssemblyAI Universal-3.5 Pro | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro | universal-3-6-pro |
| Deepgram Nova-3 | nova-3 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | scribe_v2_realtime |
| ElevenLabs Scribe v2 Realtime | scribe_v2_realtime |
| OpenAI GPT-Live-Transcribe (Low delay) | gpt-live-transcribe |
| OpenAI GPT-Realtime-Whisper | gpt-realtime-whisper |
| Zoom Scribe | zoom-scribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |
| nonspeech | en | nonspeech | 10 | 1.8 | not labelled |
| ar-eg | ar | clean | 20 | 1.7 | not labelled |
| ar-sa | ar | clean | 20 | 1.8 | not labelled |
| ar-ae | ar | clean | 20 | 1.0 | not labelled |
| de-de | de | clean | 20 | 1.7 | not labelled |
| es-419 | es | clean | 20 | 2.0 | not labelled |
| es-es | es | clean | 20 | 1.1 | 20 |
| es-pr | es | clean | 20 | 1.7 | not labelled |
| fr-fr | fr | clean | 20 | 1.6 | not labelled |
| hi-in | hi | clean | 20 | 1.6 | not labelled |
| ur-pk | ur | clean | 20 | 1.6 | not labelled |
| zh-cn | zh | clean | 20 | 1.6 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| en-dictation | 13.6% [10.9%–17.0%] | 9.5% [8.3%–10.6%] | 6.9% [5.8%–8.0%] | 3.9% [3.2%–4.7%] | 8.3% [6.8%–9.8%] | 7.8% [6.2%–9.4%] | 7.2% [6.1%–8.3%] | 9.0% [7.9%–10.1%] | 8.2% [7.2%–9.1%] | 13.6% [12.0%–15.1%] | 5.1% [4.3%–5.9%] | 12.8% [10.9%–14.9%] | 7.3% [6.3%–8.3%] | 8.2% [7.0%–9.5%] | 7.4% [6.5%–8.3%] |
| en-dictation-noise | 7.0% [5.3%–9.1%] | 7.4% [5.3%–9.6%] | 2.5% [1.8%–3.3%] | 3.2% [2.1%–4.6%] | 6.5% [4.1%–10.0%] | 5.9% [3.4%–9.2%] | 5.9% [3.9%–8.5%] | 4.3% [2.8%–6.2%] | 4.1% [2.7%–5.7%] | 11.4% [8.8%–14.0%] | 4.5% [3.1%–6.0%] | 5.8% [3.7%–8.2%] | 3.6% [2.4%–4.8%] | 4.6% [3.2%–6.4%] | 3.6% [2.2%–5.2%] |
| en-dictation-whisper | 46.6% [32.9%–67.5%] | 11.3% [9.0%–14.1%] | 5.0% [2.8%–6.7%] | 4.2% [2.9%–5.7%] | 10.1% [7.1%–13.0%] | 10.2% [7.7%–12.3%] | 10.7% [8.0%–12.7%] | 30.9% [15.2%–55.9%] | 30.5% [14.6%–55.8%] | 19.8% [15.7%–23.6%] | 7.1% [3.6%–10.7%] | 9.1% [5.4%–12.9%] | 8.8% [7.0%–10.4%] | 8.9% [7.2%–11.0%] | 34.7% [19.2%–60.2%] |
| ar-eg | 7.7% [2.7%–13.2%] | 6.6% [2.1%–12.6%] | 2.6% [0.5%–5.3%] | 3.6% [1.0%–6.8%] | 9.2% [5.4%–13.7%] | 9.2% [5.4%–13.7%] | 9.2% [5.4%–13.7%] | 14.3% [8.5%–20.8%] | 9.7% [4.4%–16.0%] | 11.2% [6.3%–16.2%] | 9.2% [5.1%–13.4%] | 10.2% [5.2%–15.8%] | 6.6% [2.7%–10.9%] | 7.1% [3.6%–11.2%] | 5.1% [1.6%–8.7%] |
| ar-sa | 39.1% [27.0%–51.9%] | 27.7% [18.7%–38.1%] | 29.3% [19.1%–40.7%] | 35.2% [23.4%–48.5%] | 37.1% [24.5%–51.8%] | 37.1% [24.5%–51.8%] | 37.1% [24.0%–52.6%] | 34.8% [25.1%–45.0%] | 33.6% [24.2%–43.7%] | 38.3% [28.4%–49.5%] | 66.0% [55.1%–77.0%] | 34.8% [23.3%–47.4%] | 27.7% [15.7%–41.5%] | 28.9% [16.9%–42.6%] | 29.7% [19.3%–41.3%] |
| ar-ae | 61.2% [51.4%–70.7%] | 49.4% [38.9%–61.2%] | 48.8% [39.6%–58.9%] | 49.4% [39.6%–58.6%] | 60.0% [49.7%–71.1%] | 59.4% [48.7%–70.8%] | 58.2% [48.1%–69.6%] | 57.1% [47.0%–67.8%] | 53.5% [43.5%–63.9%] | 57.1% [47.4%–66.7%] | 79.4% [66.5%–91.6%] | 61.8% [51.4%–72.3%] | 51.8% [42.0%–62.6%] | 55.9% [43.9%–67.1%] | 51.8% [41.5%–62.5%] |
| de-de | 4.4% [1.3%–8.0%] | 6.5% [2.7%–10.2%] | 5.2% [2.6%–7.8%] | 4.8% [2.2%–7.4%] | 6.9% [3.2%–10.8%] | 6.9% [3.2%–10.8%] | 6.9% [3.2%–10.8%] | 6.0% [3.0%–8.8%] | 4.8% [2.1%–7.6%] | 8.1% [4.3%–12.3%] | 3.6% [1.2%–6.2%] | 4.0% [1.6%–6.7%] | 4.4% [0.9%–8.0%] | 3.2% [0.8%–6.0%] | 4.8% [1.5%–9.1%] |
| es-419 | 7.4% [3.7%–12.6%] | 5.2% [2.1%–9.4%] | 6.5% [2.9%–11.5%] | 5.7% [2.5%–9.9%] | 5.7% [2.8%–9.1%] | 5.7% [2.8%–9.1%] | 4.3% [1.3%–8.2%] | 5.2% [1.7%–9.9%] | 2.2% [0.4%–4.6%] | 8.7% [3.9%–15.0%] | 1.7% [0.4%–3.5%] | 2.6% [0.8%–5.1%] | 6.5% [3.3%–10.7%] | 3.9% [1.4%–7.0%] | 6.1% [2.2%–11.2%] |
| es-es | 8.9% [1.1%–21.6%] | 10.5% [2.7%–23.3%] | 8.4% [1.1%–20.6%] | 7.4% [0.0%–19.3%] | 19.5% [3.6%–36.9%] | 19.5% [3.6%–36.9%] | 14.7% [1.6%–31.0%] | 10.0% [2.1%–22.3%] | 9.5% [1.6%–21.9%] | 9.5% [2.0%–21.8%] | 7.9% [0.5%–20.3%] | 8.9% [1.1%–21.3%] | 8.9% [1.5%–21.1%] | 7.9% [0.5%–20.2%] | 10.0% [2.1%–22.3%] |
| es-pr | 8.4% [3.2%–15.1%] | 5.2% [1.6%–9.5%] | 3.7% [1.1%–6.7%] | 4.7% [1.1%–9.8%] | 5.8% [1.7%–11.2%] | 5.8% [1.7%–11.2%] | 4.7% [1.0%–9.9%] | 5.2% [2.0%–9.0%] | 5.2% [2.0%–9.0%] | 4.2% [1.1%–8.1%] | 8.4% [2.7%–15.3%] | 8.9% [3.1%–15.7%] | 5.8% [1.6%–10.9%] | 7.3% [2.3%–13.9%] | 4.2% [1.1%–8.1%] |
| fr-fr | 7.2% [2.7%–12.9%] | 8.7% [4.6%–13.1%] | 7.2% [2.9%–12.5%] | 6.9% [2.0%–13.7%] | 6.5% [2.8%–11.2%] | 6.5% [2.8%–11.2%] | 5.1% [1.4%–9.9%] | 4.0% [1.0%–7.6%] | 2.9% [0.7%–5.8%] | 10.5% [6.5%–14.6%] | 9.4% [4.5%–15.0%] | 9.1% [4.8%–13.9%] | 9.4% [4.5%–15.0%] | 7.2% [2.8%–13.0%] | 5.1% [2.1%–8.5%] |
| hi-in | 18.4% [10.4%–28.4%] | 14.9% [4.1%–28.8%] | 3.1% [0.9%–5.7%] | 2.6% [0.9%–4.9%] | 29.8% [21.3%–39.2%] | 29.8% [21.3%–39.2%] | 31.6% [21.9%–42.2%] | 25.9% [18.2%–34.2%] | 9.2% [2.7%–19.0%] | 20.6% [11.5%–32.0%] | 10.5% [4.3%–19.0%] | 11.8% [4.8%–21.3%] | 11.8% [4.5%–23.2%] | 11.8% [4.9%–20.4%] | 34.6% [23.6%–46.6%] |
| ur-pk | 94.7% [86.9%–100.4%] | 87.3% [75.6%–97.3%] * | 51.8% [32.3%–72.1%] * | 32.4% [18.1%–49.8%] * | 19.7% [13.4%–26.1%] | 19.7% [13.4%–26.1%] | 19.4% [12.9%–26.0%] | 91.5% [76.4%–101.8%] * | 15.1% [9.2%–20.8%] | 14.4% [9.5%–19.7%] | 19.4% [13.8%–25.4%] | 22.2% [15.7%–28.6%] | 19.7% [11.8%–29.2%] | 12.3% [9.0%–16.2%] | 102.5% [100.7%–104.5%] * |
| zh-cn | 3.5% [1.9%–5.0%] | 6.5% [3.3%–9.8%] | 3.3% [1.5%–5.1%] | 3.8% [1.6%–6.3%] | 4.1% [2.2%–6.0%] | 4.1% [2.2%–6.0%] | 4.1% [2.2%–6.0%] | 3.5% [1.8%–5.4%] | 2.7% [0.8%–4.7%] | 3.3% [1.4%–5.2%] | 4.4% [1.9%–6.9%] | 5.2% [2.4%–8.2%] | 6.5% [4.2%–8.8%] | 6.8% [4.9%–8.6%] | 3.3% [1.5%–5.2%] |

\* No option for this language in the engine, so no language was sent and the engine auto-detected: Meta Muse on ur-pk; Gemini 3.5 Transcribe on ur-pk; Gemini 3.5 Transcribe (Smart) on ur-pk; AssemblyAI Universal-3.5 Pro on ur-pk; Zoom Scribe on ur-pk. This is what a person choosing that language gets, not the engine's accuracy with the language set. Left out of paired comparisons.

## Formatted accuracy (case and punctuation counted)

| Set | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| en-dictation | 21.6% | 18.3% | 9.1% | 8.8% | 16.0% | 15.3% | 15.5% | 14.9% | 13.1% | 22.8% | 9.0% | 21.9% | 11.2% | 11.9% | 13.7% |
| en-dictation-noise | 15.5% | 14.9% | 6.4% | 10.0% | 14.3% | 13.8% | 13.1% | 9.4% | 8.8% | 20.0% | 8.9% | 11.6% | 8.1% | 8.1% | 10.2% |
| en-dictation-whisper | 56.5% | 22.4% | 8.6% | 10.9% | 20.8% | 18.3% | 19.4% | 35.9% | 35.1% | 32.1% | 12.4% | 16.0% | 14.2% | 13.8% | 41.6% |
| ar-eg | 17.4% | 27.2% | 14.9% | 13.2% | 27.7% | 27.2% | 27.7% | 27.7% | 19.6% | 36.6% | 17.4% | 20.4% | 15.7% | 16.2% | 15.3% |
| ar-sa | 50.0% | 49.3% | 54.3% | 46.7% | 44.9% | 44.9% | 45.7% | 43.5% | 42.8% | 57.2% | 81.9% | 53.3% | 39.9% | 40.2% | 42.8% |
| ar-ae | 74.5% | 62.8% | 66.0% | 62.2% | 66.0% | 65.4% | 64.4% | 60.6% | 60.1% | 63.8% | 85.6% | 76.1% | 59.0% | 62.8% | 67.0% |
| de-de | 7.2% | 10.3% | 7.9% | 7.6% | 10.0% | 10.3% | 9.6% | 8.9% | 7.6% | 11.3% | 6.9% | 7.9% | 7.9% | 6.2% | 7.6% |
| es-419 | 16.0% | 14.5% | 13.8% | 12.0% | 15.3% | 14.5% | 12.7% | 12.4% | 10.9% | 17.5% | 8.4% | 9.1% | 15.3% | 10.9% | 16.4% |
| es-es | 13.0% | 22.2% | 12.0% | 12.5% | 31.9% | 31.9% | 27.8% | 14.4% | 13.0% | 14.8% | 10.6% | 13.0% | 13.0% | 12.5% | 19.4% |
| es-pr | 25.4% | 22.8% | 18.3% | 20.8% | 20.8% | 20.8% | 19.3% | 19.3% | 20.3% | 19.3% | 22.8% | 22.8% | 20.8% | 23.4% | 17.3% |
| fr-fr | 10.9% | 12.9% | 10.3% | 10.6% | 10.0% | 10.0% | 8.0% | 7.7% | 6.1% | 13.5% | 12.2% | 13.5% | 12.9% | 11.9% | 8.7% |
| hi-in | 16.4% | 18.3% | 5.3% | 4.8% | 25.3% | 25.3% | 28.3% | 23.5% | 10.7% | 23.7% | 15.1% | 16.4% | 15.8% | 13.5% | 27.6% |
| ur-pk | 154.9% | 136.4% * | 85.4% * | 44.8% * | 26.0% | 26.0% | 25.3% | 148.1% * | 19.2% | 19.2% | 21.1% | 23.4% | 22.7% | 13.3% | 103.6% * |
| zh-cn | 5.3% | 8.0% | 5.5% | 5.8% | 12.0% | 12.0% | 12.0% | 5.5% | 4.8% | 6.3% | 6.3% | 7.2% | 8.3% | 8.5% | 5.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Qwen3-ASR | 8.6% | 5.3% | 4.4% |
| Meta Muse | 6.7% | 1.4% | 3.7% |
| Gemini 3.5 Transcribe | 4.1% | 1.2% | 2.6% |
| Gemini 3.5 Transcribe (Smart) | 3.4% | 1.7% | 0.6% |
| Whisper Self-Hosted | 5.4% | 2.3% | 2.3% |
| Whisper Self-Hosted (TEN VAD) | 5.2% | 2.5% | 2.0% |
| Whisper Self-Hosted (TEN VAD drops audio) | 5.1% | 2.1% | 2.0% |
| AssemblyAI Universal-3.5 Pro | 6.3% | 3.8% | 3.4% |
| AssemblyAI Universal-3.6 Pro | 4.2% | 3.7% | 2.9% |
| Deepgram Nova-3 | 7.2% | 3.0% | 4.2% |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 4.8% | 1.7% | 1.4% |
| ElevenLabs Scribe v2 Realtime | 4.8% | 1.7% | 5.9% |
| OpenAI GPT-Live-Transcribe (Low delay) | 4.5% | 1.6% | 2.3% |
| OpenAI GPT-Realtime-Whisper | 4.4% | 1.6% | 2.9% |
| Zoom Scribe | 6.0% | 4.3% | 2.6% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| nonspeech | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 60.0% (6/10) | 60.0% (6/10) | 20.0% (2/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Qwen3-ASR | 388 | 542 | 1592 | 4428 | 336 |
| Meta Muse | 313 | 371 | 1368 | 1756 | 336 |
| Gemini 3.5 Transcribe | 584 | 905 | 674 | 814 | 326 |
| Gemini 3.5 Transcribe (Smart) | 434 | 703 | 718 | 1201 | 326 |
| Whisper Self-Hosted | 361 | 498 | 837 | 940 | 336 |
| Whisper Self-Hosted (TEN VAD) | 390 | 533 | 881 | 1088 | 336 |
| Whisper Self-Hosted (TEN VAD drops audio) | 395 | 538 | 896 | 1062 | 336 |
| AssemblyAI Universal-3.5 Pro | 727 | 1218 | 1228 | 1370 | 336 |
| AssemblyAI Universal-3.6 Pro | 722 | 1210 | 1227 | 1399 | 336 |
| Deepgram Nova-3 | 357 | 431 | 911 | 1053 | 336 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 395 | 459 | 660 | 727 | 336 |
| ElevenLabs Scribe v2 Realtime | 398 | 493 | 685 | 765 | 336 |
| OpenAI GPT-Live-Transcribe (Low delay) | 760 | 858 | 1207 | 1374 | 336 |
| OpenAI GPT-Realtime-Whisper | 735 | 832 | 1185 | 1312 | 336 |
| Zoom Scribe | 407 | 616 | 1406 | 1655 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Qwen3-ASR | 0 | 0 |
| Meta Muse | 0 | 0 |
| Gemini 3.5 Transcribe | 0 | 0 |
| Gemini 3.5 Transcribe (Smart) | 0 | 0 |
| Whisper Self-Hosted | 0 | 0 |
| Whisper Self-Hosted (TEN VAD) | 0 | 0 |
| Whisper Self-Hosted (TEN VAD drops audio) | 0 | 0 |
| AssemblyAI Universal-3.5 Pro | 0 | 0 |
| AssemblyAI Universal-3.6 Pro | 0 | 0 |
| Deepgram Nova-3 | 0 | 0 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 0 | 0 |
| ElevenLabs Scribe v2 Realtime | 0 | 0 |
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |
| OpenAI GPT-Realtime-Whisper | 0 | 0 |
| Zoom Scribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +1.2% [0.6%–1.9%] | 0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +3.0% [2.0%–4.1%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD drops audio) | +3.3% [2.4%–4.2%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +3.5% [2.5%–4.4%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +3.5% [2.7%–4.4%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD) | +3.9% [2.5%–5.5%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.6 Pro | +4.3% [3.3%–5.3%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +4.3% [3.2%–5.5%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +4.4% [3.1%–6.0%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.5 Pro | +5.1% [4.0%–6.3%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Meta Muse | +5.6% [4.6%–6.7%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +8.9% [7.0%–11.1%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +9.7% [8.3%–11.1%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Qwen3-ASR | +9.8% [7.1%–13.0%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | +0.7% [-0.4%–2.1%] | 0.333 |
| en-dictation-noise | Gemini 3.5 Transcribe | OpenAI GPT-Live-Transcribe (Low delay) | +1.0% [0.2%–2.1%] | 0.035 |
| en-dictation-noise | Gemini 3.5 Transcribe | Zoom Scribe | +1.0% [-0.1%–2.2%] | 0.104 |
| en-dictation-noise | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +1.5% [0.1%–2.8%] | 0.037 |
| en-dictation-noise | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +1.8% [0.2%–3.3%] | 0.023 |
| en-dictation-noise | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +2.0% [0.7%–3.2%] | 0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | OpenAI GPT-Realtime-Whisper | +2.1% [0.9%–3.6%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +3.3% [1.5%–5.4%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD) | +3.4% [1.1%–6.3%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD drops audio) | +3.4% [1.6%–5.6%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Whisper Self-Hosted | +4.0% [1.7%–6.9%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Qwen3-ASR | +4.4% [2.7%–6.3%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Meta Muse | +4.8% [3.1%–6.8%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Deepgram Nova-3 | +8.9% [6.3%–11.7%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +0.8% [-2.0%–3.0%] | 0.696 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +2.9% [-1.0%–6.0%] | 0.152 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +4.7% [1.8%–6.7%] | 0.002 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +4.7% [2.1%–7.1%] | 0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +4.9% [0.7%–8.1%] | 0.019 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +5.9% [3.7%–8.1%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD) | +6.0% [3.3%–8.0%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD drops audio) | +6.5% [4.2%–8.0%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Meta Muse | +7.1% [4.3%–9.3%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +15.6% [11.2%–19.0%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.6 Pro | +26.4% [10.2%–52.0%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.5 Pro | +26.7% [10.6%–52.4%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +30.5% [14.7%–55.7%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe (Smart) | Qwen3-ASR | +42.4% [28.5%–63.9%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | +1.0% [0.0%–2.5%] | 0.237 |
| ar-eg | Gemini 3.5 Transcribe | Zoom Scribe | +2.6% [0.5%–5.2%] | 0.019 |
| ar-eg | Gemini 3.5 Transcribe | Meta Muse | +4.1% [0.5%–8.3%] | 0.027 |
| ar-eg | Gemini 3.5 Transcribe | OpenAI GPT-Live-Transcribe (Low delay) | +4.1% [0.5%–8.2%] | 0.031 |
| ar-eg | Gemini 3.5 Transcribe | OpenAI GPT-Realtime-Whisper | +4.6% [1.9%–7.7%] | 0.001 |
| ar-eg | Gemini 3.5 Transcribe | Qwen3-ASR | +5.1% [1.6%–9.4%] | 0.006 |
| ar-eg | Gemini 3.5 Transcribe | Whisper Self-Hosted | +6.6% [3.0%–10.8%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD) | +6.6% [3.0%–10.8%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD drops audio) | +6.6% [3.1%–10.7%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +6.6% [2.9%–10.8%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +7.1% [3.1%–11.6%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +7.7% [3.6%–12.2%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | Deepgram Nova-3 | +8.7% [3.8%–13.8%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +11.7% [6.5%–17.4%] | <0.001 |
| ar-sa | Meta Muse | OpenAI GPT-Live-Transcribe (Low delay) | +0.0% [-5.5%–5.8%] | 1.000 |
| ar-sa | Meta Muse | OpenAI GPT-Realtime-Whisper | +1.2% [-4.1%–6.5%] | 0.762 |
| ar-sa | Meta Muse | Gemini 3.5 Transcribe | +1.6% [-3.4%–6.7%] | 0.586 |
| ar-sa | Meta Muse | Zoom Scribe | +2.0% [-3.7%–7.3%] | 0.554 |
| ar-sa | Meta Muse | AssemblyAI Universal-3.6 Pro | +5.9% [0.4%–11.7%] | 0.040 |
| ar-sa | Meta Muse | AssemblyAI Universal-3.5 Pro | +7.0% [2.2%–11.7%] | 0.007 |
| ar-sa | Meta Muse | ElevenLabs Scribe v2 Realtime | +7.0% [0.4%–13.1%] | 0.048 |
| ar-sa | Meta Muse | Gemini 3.5 Transcribe (Smart) | +7.4% [1.7%–13.7%] | 0.011 |
| ar-sa | Meta Muse | Whisper Self-Hosted | +9.4% [3.3%–16.1%] | 0.005 |
| ar-sa | Meta Muse | Whisper Self-Hosted (TEN VAD) | +9.4% [3.3%–16.1%] | 0.005 |
| ar-sa | Meta Muse | Whisper Self-Hosted (TEN VAD drops audio) | +9.4% [2.7%–17.3%] | 0.007 |
| ar-sa | Meta Muse | Deepgram Nova-3 | +10.5% [5.2%–16.5%] | <0.001 |
| ar-sa | Meta Muse | Qwen3-ASR | +11.3% [5.7%–16.9%] | <0.001 |
| ar-sa | Meta Muse | ElevenLabs Scribe v2 Realtime (no verbatim) | +38.3% [28.5%–47.9%] | <0.001 |
| ar-ae | Gemini 3.5 Transcribe | Meta Muse | +0.6% [-8.0%–8.9%] | 1.000 |
| ar-ae | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | +0.6% [-4.8%–6.7%] | 1.000 |
| ar-ae | Gemini 3.5 Transcribe | OpenAI GPT-Live-Transcribe (Low delay) | +2.9% [-7.1%–13.3%] | 0.691 |
| ar-ae | Gemini 3.5 Transcribe | Zoom Scribe | +2.9% [-4.6%–11.0%] | 0.564 |
| ar-ae | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +4.7% [-4.6%–14.3%] | 0.372 |
| ar-ae | Gemini 3.5 Transcribe | OpenAI GPT-Realtime-Whisper | +7.1% [-2.4%–16.4%] | 0.203 |
| ar-ae | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +8.2% [0.0%–16.8%] | 0.059 |
| ar-ae | Gemini 3.5 Transcribe | Deepgram Nova-3 | +8.2% [0.0%–16.8%] | 0.058 |
| ar-ae | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD drops audio) | +9.4% [2.3%–17.0%] | 0.016 |
| ar-ae | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD) | +10.6% [3.3%–18.6%] | 0.010 |
| ar-ae | Gemini 3.5 Transcribe | Whisper Self-Hosted | +11.2% [3.8%–19.1%] | 0.006 |
| ar-ae | Gemini 3.5 Transcribe | Qwen3-ASR | +12.4% [3.7%–20.8%] | 0.012 |
| ar-ae | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +12.9% [4.8%–21.8%] | <0.001 |
| ar-ae | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +30.6% [17.9%–42.9%] | <0.001 |
| de-de | OpenAI GPT-Realtime-Whisper | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.4% [-2.8%–3.6%] | 0.932 |
| de-de | OpenAI GPT-Realtime-Whisper | ElevenLabs Scribe v2 Realtime | +0.8% [-1.8%–3.7%] | 0.709 |
| de-de | OpenAI GPT-Realtime-Whisper | Qwen3-ASR | +1.2% [-0.4%–2.9%] | 0.225 |
| de-de | OpenAI GPT-Realtime-Whisper | OpenAI GPT-Live-Transcribe (Low delay) | +1.2% [-1.7%–4.2%] | 0.520 |
| de-de | OpenAI GPT-Realtime-Whisper | Gemini 3.5 Transcribe (Smart) | +1.6% [-0.4%–4.1%] | 0.243 |
| de-de | OpenAI GPT-Realtime-Whisper | AssemblyAI Universal-3.6 Pro | +1.6% [-1.3%–4.8%] | 0.389 |
| de-de | OpenAI GPT-Realtime-Whisper | Zoom Scribe | +1.6% [-0.4%–4.1%] | 0.239 |
| de-de | OpenAI GPT-Realtime-Whisper | Gemini 3.5 Transcribe | +2.0% [-0.4%–4.7%] | 0.143 |
| de-de | OpenAI GPT-Realtime-Whisper | AssemblyAI Universal-3.5 Pro | +2.8% [0.0%–5.8%] | 0.057 |
| de-de | OpenAI GPT-Realtime-Whisper | Meta Muse | +3.2% [0.4%–6.3%] | 0.027 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +3.6% [1.2%–6.3%] | 0.002 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +3.6% [1.2%–6.3%] | 0.002 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +3.6% [1.2%–6.3%] | 0.002 |
| de-de | OpenAI GPT-Realtime-Whisper | Deepgram Nova-3 | +4.8% [0.8%–9.3%] | 0.020 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | AssemblyAI Universal-3.6 Pro | +0.4% [0.0%–1.4%] | 0.712 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | +0.9% [0.0%–2.3%] | 0.243 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | OpenAI GPT-Realtime-Whisper | +2.2% [0.0%–5.1%] | 0.078 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Whisper Self-Hosted (TEN VAD drops audio) | +2.6% [0.4%–5.7%] | 0.014 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Meta Muse | +3.5% [0.5%–7.3%] | 0.019 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | AssemblyAI Universal-3.5 Pro | +3.5% [0.8%–7.2%] | 0.014 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Gemini 3.5 Transcribe (Smart) | +3.9% [1.2%–7.3%] | <0.001 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Whisper Self-Hosted | +3.9% [1.3%–6.9%] | <0.001 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Whisper Self-Hosted (TEN VAD) | +3.9% [1.3%–6.9%] | <0.001 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Zoom Scribe | +4.3% [1.2%–8.3%] | 0.008 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Gemini 3.5 Transcribe | +4.8% [1.2%–9.1%] | 0.001 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | OpenAI GPT-Live-Transcribe (Low delay) | +4.8% [1.6%–8.7%] | 0.003 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Qwen3-ASR | +5.7% [2.3%–10.0%] | <0.001 |
| es-419 | ElevenLabs Scribe v2 Realtime (no verbatim) | Deepgram Nova-3 | +7.0% [2.9%–12.1%] | <0.001 |
| es-es | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.5% [-1.1%–2.6%] | 0.766 |
| es-es | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +0.5% [0.0%–1.6%] | 0.712 |
| es-es | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +1.1% [0.0%–2.7%] | 0.238 |
| es-es | Gemini 3.5 Transcribe (Smart) | Qwen3-ASR | +1.6% [0.0%–4.2%] | 0.236 |
| es-es | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +1.6% [0.0%–3.6%] | 0.079 |
| es-es | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +1.6% [0.0%–3.3%] | 0.077 |
| es-es | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.6 Pro | +2.1% [0.5%–4.2%] | 0.022 |
| es-es | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +2.1% [0.5%–4.2%] | 0.026 |
| es-es | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.5 Pro | +2.6% [1.0%–4.9%] | 0.006 |
| es-es | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +2.6% [1.0%–4.9%] | 0.006 |
| es-es | Gemini 3.5 Transcribe (Smart) | Meta Muse | +3.2% [1.0%–5.9%] | 0.008 |
| es-es | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD drops audio) | +7.4% [1.0%–18.5%] | 0.008 |
| es-es | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +12.1% [1.6%–26.7%] | 0.002 |
| es-es | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD) | +12.1% [1.6%–26.7%] | 0.002 |
| es-pr | Gemini 3.5 Transcribe | Deepgram Nova-3 | +0.5% [-1.1%–2.2%] | 0.785 |
| es-pr | Gemini 3.5 Transcribe | Zoom Scribe | +0.5% [-1.2%–2.2%] | 0.791 |
| es-pr | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | +1.0% [0.0%–3.2%] | 0.712 |
| es-pr | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD drops audio) | +1.0% [-3.0%–6.1%] | 0.944 |
| es-pr | Gemini 3.5 Transcribe | Meta Muse | +1.6% [0.0%–4.8%] | 0.739 |
| es-pr | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +1.6% [0.0%–3.3%] | 0.078 |
| es-pr | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +1.6% [0.0%–3.3%] | 0.078 |
| es-pr | Gemini 3.5 Transcribe | Whisper Self-Hosted | +2.1% [-2.1%–7.1%] | 0.464 |
| es-pr | Gemini 3.5 Transcribe | Whisper Self-Hosted (TEN VAD) | +2.1% [-2.1%–7.1%] | 0.464 |
| es-pr | Gemini 3.5 Transcribe | OpenAI GPT-Live-Transcribe (Low delay) | +2.1% [-1.2%–6.7%] | 0.482 |
| es-pr | Gemini 3.5 Transcribe | OpenAI GPT-Realtime-Whisper | +3.7% [0.0%–9.2%] | 0.077 |
| es-pr | Gemini 3.5 Transcribe | Qwen3-ASR | +4.7% [0.0%–11.4%] | 0.095 |
| es-pr | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +4.7% [0.0%–10.3%] | 0.076 |
| es-pr | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +5.2% [0.5%–10.7%] | 0.044 |
| fr-fr | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +1.1% [-1.1%–3.7%] | 0.514 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Whisper Self-Hosted (TEN VAD drops audio) | +2.2% [-2.0%–7.0%] | 0.393 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Zoom Scribe | +2.2% [-1.4%–5.7%] | 0.294 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Whisper Self-Hosted | +3.6% [0.0%–7.7%] | 0.060 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Whisper Self-Hosted (TEN VAD) | +3.6% [0.0%–7.7%] | 0.060 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Gemini 3.5 Transcribe (Smart) | +4.0% [-1.5%–10.4%] | 0.203 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Qwen3-ASR | +4.3% [-0.8%–10.0%] | 0.129 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Gemini 3.5 Transcribe | +4.3% [-0.8%–9.7%] | 0.111 |
| fr-fr | AssemblyAI Universal-3.6 Pro | OpenAI GPT-Realtime-Whisper | +4.3% [-0.7%–9.7%] | 0.093 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Meta Muse | +5.8% [0.8%–10.6%] | 0.022 |
| fr-fr | AssemblyAI Universal-3.6 Pro | ElevenLabs Scribe v2 Realtime | +6.2% [1.1%–11.0%] | 0.017 |
| fr-fr | AssemblyAI Universal-3.6 Pro | ElevenLabs Scribe v2 Realtime (no verbatim) | +6.5% [1.0%–12.2%] | 0.021 |
| fr-fr | AssemblyAI Universal-3.6 Pro | OpenAI GPT-Live-Transcribe (Low delay) | +6.5% [0.4%–12.3%] | 0.037 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | +7.6% [4.5%–10.9%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +0.4% [0.0%–1.4%] | 0.704 |
| hi-in | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.6 Pro | +6.6% [0.4%–15.9%] | 0.037 |
| hi-in | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +7.9% [1.6%–16.1%] | 0.007 |
| hi-in | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +9.2% [2.3%–18.3%] | 0.002 |
| hi-in | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +9.2% [1.3%–20.0%] | 0.025 |
| hi-in | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +9.2% [2.1%–18.0%] | 0.011 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Meta Muse | +12.3% [1.3%–25.6%] | 0.027 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Qwen3-ASR | +15.8% [8.3%–25.1%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +18.0% [9.5%–28.6%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.5 Pro | +23.2% [16.7%–31.1%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +27.2% [20.0%–35.4%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD) | +27.2% [20.0%–35.4%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted (TEN VAD drops audio) | +28.9% [20.3%–38.8%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +32.0% [21.4%–43.5%] | <0.001 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Deepgram Nova-3 | +2.1% [-2.1%–6.6%] | 0.385 |
| ur-pk | OpenAI GPT-Realtime-Whisper | AssemblyAI Universal-3.6 Pro | +2.8% [-2.1%–7.5%] | 0.309 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +7.0% [0.7%–13.5%] | 0.032 |
| ur-pk | OpenAI GPT-Realtime-Whisper | ElevenLabs Scribe v2 Realtime (no verbatim) | +7.0% [0.7%–12.9%] | 0.038 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +7.4% [1.3%–13.4%] | 0.024 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +7.4% [1.3%–13.4%] | 0.024 |
| ur-pk | OpenAI GPT-Realtime-Whisper | OpenAI GPT-Live-Transcribe (Low delay) | +7.4% [-0.4%–17.2%] | 0.080 |
| ur-pk | OpenAI GPT-Realtime-Whisper | ElevenLabs Scribe v2 Realtime | +9.9% [3.9%–16.0%] | 0.002 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Qwen3-ASR | +82.4% [73.1%–89.9%] | <0.001 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Gemini 3.5 Transcribe | +0.5% [-0.8%–2.2%] | 0.600 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | +0.5% [-0.5%–1.6%] | 0.435 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Zoom Scribe | +0.5% [-1.1%–1.9%] | 0.581 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Qwen3-ASR | +0.8% [-0.3%–2.0%] | 0.239 |
| zh-cn | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +0.8% [0.0%–1.7%] | 0.081 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Gemini 3.5 Transcribe (Smart) | +1.1% [-0.8%–3.0%] | 0.337 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Whisper Self-Hosted | +1.4% [0.0%–2.7%] | 0.063 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Whisper Self-Hosted (TEN VAD) | +1.4% [0.0%–2.7%] | 0.063 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Whisper Self-Hosted (TEN VAD drops audio) | +1.4% [0.0%–2.7%] | 0.063 |
| zh-cn | AssemblyAI Universal-3.6 Pro | ElevenLabs Scribe v2 Realtime (no verbatim) | +1.6% [-0.3%–3.8%] | 0.161 |
| zh-cn | AssemblyAI Universal-3.6 Pro | ElevenLabs Scribe v2 Realtime | +2.5% [0.3%–5.2%] | 0.041 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Meta Muse | +3.8% [1.1%–6.9%] | 0.004 |
| zh-cn | AssemblyAI Universal-3.6 Pro | OpenAI GPT-Live-Transcribe (Low delay) | +3.8% [1.7%–6.3%] | <0.001 |
| zh-cn | AssemblyAI Universal-3.6 Pro | OpenAI GPT-Realtime-Whisper | +4.1% [2.1%–6.0%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

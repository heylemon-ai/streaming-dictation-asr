# ASR benchmark results — 2026-10-14 (all-engines)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Large V3 | self-hosted (Baseten) |
| Qwen3-ASR | self-hosted (Baseten) |
| Meta Muse | muse-voice-transcribe-1.0 |
| Gemini 3.5 Transcribe | gemini-3.5-transcribe-live |
| AssemblyAI Universal-3.5 Pro | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro | universal-3-6-pro |
| Deepgram Nova-3 | nova-3 |
| ElevenLabs Scribe v2 Realtime | scribe_v2_realtime |
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

| Set | Whisper Large V3 | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|
| en-dictation | 8.7% [7.2%–10.5%] | 11.8% [10.0%–13.6%] | 9.5% [8.3%–10.6%] | 6.9% [5.8%–8.0%] | 9.0% [7.9%–10.1%] | 8.2% [7.2%–9.1%] | 13.6% [12.0%–15.1%] | 12.8% [10.9%–14.9%] | 7.4% [6.5%–8.3%] |
| en-dictation-noise | 7.0% [4.7%–9.6%] | 6.5% [4.6%–8.8%] | 7.4% [5.3%–9.6%] | 2.5% [1.8%–3.3%] | 4.3% [2.8%–6.2%] | 4.1% [2.7%–5.7%] | 11.4% [8.8%–14.0%] | 5.8% [3.7%–8.2%] | 3.6% [2.2%–5.2%] |
| en-dictation-whisper | 80.7% [69.2%–89.6%] | 52.6% [35.7%–77.3%] | 11.3% [9.0%–14.1%] | 5.0% [2.8%–6.7%] | 30.9% [15.2%–55.9%] | 30.5% [14.6%–55.8%] | 19.8% [15.7%–23.6%] | 9.1% [5.4%–12.9%] | 34.7% [19.2%–60.2%] |
| ar-eg | 10.2% [5.8%–15.0%] | 7.7% [2.7%–13.8%] | 6.6% [2.1%–12.6%] | 2.6% [0.5%–5.3%] | 14.3% [8.5%–20.8%] | 9.7% [4.4%–16.0%] | 11.2% [6.3%–16.2%] | 10.2% [5.2%–15.8%] | 5.1% [1.6%–8.7%] |
| ar-sa | 37.9% [26.8%–50.0%] | 39.8% [28.0%–52.5%] | 27.7% [18.7%–38.1%] | 29.3% [19.1%–40.7%] | 34.8% [25.1%–45.0%] | 33.6% [24.2%–43.7%] | 38.3% [28.4%–49.5%] | 34.8% [23.3%–47.4%] | 29.7% [19.3%–41.3%] |
| ar-ae | 62.9% [52.0%–74.9%] | 61.2% [51.2%–71.8%] | 49.4% [38.9%–61.2%] | 48.8% [39.6%–58.9%] | 57.1% [47.0%–67.8%] | 53.5% [43.5%–63.9%] | 57.1% [47.4%–66.7%] | 61.8% [51.4%–72.3%] | 51.8% [41.5%–62.5%] |
| de-de | 6.0% [2.5%–10.0%] | 5.2% [2.0%–9.1%] | 6.5% [2.7%–10.2%] | 5.2% [2.6%–7.8%] | 6.0% [3.0%–8.8%] | 4.8% [2.1%–7.6%] | 8.1% [4.3%–12.3%] | 4.0% [1.6%–6.7%] | 4.8% [1.5%–9.1%] |
| es-419 | 3.9% [1.2%–7.5%] | 7.0% [3.2%–12.0%] | 5.2% [2.1%–9.4%] | 6.5% [2.9%–11.5%] | 5.2% [1.7%–9.9%] | 2.2% [0.4%–4.6%] | 8.7% [3.9%–15.0%] | 2.6% [0.8%–5.1%] | 6.1% [2.2%–11.2%] |
| es-es | 10.0% [1.6%–23.0%] | 8.9% [1.1%–21.6%] | 10.5% [2.7%–23.3%] | 8.4% [1.1%–20.6%] | 10.0% [2.1%–22.3%] | 9.5% [1.6%–21.9%] | 9.5% [2.0%–21.8%] | 8.9% [1.1%–21.3%] | 10.0% [2.1%–22.3%] |
| es-pr | 4.7% [1.0%–9.9%] | 7.3% [3.1%–12.1%] | 5.2% [1.6%–9.5%] | 3.7% [1.1%–6.7%] | 5.2% [2.0%–9.0%] | 5.2% [2.0%–9.0%] | 4.2% [1.1%–8.1%] | 8.9% [3.1%–15.7%] | 4.2% [1.1%–8.1%] |
| fr-fr | 7.2% [3.1%–11.8%] | 9.4% [4.4%–15.3%] | 8.7% [4.6%–13.1%] | 7.2% [2.9%–12.5%] | 4.0% [1.0%–7.6%] | 2.9% [0.7%–5.8%] | 10.5% [6.5%–14.6%] | 9.1% [4.8%–13.9%] | 5.1% [2.1%–8.5%] |
| hi-in | 29.4% [19.6%–40.4%] | 17.5% [9.6%–27.4%] | 14.9% [4.1%–28.8%] | 3.1% [0.9%–5.7%] | 25.9% [18.2%–34.2%] | 9.2% [2.7%–19.0%] | 20.6% [11.5%–32.0%] | 11.8% [4.8%–21.3%] | 34.6% [23.6%–46.6%] |
| ur-pk | 18.3% [12.1%–24.8%] | 100.4% [99.3%–101.8%] | 87.3% [75.6%–97.3%] * | 51.8% [32.3%–72.1%] * | 91.5% [76.4%–101.8%] * | 15.1% [9.2%–20.8%] | 14.4% [9.5%–19.7%] | 22.2% [15.7%–28.6%] | 102.5% [100.7%–104.5%] * |
| zh-cn | 4.6% [2.5%–6.9%] | 3.3% [1.6%–5.0%] | 6.5% [3.3%–9.8%] | 3.3% [1.5%–5.1%] | 3.5% [1.8%–5.4%] | 2.7% [0.8%–4.7%] | 3.3% [1.4%–5.2%] | 5.2% [2.4%–8.2%] | 3.3% [1.5%–5.2%] |

\* No option for this language in the engine, so no language was sent and the engine auto-detected: Meta Muse on ur-pk; Gemini 3.5 Transcribe on ur-pk; AssemblyAI Universal-3.5 Pro on ur-pk; Zoom Scribe on ur-pk. This is what a person choosing that language gets, not the engine's accuracy with the language set. Left out of paired comparisons.

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Large V3 | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|
| en-dictation | 16.1% | 18.5% | 18.3% | 9.1% | 14.9% | 13.1% | 22.8% | 21.9% | 13.7% |
| en-dictation-noise | 14.7% | 12.2% | 14.9% | 6.4% | 9.4% | 8.8% | 20.0% | 11.6% | 10.2% |
| en-dictation-whisper | 86.0% | 56.7% | 22.4% | 8.6% | 35.9% | 35.1% | 32.1% | 16.0% | 41.6% |
| ar-eg | 28.1% | 17.4% | 27.2% | 14.9% | 27.7% | 19.6% | 36.6% | 20.4% | 15.3% |
| ar-sa | 46.4% | 47.1% | 49.3% | 54.3% | 43.5% | 42.8% | 57.2% | 53.3% | 42.8% |
| ar-ae | 69.1% | 72.9% | 62.8% | 66.0% | 60.6% | 60.1% | 63.8% | 76.1% | 67.0% |
| de-de | 8.2% | 7.9% | 10.3% | 7.9% | 8.9% | 7.6% | 11.3% | 7.9% | 7.6% |
| es-419 | 12.0% | 16.4% | 14.5% | 13.8% | 12.4% | 10.9% | 17.5% | 9.1% | 16.4% |
| es-es | 16.2% | 13.0% | 22.2% | 12.0% | 14.4% | 13.0% | 14.8% | 13.0% | 19.4% |
| es-pr | 19.3% | 23.9% | 22.8% | 18.3% | 19.3% | 20.3% | 19.3% | 22.8% | 17.3% |
| fr-fr | 10.6% | 12.5% | 12.9% | 10.3% | 7.7% | 6.1% | 13.5% | 13.5% | 8.7% |
| hi-in | 27.4% | 16.7% | 18.3% | 5.3% | 23.5% | 10.7% | 23.7% | 16.4% | 27.6% |
| ur-pk | 24.7% | 167.9% | 136.4% * | 85.4% * | 148.1% * | 19.2% | 19.2% | 23.4% | 103.6% * |
| zh-cn | 12.5% | 5.0% | 8.0% | 5.5% | 5.5% | 4.8% | 6.3% | 7.2% | 5.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Large V3 | 5.5% | 9.5% | 2.0% |
| Qwen3-ASR | 8.0% | 5.9% | 4.0% |
| Meta Muse | 6.7% | 1.4% | 3.7% |
| Gemini 3.5 Transcribe | 4.1% | 1.2% | 2.6% |
| AssemblyAI Universal-3.5 Pro | 6.3% | 3.8% | 3.4% |
| AssemblyAI Universal-3.6 Pro | 4.2% | 3.7% | 2.9% |
| Deepgram Nova-3 | 7.2% | 3.0% | 4.2% |
| ElevenLabs Scribe v2 Realtime | 4.8% | 1.7% | 5.9% |
| Zoom Scribe | 6.0% | 4.3% | 2.6% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Whisper Large V3 | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|
| nonspeech | 0.0% (0/10) | – | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Large V3 | 395 | 624 | 778 | 989 | 323 |
| Qwen3-ASR | 488 | 704 | 1688 | 2142 | 323 |
| Meta Muse | 313 | 371 | 1368 | 1756 | 336 |
| Gemini 3.5 Transcribe | 584 | 905 | 674 | 814 | 326 |
| AssemblyAI Universal-3.5 Pro | 727 | 1218 | 1228 | 1370 | 336 |
| AssemblyAI Universal-3.6 Pro | 722 | 1210 | 1227 | 1399 | 336 |
| Deepgram Nova-3 | 357 | 431 | 911 | 1053 | 336 |
| ElevenLabs Scribe v2 Realtime | 398 | 493 | 685 | 765 | 336 |
| Zoom Scribe | 407 | 616 | 1406 | 1655 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Large V3 | 13 (en-dictation-whisper, en-dictation-whisper, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, ar-ae) | 0 |
| Qwen3-ASR | 3 (en-dictation-whisper, en-dictation-whisper, ar-ae) | 0 |
| Meta Muse | 0 | 0 |
| Gemini 3.5 Transcribe | 0 | 0 |
| AssemblyAI Universal-3.5 Pro | 0 | 0 |
| AssemblyAI Universal-3.6 Pro | 0 | 0 |
| Deepgram Nova-3 | 0 | 0 |
| ElevenLabs Scribe v2 Realtime | 0 | 0 |
| Zoom Scribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | Gemini 3.5 Transcribe | Zoom Scribe | +0.5% [-0.1%–1.3%] | 0.100 |
| en-dictation | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +1.3% [0.6%–2.0%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe | Whisper Large V3 | +1.8% [0.5%–3.4%] | 0.008 |
| en-dictation | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +2.1% [1.4%–2.8%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe | Meta Muse | +2.6% [2.0%–3.2%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe | Qwen3-ASR | +4.9% [3.8%–6.1%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +5.9% [4.6%–7.9%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe | Deepgram Nova-3 | +6.7% [5.8%–7.7%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Zoom Scribe | +1.0% [-0.1%–2.2%] | 0.104 |
| en-dictation-noise | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +1.5% [0.1%–2.8%] | 0.037 |
| en-dictation-noise | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +1.8% [0.2%–3.3%] | 0.023 |
| en-dictation-noise | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +3.3% [1.5%–5.4%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Qwen3-ASR | +4.0% [2.2%–6.0%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Whisper Large V3 | +4.4% [2.4%–6.6%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Meta Muse | +4.8% [3.1%–6.8%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Deepgram Nova-3 | +8.9% [6.3%–11.7%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +4.1% [1.5%–7.3%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Meta Muse | +6.4% [4.5%–8.7%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Deepgram Nova-3 | +14.8% [11.4%–18.7%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +25.6% [9.1%–51.8%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +26.0% [9.5%–52.2%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Zoom Scribe | +29.7% [13.8%–55.5%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Qwen3-ASR | +47.7% [29.9%–74.9%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Whisper Large V3 | +75.7% [64.0%–84.9%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | Zoom Scribe | +2.6% [0.5%–5.2%] | 0.019 |
| ar-eg | Gemini 3.5 Transcribe | Meta Muse | +4.1% [0.5%–8.3%] | 0.027 |
| ar-eg | Gemini 3.5 Transcribe | Qwen3-ASR | +5.1% [1.6%–9.5%] | 0.002 |
| ar-eg | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +7.1% [3.1%–11.6%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | Whisper Large V3 | +7.7% [3.5%–12.4%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +7.7% [3.6%–12.2%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | Deepgram Nova-3 | +8.7% [3.8%–13.8%] | <0.001 |
| ar-eg | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +11.7% [6.5%–17.4%] | <0.001 |
| ar-sa | Meta Muse | Gemini 3.5 Transcribe | +1.6% [-3.4%–6.7%] | 0.586 |
| ar-sa | Meta Muse | Zoom Scribe | +2.0% [-3.7%–7.3%] | 0.554 |
| ar-sa | Meta Muse | AssemblyAI Universal-3.6 Pro | +5.9% [0.4%–11.7%] | 0.040 |
| ar-sa | Meta Muse | AssemblyAI Universal-3.5 Pro | +7.0% [2.2%–11.7%] | 0.007 |
| ar-sa | Meta Muse | ElevenLabs Scribe v2 Realtime | +7.0% [0.4%–13.1%] | 0.048 |
| ar-sa | Meta Muse | Whisper Large V3 | +10.2% [5.4%–14.9%] | <0.001 |
| ar-sa | Meta Muse | Deepgram Nova-3 | +10.5% [5.2%–16.5%] | <0.001 |
| ar-sa | Meta Muse | Qwen3-ASR | +12.1% [6.1%–18.2%] | <0.001 |
| ar-ae | Gemini 3.5 Transcribe | Meta Muse | +0.6% [-8.0%–8.9%] | 1.000 |
| ar-ae | Gemini 3.5 Transcribe | Zoom Scribe | +2.9% [-4.6%–11.0%] | 0.564 |
| ar-ae | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +4.7% [-4.6%–14.3%] | 0.372 |
| ar-ae | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +8.2% [0.0%–16.8%] | 0.059 |
| ar-ae | Gemini 3.5 Transcribe | Deepgram Nova-3 | +8.2% [0.0%–16.8%] | 0.058 |
| ar-ae | Gemini 3.5 Transcribe | Qwen3-ASR | +12.4% [2.9%–21.1%] | 0.017 |
| ar-ae | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +12.9% [4.8%–21.8%] | <0.001 |
| ar-ae | Gemini 3.5 Transcribe | Whisper Large V3 | +14.1% [5.4%–24.1%] | 0.001 |
| de-de | ElevenLabs Scribe v2 Realtime | AssemblyAI Universal-3.6 Pro | +0.8% [0.0%–2.6%] | 0.711 |
| de-de | ElevenLabs Scribe v2 Realtime | Zoom Scribe | +0.8% [-1.9%–4.2%] | 0.676 |
| de-de | ElevenLabs Scribe v2 Realtime | Qwen3-ASR | +1.2% [-2.6%–5.2%] | 0.617 |
| de-de | ElevenLabs Scribe v2 Realtime | Gemini 3.5 Transcribe | +1.2% [0.0%–2.7%] | 0.076 |
| de-de | ElevenLabs Scribe v2 Realtime | Whisper Large V3 | +2.0% [-1.2%–6.0%] | 0.286 |
| de-de | ElevenLabs Scribe v2 Realtime | AssemblyAI Universal-3.5 Pro | +2.0% [0.0%–4.7%] | 0.091 |
| de-de | ElevenLabs Scribe v2 Realtime | Meta Muse | +2.4% [0.8%–4.4%] | 0.009 |
| de-de | ElevenLabs Scribe v2 Realtime | Deepgram Nova-3 | +4.0% [0.0%–8.7%] | 0.053 |
| es-419 | AssemblyAI Universal-3.6 Pro | ElevenLabs Scribe v2 Realtime | +0.4% [0.0%–1.4%] | 0.729 |
| es-419 | AssemblyAI Universal-3.6 Pro | Whisper Large V3 | +1.7% [-0.8%–4.9%] | 0.299 |
| es-419 | AssemblyAI Universal-3.6 Pro | Meta Muse | +3.0% [0.0%–6.9%] | 0.090 |
| es-419 | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +3.0% [0.4%–6.5%] | 0.014 |
| es-419 | AssemblyAI Universal-3.6 Pro | Zoom Scribe | +3.9% [0.9%–7.7%] | 0.008 |
| es-419 | AssemblyAI Universal-3.6 Pro | Gemini 3.5 Transcribe | +4.3% [0.8%–8.6%] | 0.006 |
| es-419 | AssemblyAI Universal-3.6 Pro | Qwen3-ASR | +4.8% [1.2%–9.1%] | 0.002 |
| es-419 | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | +6.5% [2.6%–11.3%] | <0.001 |
| es-es | Gemini 3.5 Transcribe | Qwen3-ASR | +0.5% [-1.1%–2.2%] | 0.761 |
| es-es | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +0.5% [-1.1%–2.6%] | 0.771 |
| es-es | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +1.1% [-1.0%–3.2%] | 0.420 |
| es-es | Gemini 3.5 Transcribe | Deepgram Nova-3 | +1.1% [-1.0%–3.2%] | 0.434 |
| es-es | Gemini 3.5 Transcribe | Whisper Large V3 | +1.6% [-1.0%–4.3%] | 0.318 |
| es-es | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +1.6% [-0.5%–3.9%] | 0.232 |
| es-es | Gemini 3.5 Transcribe | Zoom Scribe | +1.6% [-0.5%–3.9%] | 0.232 |
| es-es | Gemini 3.5 Transcribe | Meta Muse | +2.1% [0.0%–4.6%] | 0.091 |
| es-pr | Gemini 3.5 Transcribe | Deepgram Nova-3 | +0.5% [-1.1%–2.2%] | 0.785 |
| es-pr | Gemini 3.5 Transcribe | Zoom Scribe | +0.5% [-1.2%–2.2%] | 0.791 |
| es-pr | Gemini 3.5 Transcribe | Whisper Large V3 | +1.0% [-3.0%–6.1%] | 0.944 |
| es-pr | Gemini 3.5 Transcribe | Meta Muse | +1.6% [0.0%–4.8%] | 0.739 |
| es-pr | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +1.6% [0.0%–3.3%] | 0.078 |
| es-pr | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +1.6% [0.0%–3.3%] | 0.078 |
| es-pr | Gemini 3.5 Transcribe | Qwen3-ASR | +3.7% [0.0%–8.5%] | 0.101 |
| es-pr | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +5.2% [0.5%–10.7%] | 0.044 |
| fr-fr | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +1.1% [-1.1%–3.7%] | 0.514 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Zoom Scribe | +2.2% [-1.4%–5.7%] | 0.294 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Whisper Large V3 | +4.3% [-0.4%–9.2%] | 0.095 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Gemini 3.5 Transcribe | +4.3% [-0.8%–9.7%] | 0.111 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Meta Muse | +5.8% [0.8%–10.6%] | 0.022 |
| fr-fr | AssemblyAI Universal-3.6 Pro | ElevenLabs Scribe v2 Realtime | +6.2% [1.1%–11.0%] | 0.017 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Qwen3-ASR | +6.5% [1.1%–12.5%] | 0.019 |
| fr-fr | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | +7.6% [4.5%–10.9%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe | AssemblyAI Universal-3.6 Pro | +6.1% [0.4%–14.5%] | 0.037 |
| hi-in | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +8.8% [2.3%–17.2%] | 0.002 |
| hi-in | Gemini 3.5 Transcribe | Meta Muse | +11.8% [1.3%–25.0%] | 0.027 |
| hi-in | Gemini 3.5 Transcribe | Qwen3-ASR | +14.5% [7.7%–23.1%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe | Deepgram Nova-3 | +17.5% [9.5%–27.5%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe | AssemblyAI Universal-3.5 Pro | +22.8% [16.6%–30.0%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe | Whisper Large V3 | +26.3% [18.2%–35.5%] | <0.001 |
| hi-in | Gemini 3.5 Transcribe | Zoom Scribe | +31.6% [21.2%–42.5%] | <0.001 |
| ur-pk | Deepgram Nova-3 | AssemblyAI Universal-3.6 Pro | +0.7% [-4.6%–5.3%] | 0.794 |
| ur-pk | Deepgram Nova-3 | Whisper Large V3 | +3.9% [-2.1%–10.0%] | 0.246 |
| ur-pk | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime | +7.7% [2.7%–12.5%] | 0.003 |
| ur-pk | Deepgram Nova-3 | Qwen3-ASR | +85.9% [80.2%–90.9%] | <0.001 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Qwen3-ASR | +0.5% [-0.5%–1.7%] | 0.449 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Gemini 3.5 Transcribe | +0.5% [-0.8%–2.2%] | 0.600 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | +0.5% [-0.5%–1.6%] | 0.435 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Zoom Scribe | +0.5% [-1.1%–1.9%] | 0.581 |
| zh-cn | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +0.8% [0.0%–1.7%] | 0.081 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Whisper Large V3 | +1.9% [0.3%–4.0%] | 0.046 |
| zh-cn | AssemblyAI Universal-3.6 Pro | ElevenLabs Scribe v2 Realtime | +2.5% [0.3%–5.2%] | 0.041 |
| zh-cn | AssemblyAI Universal-3.6 Pro | Meta Muse | +3.8% [1.1%–6.9%] | 0.004 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

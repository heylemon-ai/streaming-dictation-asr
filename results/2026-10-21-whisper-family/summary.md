# ASR benchmark results — 2026-10-21 (whisper-family)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Large V3 | self-hosted (Baseten) |
| OpenAI Whisper-1 (split at pauses) | whisper-1 |
| Whisper Self-Hosted | self-hosted (Baseten) |
| Whisper Self-Hosted (VAD drops audio) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN VAD) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN VAD drops audio) | self-hosted (Baseten) |
| OpenAI GPT-Realtime-Whisper | gpt-realtime-whisper |
| OpenAI Whisper-1 | whisper-1 |

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

| Set | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|---|---|---|---|---|
| en-dictation | 8.7% [7.2%–10.5%] | 6.5% [5.6%–7.5%] | 8.3% [6.8%–9.8%] | 8.0% [6.7%–9.6%] | 7.8% [6.2%–9.4%] | 7.2% [6.1%–8.3%] | 8.2% [7.0%–9.5%] | 5.5% [4.6%–6.4%] |
| en-dictation-noise | 7.0% [4.7%–9.6%] | 6.3% [3.9%–9.5%] | 6.5% [4.1%–10.0%] | 5.3% [3.5%–7.4%] | 5.9% [3.4%–9.2%] | 5.9% [3.9%–8.5%] | 4.6% [3.2%–6.4%] | 5.3% [3.6%–7.4%] |
| en-dictation-whisper | 80.7% [69.2%–89.6%] | 23.4% [10.0%–44.5%] | 10.1% [7.1%–13.0%] | 51.4% [36.3%–75.4%] | 10.2% [7.7%–12.3%] | 10.7% [8.0%–12.7%] | 8.9% [7.2%–11.0%] | 7.7% [5.7%–10.4%] |
| ar-eg | 10.2% [5.8%–15.0%] | 12.2% [7.9%–17.2%] | 9.2% [5.4%–13.7%] | 9.2% [5.4%–13.7%] | 9.2% [5.4%–13.7%] | 9.2% [5.4%–13.7%] | 7.1% [3.6%–11.2%] | 12.2% [7.9%–17.2%] |
| ar-sa | 37.9% [26.8%–50.0%] | 37.5% [27.0%–49.4%] | 37.1% [24.5%–51.8%] | 40.6% [28.3%–54.6%] | 37.1% [24.5%–51.8%] | 37.1% [24.0%–52.6%] | 28.9% [16.9%–42.6%] | 38.3% [27.8%–50.6%] |
| ar-ae | 62.9% [52.0%–74.9%] | 61.8% [51.1%–73.1%] | 60.0% [49.7%–71.1%] | 62.4% [51.9%–73.9%] | 59.4% [48.7%–70.8%] | 58.2% [48.1%–69.6%] | 55.9% [43.9%–67.1%] | 60.6% [50.0%–72.0%] |
| de-de | 6.0% [2.5%–10.0%] | 6.5% [3.1%–10.0%] | 6.9% [3.2%–10.8%] | 6.9% [3.2%–10.8%] | 6.9% [3.2%–10.8%] | 6.9% [3.2%–10.8%] | 3.2% [0.8%–6.0%] | 6.5% [3.1%–10.0%] |
| es-419 | 3.9% [1.2%–7.5%] | 6.5% [2.9%–11.4%] | 5.7% [2.8%–9.1%] | 4.3% [1.3%–8.2%] | 5.7% [2.8%–9.1%] | 4.3% [1.3%–8.2%] | 3.9% [1.4%–7.0%] | 6.5% [2.9%–11.4%] |
| es-es | 10.0% [1.6%–23.0%] | 8.4% [0.5%–20.9%] | 19.5% [3.6%–36.9%] | 14.2% [1.1%–30.7%] | 19.5% [3.6%–36.9%] | 14.7% [1.6%–31.0%] | 7.9% [0.5%–20.2%] | 8.4% [0.5%–20.9%] |
| es-pr | 4.7% [1.0%–9.9%] | 7.9% [1.8%–15.6%] | 5.8% [1.7%–11.2%] | 4.7% [1.0%–9.9%] | 5.8% [1.7%–11.2%] | 4.7% [1.0%–9.9%] | 7.3% [2.3%–13.9%] | 7.9% [1.8%–15.6%] |
| fr-fr | 7.2% [3.1%–11.8%] | 6.5% [2.4%–12.1%] | 6.5% [2.8%–11.2%] | 6.9% [2.4%–12.4%] | 6.5% [2.8%–11.2%] | 5.1% [1.4%–9.9%] | 7.2% [2.8%–13.0%] | 6.5% [2.4%–12.1%] |
| hi-in | 29.4% [19.6%–40.4%] | 36.0% [26.2%–46.5%] | 29.8% [21.3%–39.2%] | 32.9% [22.3%–43.8%] | 29.8% [21.3%–39.2%] | 31.6% [21.9%–42.2%] | 11.8% [4.9%–20.4%] | 36.0% [26.2%–46.5%] |
| ur-pk | 18.3% [12.1%–24.8%] | 20.8% [14.5%–26.6%] | 19.7% [13.4%–26.1%] | 18.3% [12.0%–24.9%] | 19.7% [13.4%–26.1%] | 19.4% [12.9%–26.0%] | 12.3% [9.0%–16.2%] | 21.1% [14.9%–27.0%] |
| zh-cn | 4.6% [2.5%–6.9%] | 5.4% [3.0%–7.6%] | 4.1% [2.2%–6.0%] | 4.1% [2.2%–6.0%] | 4.1% [2.2%–6.0%] | 4.1% [2.2%–6.0%] | 6.8% [4.9%–8.6%] | 5.2% [2.8%–7.2%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|---|---|---|---|---|
| en-dictation | 16.1% | 13.4% | 16.0% | 16.0% | 15.3% | 15.5% | 11.9% | 10.1% |
| en-dictation-noise | 14.7% | 14.8% | 14.3% | 12.8% | 13.8% | 13.1% | 8.1% | 9.2% |
| en-dictation-whisper | 86.0% | 32.8% | 20.8% | 56.9% | 18.3% | 19.4% | 13.8% | 17.7% |
| ar-eg | 28.1% | 26.4% | 27.7% | 27.7% | 27.2% | 27.7% | 16.2% | 26.4% |
| ar-sa | 46.4% | 46.0% | 44.9% | 47.1% | 44.9% | 45.7% | 40.2% | 45.7% |
| ar-ae | 69.1% | 69.7% | 66.0% | 67.6% | 65.4% | 64.4% | 62.8% | 68.6% |
| de-de | 8.2% | 10.0% | 10.0% | 10.0% | 10.3% | 9.6% | 6.2% | 10.0% |
| es-419 | 12.0% | 14.2% | 15.3% | 14.2% | 14.5% | 12.7% | 10.9% | 14.2% |
| es-es | 16.2% | 16.2% | 31.9% | 20.8% | 31.9% | 27.8% | 12.5% | 16.2% |
| es-pr | 19.3% | 23.4% | 20.8% | 20.3% | 20.8% | 19.3% | 23.4% | 23.4% |
| fr-fr | 10.6% | 11.3% | 10.0% | 10.3% | 10.0% | 8.0% | 11.9% | 11.3% |
| hi-in | 27.4% | 27.9% | 25.3% | 28.3% | 25.3% | 28.3% | 13.5% | 27.9% |
| ur-pk | 24.7% | 26.3% | 26.0% | 24.7% | 26.0% | 25.3% | 13.3% | 26.6% |
| zh-cn | 12.5% | 11.5% | 12.0% | 12.0% | 12.0% | 12.0% | 8.5% | 11.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Large V3 | 5.5% | 9.5% | 2.0% |
| OpenAI Whisper-1 (split at pauses) | 5.6% | 2.8% | 1.9% |
| Whisper Self-Hosted | 5.4% | 2.3% | 2.3% |
| Whisper Self-Hosted (VAD drops audio) | 5.2% | 6.6% | 2.0% |
| Whisper Self-Hosted (TEN VAD) | 5.2% | 2.5% | 2.0% |
| Whisper Self-Hosted (TEN VAD drops audio) | 5.1% | 2.1% | 2.0% |
| OpenAI GPT-Realtime-Whisper | 4.4% | 1.6% | 2.9% |
| OpenAI Whisper-1 | 5.4% | 1.4% | 1.2% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|---|---|---|---|---|
| nonspeech | 0.0% (0/10) | 0.0% (0/10) | 60.0% (6/10) | 0.0% (0/10) | 60.0% (6/10) | 20.0% (2/10) | 0.0% (0/10) | 100.0% (10/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Large V3 | 395 | 624 | 778 | 989 | 323 |
| OpenAI Whisper-1 (split at pauses) | 1550 | 2314 | 0 | 0 | 336 |
| Whisper Self-Hosted | 361 | 498 | 837 | 940 | 336 |
| Whisper Self-Hosted (VAD drops audio) | 385 | 540 | 897 | 1102 | 336 |
| Whisper Self-Hosted (TEN VAD) | 390 | 533 | 881 | 1088 | 336 |
| Whisper Self-Hosted (TEN VAD drops audio) | 395 | 538 | 896 | 1062 | 336 |
| OpenAI GPT-Realtime-Whisper | 735 | 832 | 1185 | 1312 | 336 |
| OpenAI Whisper-1 | 1850 | 4105 | 0 | 0 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Large V3 | 13 (en-dictation-whisper, en-dictation-whisper, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, nonspeech, ar-ae) | 0 |
| OpenAI Whisper-1 (split at pauses) | 0 | 0 |
| Whisper Self-Hosted | 0 | 0 |
| Whisper Self-Hosted (VAD drops audio) | 0 | 0 |
| Whisper Self-Hosted (TEN VAD) | 0 | 0 |
| Whisper Self-Hosted (TEN VAD drops audio) | 0 | 0 |
| OpenAI GPT-Realtime-Whisper | 0 | 0 |
| OpenAI Whisper-1 | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | OpenAI Whisper-1 | OpenAI Whisper-1 (split at pauses) | +1.1% [0.5%–1.7%] | <0.001 |
| en-dictation | OpenAI Whisper-1 | Whisper Self-Hosted (TEN VAD drops audio) | +1.7% [1.0%–2.4%] | <0.001 |
| en-dictation | OpenAI Whisper-1 | Whisper Self-Hosted (TEN VAD) | +2.3% [1.0%–3.8%] | <0.001 |
| en-dictation | OpenAI Whisper-1 | Whisper Self-Hosted (VAD drops audio) | +2.6% [1.5%–3.8%] | <0.001 |
| en-dictation | OpenAI Whisper-1 | OpenAI GPT-Realtime-Whisper | +2.7% [1.7%–3.8%] | <0.001 |
| en-dictation | OpenAI Whisper-1 | Whisper Self-Hosted | +2.8% [1.6%–4.3%] | <0.001 |
| en-dictation | OpenAI Whisper-1 | Whisper Large V3 | +3.2% [1.8%–4.7%] | <0.001 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +0.7% [-1.6%–2.9%] | 0.614 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +0.7% [-1.3%–2.6%] | 0.556 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +1.3% [-1.4%–4.4%] | 0.412 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +1.3% [-1.1%–3.9%] | 0.344 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +1.7% [-0.9%–4.5%] | 0.244 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +1.9% [-0.9%–5.1%] | 0.209 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +2.4% [-0.3%–4.9%] | 0.084 |
| en-dictation-whisper | OpenAI Whisper-1 | OpenAI GPT-Realtime-Whisper | +1.2% [-1.3%–4.0%] | 0.337 |
| en-dictation-whisper | OpenAI Whisper-1 | Whisper Self-Hosted | +2.4% [-0.5%–5.6%] | 0.139 |
| en-dictation-whisper | OpenAI Whisper-1 | Whisper Self-Hosted (TEN VAD) | +2.5% [1.1%–3.3%] | 0.005 |
| en-dictation-whisper | OpenAI Whisper-1 | Whisper Self-Hosted (TEN VAD drops audio) | +3.0% [1.3%–4.3%] | 0.004 |
| en-dictation-whisper | OpenAI Whisper-1 | OpenAI Whisper-1 (split at pauses) | +15.7% [2.9%–36.7%] | 0.002 |
| en-dictation-whisper | OpenAI Whisper-1 | Whisper Self-Hosted (VAD drops audio) | +43.7% [28.3%–68.2%] | <0.001 |
| en-dictation-whisper | OpenAI Whisper-1 | Whisper Large V3 | +73.0% [60.5%–82.2%] | <0.001 |
| ar-eg | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +2.0% [-1.6%–6.7%] | 0.401 |
| ar-eg | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +2.0% [-2.0%–6.9%] | 0.426 |
| ar-eg | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +2.0% [-1.6%–6.7%] | 0.401 |
| ar-eg | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +2.0% [-2.0%–6.9%] | 0.426 |
| ar-eg | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +3.1% [-1.6%–8.3%] | 0.275 |
| ar-eg | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +5.1% [1.0%–9.4%] | 0.029 |
| ar-eg | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +5.1% [1.0%–9.4%] | 0.029 |
| ar-sa | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +8.2% [1.9%–15.9%] | 0.007 |
| ar-sa | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +8.2% [1.9%–15.9%] | 0.007 |
| ar-sa | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +8.2% [0.7%–17.1%] | 0.031 |
| ar-sa | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +8.6% [1.9%–14.8%] | 0.021 |
| ar-sa | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +9.0% [3.7%–14.9%] | <0.001 |
| ar-sa | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +9.4% [2.7%–15.5%] | 0.005 |
| ar-sa | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +11.7% [3.1%–21.8%] | 0.009 |
| ar-ae | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +2.4% [-6.7%–12.8%] | 0.650 |
| ar-ae | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +3.5% [-5.5%–13.9%] | 0.479 |
| ar-ae | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +4.1% [-5.1%–14.4%] | 0.412 |
| ar-ae | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +4.7% [-4.7%–15.6%] | 0.388 |
| ar-ae | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +5.9% [-4.0%–17.9%] | 0.306 |
| ar-ae | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +6.5% [-3.2%–18.0%] | 0.231 |
| ar-ae | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +7.1% [-1.8%–17.8%] | 0.157 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +2.8% [0.8%–5.4%] | 0.005 |
| de-de | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +3.2% [0.8%–6.1%] | 0.009 |
| de-de | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +3.2% [0.8%–6.1%] | 0.009 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +3.6% [1.2%–6.3%] | 0.002 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +3.6% [1.2%–6.3%] | 0.002 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +3.6% [1.2%–6.3%] | 0.002 |
| de-de | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +3.6% [1.2%–6.3%] | 0.002 |
| es-419 | Whisper Large V3 | OpenAI GPT-Realtime-Whisper | +0.0% [-1.3%–1.3%] | 1.000 |
| es-419 | Whisper Large V3 | Whisper Self-Hosted (VAD drops audio) | +0.4% [0.0%–1.4%] | 0.712 |
| es-419 | Whisper Large V3 | Whisper Self-Hosted (TEN VAD drops audio) | +0.4% [0.0%–1.4%] | 0.712 |
| es-419 | Whisper Large V3 | Whisper Self-Hosted | +1.7% [0.0%–3.6%] | 0.127 |
| es-419 | Whisper Large V3 | Whisper Self-Hosted (TEN VAD) | +1.7% [0.0%–3.6%] | 0.127 |
| es-419 | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | +2.6% [0.0%–5.9%] | 0.098 |
| es-419 | Whisper Large V3 | OpenAI Whisper-1 | +2.6% [0.0%–5.9%] | 0.098 |
| es-es | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +0.5% [0.0%–1.7%] | 0.681 |
| es-es | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +0.5% [0.0%–1.7%] | 0.681 |
| es-es | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +2.1% [0.0%–5.8%] | 0.228 |
| es-es | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +6.3% [0.0%–17.2%] | 0.074 |
| es-es | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +6.8% [0.5%–17.8%] | 0.023 |
| es-es | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +11.6% [1.0%–26.0%] | 0.005 |
| es-es | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +11.6% [1.0%–26.0%] | 0.005 |
| es-pr | Whisper Large V3 | Whisper Self-Hosted (VAD drops audio) | +0.0% [0.0%–0.0%] | 1.000 |
| es-pr | Whisper Large V3 | Whisper Self-Hosted (TEN VAD drops audio) | +0.0% [0.0%–0.0%] | 1.000 |
| es-pr | Whisper Large V3 | Whisper Self-Hosted | +1.0% [0.0%–2.5%] | 0.251 |
| es-pr | Whisper Large V3 | Whisper Self-Hosted (TEN VAD) | +1.0% [0.0%–2.5%] | 0.251 |
| es-pr | Whisper Large V3 | OpenAI GPT-Realtime-Whisper | +2.6% [0.0%–6.1%] | 0.077 |
| es-pr | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | +3.1% [0.0%–9.7%] | 0.712 |
| es-pr | Whisper Large V3 | OpenAI Whisper-1 | +3.1% [0.0%–9.7%] | 0.712 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI Whisper-1 (split at pauses) | +1.4% [-1.4%–4.9%] | 0.408 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted | +1.4% [-1.7%–5.4%] | 0.472 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +1.4% [-1.7%–5.4%] | 0.472 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI Whisper-1 | +1.4% [-1.4%–4.9%] | 0.408 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (VAD drops audio) | +1.8% [-1.3%–5.3%] | 0.347 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Large V3 | +2.2% [-0.4%–5.4%] | 0.171 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | +2.2% [-2.8%–7.4%] | 0.418 |
| hi-in | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +17.5% [10.4%–25.4%] | <0.001 |
| hi-in | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +18.0% [11.6%–25.1%] | <0.001 |
| hi-in | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +18.0% [11.6%–25.1%] | <0.001 |
| hi-in | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +19.7% [13.0%–26.9%] | <0.001 |
| hi-in | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +21.1% [13.1%–29.2%] | <0.001 |
| hi-in | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +24.1% [17.0%–32.6%] | <0.001 |
| hi-in | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +24.1% [17.0%–32.6%] | <0.001 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Large V3 | +6.0% [0.0%–12.4%] | 0.060 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (VAD drops audio) | +6.0% [-0.3%–12.3%] | 0.056 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD drops audio) | +7.0% [0.7%–13.5%] | 0.032 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted | +7.4% [1.3%–13.4%] | 0.024 |
| ur-pk | OpenAI GPT-Realtime-Whisper | Whisper Self-Hosted (TEN VAD) | +7.4% [1.3%–13.4%] | 0.024 |
| ur-pk | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +8.5% [2.9%–13.8%] | 0.003 |
| ur-pk | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +8.8% [3.2%–14.2%] | 0.002 |
| zh-cn | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | +0.0% [0.0%–0.0%] | 1.000 |
| zh-cn | Whisper Self-Hosted | Whisper Self-Hosted (TEN VAD) | +0.0% [0.0%–0.0%] | 1.000 |
| zh-cn | Whisper Self-Hosted | Whisper Self-Hosted (TEN VAD drops audio) | +0.0% [0.0%–0.0%] | 1.000 |
| zh-cn | Whisper Self-Hosted | Whisper Large V3 | +0.5% [0.0%–1.7%] | 0.729 |
| zh-cn | Whisper Self-Hosted | OpenAI Whisper-1 | +1.1% [-0.3%–2.8%] | 0.234 |
| zh-cn | Whisper Self-Hosted | OpenAI Whisper-1 (split at pauses) | +1.4% [-0.3%–3.1%] | 0.128 |
| zh-cn | Whisper Self-Hosted | OpenAI GPT-Realtime-Whisper | +2.7% [1.4%–4.1%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

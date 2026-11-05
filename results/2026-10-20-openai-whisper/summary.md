# ASR benchmark results — 2026-10-20 (openai-whisper)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI Whisper-1 (split at pauses) | whisper-1 |
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

| Set | OpenAI Whisper-1 (split at pauses) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|
| en-dictation | 6.7% [5.8%–7.7%] | 8.2% [7.0%–9.5%] | 5.5% [4.6%–6.4%] |
| en-dictation-noise | 6.3% [3.9%–9.5%] | 4.6% [3.2%–6.4%] | 5.3% [3.6%–7.4%] |
| en-dictation-whisper | 10.2% [7.7%–12.6%] | 8.9% [7.2%–11.0%] | 7.7% [5.7%–10.4%] |
| ar-eg | 12.2% [7.9%–17.2%] | 7.1% [3.6%–11.2%] | 12.2% [7.9%–17.2%] |
| ar-sa | 37.9% [27.5%–49.8%] | 28.9% [16.9%–42.6%] | 38.3% [27.8%–50.6%] |
| ar-ae | 60.6% [50.0%–72.0%] | 55.9% [43.9%–67.1%] | 60.6% [50.0%–72.0%] |
| de-de | 8.1% [4.1%–12.6%] | 3.2% [0.8%–6.0%] | 6.5% [3.1%–10.0%] |
| es-419 | 24.8% [14.0%–36.6%] | 3.9% [1.4%–7.0%] | 6.5% [2.9%–11.4%] |
| es-es | 8.4% [0.5%–20.9%] | 7.9% [0.5%–20.2%] | 8.4% [0.5%–20.9%] |
| es-pr | 15.2% [4.4%–25.9%] | 7.3% [2.3%–13.9%] | 7.9% [1.8%–15.6%] |
| fr-fr | 6.9% [2.8%–12.4%] | 7.2% [2.8%–13.0%] | 6.5% [2.4%–12.1%] |
| hi-in | 38.6% [27.4%–50.7%] | 11.8% [4.9%–20.4%] | 36.0% [26.2%–46.5%] |
| ur-pk | 21.1% [14.9%–27.0%] | 12.3% [9.0%–16.2%] | 21.1% [14.9%–27.0%] |
| zh-cn | 5.4% [3.0%–7.6%] | 6.8% [4.9%–8.6%] | 5.2% [2.8%–7.2%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI Whisper-1 (split at pauses) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|
| en-dictation | 13.6% | 11.9% | 10.1% |
| en-dictation-noise | 14.8% | 8.1% | 9.2% |
| en-dictation-whisper | 21.7% | 13.8% | 17.7% |
| ar-eg | 26.4% | 16.2% | 26.4% |
| ar-sa | 45.7% | 40.2% | 45.7% |
| ar-ae | 68.6% | 62.8% | 68.6% |
| de-de | 11.7% | 6.2% | 10.0% |
| es-419 | 29.5% | 10.9% | 14.2% |
| es-es | 16.2% | 12.5% | 16.2% |
| es-pr | 30.5% | 23.4% | 23.4% |
| fr-fr | 11.3% | 11.9% | 11.3% |
| hi-in | 29.9% | 13.5% | 27.9% |
| ur-pk | 26.6% | 13.3% | 26.6% |
| zh-cn | 11.5% | 8.5% | 11.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI Whisper-1 (split at pauses) | 5.7% | 1.5% | 2.6% |
| OpenAI GPT-Realtime-Whisper | 4.4% | 1.6% | 2.9% |
| OpenAI Whisper-1 | 5.4% | 1.4% | 1.2% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | OpenAI Whisper-1 (split at pauses) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|
| nonspeech | 100.0% (10/10) | 0.0% (0/10) | 100.0% (10/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI Whisper-1 (split at pauses) | 1565 | 2622 | 0 | 0 | 336 |
| OpenAI GPT-Realtime-Whisper | 735 | 832 | 1185 | 1312 | 336 |
| OpenAI Whisper-1 | 1850 | 4105 | 0 | 0 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI Whisper-1 (split at pauses) | 0 | 0 |
| OpenAI GPT-Realtime-Whisper | 0 | 0 |
| OpenAI Whisper-1 | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | OpenAI Whisper-1 | OpenAI Whisper-1 (split at pauses) | +1.2% [0.7%–2.0%] | <0.001 |
| en-dictation | OpenAI Whisper-1 | OpenAI GPT-Realtime-Whisper | +2.7% [1.7%–3.8%] | <0.001 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +0.7% [-1.3%–2.6%] | 0.556 |
| en-dictation-noise | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +1.7% [-0.9%–4.5%] | 0.244 |
| en-dictation-whisper | OpenAI Whisper-1 | OpenAI GPT-Realtime-Whisper | +1.2% [-1.3%–4.0%] | 0.337 |
| en-dictation-whisper | OpenAI Whisper-1 | OpenAI Whisper-1 (split at pauses) | +2.6% [0.3%–4.8%] | 0.030 |
| ar-eg | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +5.1% [1.0%–9.4%] | 0.029 |
| ar-eg | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +5.1% [1.0%–9.4%] | 0.029 |
| ar-sa | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +9.0% [2.2%–15.0%] | 0.011 |
| ar-sa | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +9.4% [2.7%–15.5%] | 0.005 |
| ar-ae | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +4.7% [-4.7%–15.6%] | 0.388 |
| ar-ae | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +4.7% [-4.7%–15.6%] | 0.388 |
| de-de | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +3.2% [0.8%–6.1%] | 0.009 |
| de-de | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +4.8% [1.6%–9.2%] | 0.002 |
| es-419 | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +2.6% [0.0%–6.1%] | 0.096 |
| es-419 | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +20.9% [9.3%–33.5%] | <0.001 |
| es-es | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +0.5% [0.0%–1.7%] | 0.681 |
| es-es | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +0.5% [0.0%–1.7%] | 0.681 |
| es-pr | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +0.5% [-2.2%–4.3%] | 0.954 |
| es-pr | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +7.9% [-1.1%–18.3%] | 0.104 |
| fr-fr | OpenAI Whisper-1 | OpenAI Whisper-1 (split at pauses) | +0.4% [0.0%–1.1%] | 0.728 |
| fr-fr | OpenAI Whisper-1 | OpenAI GPT-Realtime-Whisper | +0.7% [-3.5%–5.3%] | 0.819 |
| hi-in | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +24.1% [17.0%–32.6%] | <0.001 |
| hi-in | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +26.8% [18.1%–36.7%] | <0.001 |
| ur-pk | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 (split at pauses) | +8.8% [3.2%–14.2%] | 0.002 |
| ur-pk | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 | +8.8% [3.2%–14.2%] | 0.002 |
| zh-cn | OpenAI Whisper-1 | OpenAI Whisper-1 (split at pauses) | +0.3% [0.0%–0.8%] | 0.736 |
| zh-cn | OpenAI Whisper-1 | OpenAI GPT-Realtime-Whisper | +1.6% [0.3%–2.9%] | 0.032 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

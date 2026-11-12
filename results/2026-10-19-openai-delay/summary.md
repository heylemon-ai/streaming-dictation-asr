# ASR benchmark results — 2026-10-19 (openai-delay)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | gpt-live-transcribe |
| OpenAI GPT-Live-Transcribe (Minimal delay) | gpt-live-transcribe |

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

| Set | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) |
|---|---|---|
| en-dictation | 7.3% [6.3%–8.3%] | 9.1% [7.9%–10.2%] |
| en-dictation-noise | 3.6% [2.4%–4.8%] | 5.0% [3.4%–7.0%] |
| en-dictation-whisper | 8.8% [7.0%–10.4%] | 12.8% [9.4%–15.7%] |
| ar-eg | 6.6% [2.7%–10.9%] | 7.7% [3.8%–11.6%] |
| ar-sa | 27.7% [15.7%–41.5%] | 33.2% [21.6%–46.1%] |
| ar-ae | 51.8% [42.0%–62.6%] | 57.6% [46.4%–68.8%] |
| de-de | 4.4% [0.9%–8.0%] | 8.9% [3.7%–14.5%] |
| es-419 | 6.5% [3.3%–10.7%] | 8.3% [4.4%–13.1%] |
| es-es | 8.9% [1.5%–21.1%] | 12.1% [3.6%–24.7%] |
| es-pr | 5.8% [1.6%–10.9%] | 7.3% [3.0%–12.7%] |
| fr-fr | 9.4% [4.5%–15.0%] | 15.6% [9.8%–22.0%] |
| hi-in | 11.8% [4.5%–23.2%] | 18.9% [9.7%–30.7%] |
| ur-pk | 19.7% [11.8%–29.2%] | 18.3% [12.5%–23.2%] |
| zh-cn | 6.5% [4.2%–8.8%] | 9.8% [6.7%–13.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) |
|---|---|---|
| en-dictation | 11.2% | 13.3% |
| en-dictation-noise | 8.1% | 9.8% |
| en-dictation-whisper | 14.2% | 18.8% |
| ar-eg | 15.7% | 18.3% |
| ar-sa | 39.9% | 44.6% |
| ar-ae | 59.0% | 63.3% |
| de-de | 7.9% | 12.7% |
| es-419 | 15.3% | 17.5% |
| es-es | 13.0% | 18.1% |
| es-pr | 20.8% | 21.3% |
| fr-fr | 12.9% | 19.6% |
| hi-in | 15.8% | 18.5% |
| ur-pk | 22.7% | 18.5% |
| zh-cn | 8.3% | 12.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 4.5% | 1.6% | 2.3% |
| OpenAI GPT-Live-Transcribe (Minimal delay) | 5.9% | 1.9% | 2.9% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) |
|---|---|---|
| nonspeech | 0.0% (0/10) | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 760 | 858 | 1207 | 1374 | 336 |
| OpenAI GPT-Live-Transcribe (Minimal delay) | 740 | 846 | 1210 | 1322 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |
| OpenAI GPT-Live-Transcribe (Minimal delay) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.8% [1.2%–2.3%] | <0.001 |
| en-dictation-noise | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.4% [-0.1%–3.4%] | 0.084 |
| en-dictation-whisper | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +4.0% [1.4%–6.5%] | 0.004 |
| ar-eg | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.0% [0.0%–2.4%] | 0.253 |
| ar-sa | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +5.5% [1.4%–9.4%] | 0.012 |
| ar-ae | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +5.9% [0.7%–11.6%] | 0.030 |
| de-de | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +4.4% [1.3%–8.1%] | 0.002 |
| es-419 | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.7% [-1.7%–5.4%] | 0.368 |
| es-es | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +3.2% [0.0%–7.0%] | 0.068 |
| es-pr | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.6% [-0.5%–3.7%] | 0.220 |
| fr-fr | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +6.2% [2.5%–10.3%] | <0.001 |
| hi-in | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +7.0% [3.8%–10.6%] | <0.001 |
| ur-pk | OpenAI GPT-Live-Transcribe (Minimal delay) | OpenAI GPT-Live-Transcribe (Low delay) | +1.4% [-7.3%–11.8%] | 0.899 |
| zh-cn | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +3.3% [1.1%–5.5%] | 0.002 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

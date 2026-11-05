# ASR benchmark results — 2026-11-05 (gptdelay)

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
| en-dictation | 7.4% [6.4%–8.4%] | 9.3% [8.2%–10.3%] |
| en-dictation-noise | 3.8% [2.4%–5.2%] | 5.6% [4.1%–7.2%] |
| en-dictation-whisper | 8.8% [7.2%–10.8%] | 13.6% [10.5%–16.5%] |
| ar-eg | 7.1% [3.0%–11.9%] | 8.2% [4.3%–12.5%] |
| ar-sa | 27.3% [16.4%–39.7%] | 32.8% [22.3%–43.9%] |
| ar-ae | 53.5% [43.8%–62.5%] | 57.1% [45.8%–67.1%] |
| de-de | 6.5% [2.0%–11.9%] | 7.7% [3.6%–11.7%] |
| es-419 | 6.5% [3.3%–10.7%] | 8.7% [4.4%–14.2%] |
| es-es | 8.4% [1.0%–20.6%] | 12.1% [3.6%–24.7%] |
| es-pr | 3.1% [0.5%–6.2%] | 6.8% [2.0%–13.3%] |
| fr-fr | 9.4% [5.2%–14.5%] | 14.5% [10.1%–19.0%] |
| hi-in | 14.0% [5.7%–25.3%] | 20.6% [10.9%–32.1%] |
| ur-pk | 21.5% [12.7%–32.6%] | 19.7% [14.2%–26.1%] |
| zh-cn | 7.6% [4.3%–11.7%] | 7.1% [4.4%–9.9%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) |
|---|---|---|
| en-dictation | 11.4% | 13.2% |
| en-dictation-noise | 8.3% | 9.3% |
| en-dictation-whisper | 14.7% | 19.9% |
| ar-eg | 16.2% | 18.3% |
| ar-sa | 39.9% | 43.5% |
| ar-ae | 62.8% | 61.7% |
| de-de | 10.3% | 10.7% |
| es-419 | 15.3% | 17.1% |
| es-es | 13.0% | 17.1% |
| es-pr | 18.3% | 21.3% |
| fr-fr | 12.9% | 18.6% |
| hi-in | 15.3% | 20.3% |
| ur-pk | 25.3% | 19.2% |
| zh-cn | 9.5% | 9.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 4.7% | 1.5% | 2.4% |
| OpenAI GPT-Live-Transcribe (Minimal delay) | 6.0% | 2.0% | 2.9% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) |
|---|---|---|
| nonspeech | 0.0% (0/10) | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 744 | 899 | 1200 | 1369 | 336 |
| OpenAI GPT-Live-Transcribe (Minimal delay) | 752 | 882 | 1207 | 1325 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |
| OpenAI GPT-Live-Transcribe (Minimal delay) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.8% [1.3%–2.4%] | <0.001 |
| en-dictation-noise | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.8% [0.3%–3.5%] | 0.015 |
| en-dictation-whisper | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +4.9% [2.2%–6.9%] | <0.001 |
| ar-eg | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.0% [-1.5%–3.5%] | 0.556 |
| ar-sa | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +5.5% [1.4%–10.6%] | 0.006 |
| ar-ae | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +3.5% [-1.9%–8.6%] | 0.238 |
| de-de | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +1.2% [-2.9%–4.8%] | 0.606 |
| es-419 | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +2.2% [-0.9%–5.9%] | 0.255 |
| es-es | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +3.7% [0.5%–7.5%] | 0.018 |
| es-pr | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +3.7% [0.0%–9.1%] | 0.078 |
| fr-fr | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +5.1% [1.8%–8.4%] | 0.001 |
| hi-in | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Live-Transcribe (Minimal delay) | +6.6% [3.3%–10.5%] | <0.001 |
| ur-pk | OpenAI GPT-Live-Transcribe (Minimal delay) | OpenAI GPT-Live-Transcribe (Low delay) | +1.8% [-8.4%–13.7%] | 0.851 |
| zh-cn | OpenAI GPT-Live-Transcribe (Minimal delay) | OpenAI GPT-Live-Transcribe (Low delay) | +0.5% [-1.6%–2.9%] | 0.746 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

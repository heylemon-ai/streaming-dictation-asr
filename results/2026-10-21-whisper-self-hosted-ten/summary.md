# ASR benchmark results — 2026-10-21 (whisper-self-hosted-ten)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Self-Hosted (TEN VAD) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN VAD drops audio) | self-hosted (Baseten) |

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

| Set | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) |
|---|---|---|
| en-dictation | 7.8% [6.2%–9.4%] | 7.2% [6.1%–8.3%] |
| en-dictation-noise | 5.9% [3.4%–9.2%] | 5.9% [3.9%–8.5%] |
| en-dictation-whisper | 10.2% [7.7%–12.3%] | 10.7% [8.0%–12.7%] |
| ar-eg | 9.2% [5.4%–13.7%] | 9.2% [5.4%–13.7%] |
| ar-sa | 37.1% [24.5%–51.8%] | 37.1% [24.0%–52.6%] |
| ar-ae | 59.4% [48.7%–70.8%] | 58.2% [48.1%–69.6%] |
| de-de | 6.9% [3.2%–10.8%] | 6.9% [3.2%–10.8%] |
| es-419 | 5.7% [2.8%–9.1%] | 4.3% [1.3%–8.2%] |
| es-es | 19.5% [3.6%–36.9%] | 14.7% [1.6%–31.0%] |
| es-pr | 5.8% [1.7%–11.2%] | 4.7% [1.0%–9.9%] |
| fr-fr | 6.5% [2.8%–11.2%] | 5.1% [1.4%–9.9%] |
| hi-in | 29.8% [21.3%–39.2%] | 31.6% [21.9%–42.2%] |
| ur-pk | 19.7% [13.4%–26.1%] | 19.4% [12.9%–26.0%] |
| zh-cn | 4.1% [2.2%–6.0%] | 4.1% [2.2%–6.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) |
|---|---|---|
| en-dictation | 15.3% | 15.5% |
| en-dictation-noise | 13.8% | 13.1% |
| en-dictation-whisper | 18.3% | 19.4% |
| ar-eg | 27.2% | 27.7% |
| ar-sa | 44.9% | 45.7% |
| ar-ae | 65.4% | 64.4% |
| de-de | 10.3% | 9.6% |
| es-419 | 14.5% | 12.7% |
| es-es | 31.9% | 27.8% |
| es-pr | 20.8% | 19.3% |
| fr-fr | 10.0% | 8.0% |
| hi-in | 25.3% | 28.3% |
| ur-pk | 26.0% | 25.3% |
| zh-cn | 12.0% | 12.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Self-Hosted (TEN VAD) | 5.2% | 2.5% | 2.0% |
| Whisper Self-Hosted (TEN VAD drops audio) | 5.1% | 2.1% | 2.0% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) |
|---|---|---|
| nonspeech | 60.0% (6/10) | 20.0% (2/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Self-Hosted (TEN VAD) | 390 | 533 | 881 | 1088 | 336 |
| Whisper Self-Hosted (TEN VAD drops audio) | 395 | 538 | 896 | 1062 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Self-Hosted (TEN VAD) | 0 | 0 |
| Whisper Self-Hosted (TEN VAD drops audio) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +0.6% [-0.5%–2.0%] | 0.403 |
| en-dictation-noise | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +0.0% [-1.0%–0.8%] | 1.000 |
| en-dictation-whisper | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +0.5% [-0.5%–1.7%] | 0.404 |
| ar-eg | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +0.0% [-1.5%–1.5%] | 1.000 |
| ar-sa | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +0.0% [-2.3%–2.6%] | 1.000 |
| ar-ae | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +1.2% [0.0%–3.0%] | 0.239 |
| de-de | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +0.0% [0.0%–0.0%] | 1.000 |
| es-419 | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +1.3% [-0.5%–3.0%] | 0.260 |
| es-es | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +4.7% [0.0%–14.9%] | 0.704 |
| es-pr | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +1.0% [0.0%–2.5%] | 0.251 |
| fr-fr | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +1.4% [-1.7%–5.4%] | 0.472 |
| hi-in | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +1.8% [-1.8%–5.4%] | 0.426 |
| ur-pk | Whisper Self-Hosted (TEN VAD drops audio) | Whisper Self-Hosted (TEN VAD) | +0.4% [-1.2%–1.8%] | 0.855 |
| zh-cn | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +0.0% [0.0%–0.0%] | 1.000 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

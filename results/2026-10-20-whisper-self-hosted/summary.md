# ASR benchmark results — 2026-10-20 (whisper-self-hosted)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Self-Hosted | self-hosted (Baseten) |

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

| Set | Whisper Self-Hosted |
|---|---|
| en-dictation | 8.3% [6.8%–9.8%] |
| en-dictation-noise | 6.5% [4.1%–10.0%] |
| en-dictation-whisper | 10.1% [7.1%–13.0%] |
| ar-eg | 9.2% [5.4%–13.7%] |
| ar-sa | 37.1% [24.5%–51.8%] |
| ar-ae | 60.0% [49.7%–71.1%] |
| de-de | 6.9% [3.2%–10.8%] |
| es-419 | 5.7% [2.8%–9.1%] |
| es-es | 19.5% [3.6%–36.9%] |
| es-pr | 5.8% [1.7%–11.2%] |
| fr-fr | 6.5% [2.8%–11.2%] |
| hi-in | 29.8% [21.3%–39.2%] |
| ur-pk | 19.7% [13.4%–26.1%] |
| zh-cn | 4.1% [2.2%–6.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Self-Hosted |
|---|---|
| en-dictation | 16.0% |
| en-dictation-noise | 14.3% |
| en-dictation-whisper | 20.8% |
| ar-eg | 27.7% |
| ar-sa | 44.9% |
| ar-ae | 66.0% |
| de-de | 10.0% |
| es-419 | 15.3% |
| es-es | 31.9% |
| es-pr | 20.8% |
| fr-fr | 10.0% |
| hi-in | 25.3% |
| ur-pk | 26.0% |
| zh-cn | 12.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Self-Hosted | 5.4% | 2.3% | 2.3% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Whisper Self-Hosted |
|---|---|
| nonspeech | 60.0% (6/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Self-Hosted | 361 | 498 | 837 | 940 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Self-Hosted | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

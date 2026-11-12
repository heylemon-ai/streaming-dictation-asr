# ASR benchmark results — 2026-10-21 (whisper-self-hosted-vad)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Self-Hosted (VAD drops audio) | self-hosted (Baseten) |

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

| Set | Whisper Self-Hosted (VAD drops audio) |
|---|---|
| en-dictation | 8.0% [6.7%–9.6%] |
| en-dictation-noise | 5.3% [3.5%–7.4%] |
| en-dictation-whisper | 51.4% [36.3%–75.4%] |
| ar-eg | 9.2% [5.4%–13.7%] |
| ar-sa | 40.6% [28.3%–54.6%] |
| ar-ae | 62.4% [51.9%–73.9%] |
| de-de | 6.9% [3.2%–10.8%] |
| es-419 | 4.3% [1.3%–8.2%] |
| es-es | 14.2% [1.1%–30.7%] |
| es-pr | 4.7% [1.0%–9.9%] |
| fr-fr | 6.9% [2.4%–12.4%] |
| hi-in | 32.9% [22.3%–43.8%] |
| ur-pk | 18.3% [12.0%–24.9%] |
| zh-cn | 4.1% [2.2%–6.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Self-Hosted (VAD drops audio) |
|---|---|
| en-dictation | 16.0% |
| en-dictation-noise | 12.8% |
| en-dictation-whisper | 56.9% |
| ar-eg | 27.7% |
| ar-sa | 47.1% |
| ar-ae | 67.6% |
| de-de | 10.0% |
| es-419 | 14.2% |
| es-es | 20.8% |
| es-pr | 20.3% |
| fr-fr | 10.3% |
| hi-in | 28.3% |
| ur-pk | 24.7% |
| zh-cn | 12.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Self-Hosted (VAD drops audio) | 5.2% | 6.6% | 2.0% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Whisper Self-Hosted (VAD drops audio) |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Self-Hosted (VAD drops audio) | 385 | 540 | 897 | 1102 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Self-Hosted (VAD drops audio) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

# ASR benchmark results — 2026-10-20 (openai-whisper-split)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI Whisper-1 (split at pauses) | whisper-1 |

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

| Set | OpenAI Whisper-1 (split at pauses) |
|---|---|
| en-dictation | 6.5% [5.6%–7.5%] |
| en-dictation-noise | 6.3% [3.9%–9.5%] |
| en-dictation-whisper | 23.4% [10.0%–44.5%] |
| ar-eg | 12.2% [7.9%–17.2%] |
| ar-sa | 37.5% [27.0%–49.4%] |
| ar-ae | 61.8% [51.1%–73.1%] |
| de-de | 6.5% [3.1%–10.0%] |
| es-419 | 6.5% [2.9%–11.4%] |
| es-es | 8.4% [0.5%–20.9%] |
| es-pr | 7.9% [1.8%–15.6%] |
| fr-fr | 6.5% [2.4%–12.1%] |
| hi-in | 36.0% [26.2%–46.5%] |
| ur-pk | 20.8% [14.5%–26.6%] |
| zh-cn | 5.4% [3.0%–7.6%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI Whisper-1 (split at pauses) |
|---|---|
| en-dictation | 13.4% |
| en-dictation-noise | 14.8% |
| en-dictation-whisper | 32.8% |
| ar-eg | 26.4% |
| ar-sa | 46.0% |
| ar-ae | 69.7% |
| de-de | 10.0% |
| es-419 | 14.2% |
| es-es | 16.2% |
| es-pr | 23.4% |
| fr-fr | 11.3% |
| hi-in | 27.9% |
| ur-pk | 26.3% |
| zh-cn | 11.5% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI Whisper-1 (split at pauses) | 5.6% | 2.8% | 1.9% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | OpenAI Whisper-1 (split at pauses) |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI Whisper-1 (split at pauses) | 1550 | 2314 | 0 | 0 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI Whisper-1 (split at pauses) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

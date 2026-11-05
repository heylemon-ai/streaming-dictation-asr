# ASR benchmark results — 2026-10-13 (qwen-no-vad)

Options: language=clip, speed=1, gate=false, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Qwen3-ASR | self-hosted (Baseten) |

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

| Set | Qwen3-ASR |
|---|---|
| en-dictation | 13.6% [10.9%–17.0%] |
| en-dictation-noise | 7.0% [5.3%–9.1%] |
| en-dictation-whisper | 46.6% [32.9%–67.5%] |
| ar-eg | 7.7% [2.7%–13.2%] |
| ar-sa | 39.1% [27.0%–51.9%] |
| ar-ae | 61.2% [51.4%–70.7%] |
| de-de | 4.4% [1.3%–8.0%] |
| es-419 | 7.4% [3.7%–12.6%] |
| es-es | 8.9% [1.1%–21.6%] |
| es-pr | 8.4% [3.2%–15.1%] |
| fr-fr | 7.2% [2.7%–12.9%] |
| hi-in | 18.4% [10.4%–28.4%] |
| ur-pk | 94.7% [86.9%–100.4%] |
| zh-cn | 3.5% [1.9%–5.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Qwen3-ASR |
|---|---|
| en-dictation | 21.6% |
| en-dictation-noise | 15.5% |
| en-dictation-whisper | 56.5% |
| ar-eg | 17.4% |
| ar-sa | 50.0% |
| ar-ae | 74.5% |
| de-de | 7.2% |
| es-419 | 16.0% |
| es-es | 13.0% |
| es-pr | 25.4% |
| fr-fr | 10.9% |
| hi-in | 16.4% |
| ur-pk | 154.9% |
| zh-cn | 5.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Qwen3-ASR | 8.6% | 5.3% | 4.4% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Qwen3-ASR |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Qwen3-ASR | 388 | 542 | 1592 | 4428 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Qwen3-ASR | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

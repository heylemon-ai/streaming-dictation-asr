# ASR benchmark results — 2026-10-29 (ttft-qwen)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Qwen3-ASR | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Qwen3-ASR |
|---|---|
| en-dictation | 13.6% [10.9%–17.0%] |
| en-dictation-noise | 7.0% [5.3%–9.1%] |
| en-dictation-whisper | 46.7% [32.9%–67.5%] |

## Formatted accuracy (case and punctuation counted)

| Set | Qwen3-ASR |
|---|---|
| en-dictation | 21.5% |
| en-dictation-noise | 15.5% |
| en-dictation-whisper | 56.6% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Qwen3-ASR | 5.7% | 6.0% | 5.3% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Qwen3-ASR | 359 | 611 | 1058 | 1618 | 106 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Qwen3-ASR | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

# ASR benchmark results — 2026-10-23 (ears-qwen)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Qwen3-ASR | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ears-whisper | en | whisper | 428 | 105.1 | 107 |
| ears-regular | en | clean | 428 | 99.4 | 107 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Qwen3-ASR |
|---|---|
| ears-whisper | 32.3% [26.4%–38.4%] |
| ears-regular | 1.3% [1.0%–1.6%] |

## Formatted accuracy (case and punctuation counted)

| Set | Qwen3-ASR |
|---|---|
| ears-whisper | 35.9% |
| ears-regular | 4.2% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Qwen3-ASR | 0.9% | 15.5% | 0.4% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Qwen3-ASR | 344 | 463 | 865 | 1321 | 856 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Qwen3-ASR | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

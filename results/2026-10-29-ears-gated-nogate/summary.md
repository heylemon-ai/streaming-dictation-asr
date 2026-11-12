# ASR benchmark results — 2026-10-29 (ears-gated-nogate)

Options: language=clip, speed=1, gate=false, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Large V3 | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ears-whisper | en | whisper | 428 | 105.1 | 107 |
| ears-regular | en | clean | 428 | 99.4 | 107 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Whisper Large V3 |
|---|---|
| ears-whisper | 32.9% [26.4%–39.7%] |
| ears-regular | 1.3% [1.0%–1.7%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Large V3 |
|---|---|
| ears-whisper | 36.1% |
| ears-regular | 5.1% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Large V3 | 1.1% | 15.5% | 0.5% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Large V3 | 416 | 748 | 908 | 1665 | 856 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Large V3 | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

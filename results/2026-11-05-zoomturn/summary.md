# ASR benchmark results — 2026-11-05 (zoomturn)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Zoom Scribe (long turns) | zoom-scribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Zoom Scribe (long turns) |
|---|---|
| en-dictation-whisper | 26.7% [13.0%–50.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Zoom Scribe (long turns) |
|---|---|
| en-dictation-whisper | 31.9% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Zoom Scribe (long turns) | 3.3% | 21.2% | 2.2% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Zoom Scribe (long turns) | 463 | 532 | 1533 | 1778 | 16 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Zoom Scribe (long turns) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

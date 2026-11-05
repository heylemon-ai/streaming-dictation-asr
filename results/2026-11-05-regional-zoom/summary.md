# ASR benchmark results — 2026-11-05 (regional-zoom)

Options: language=regional, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Zoom Scribe | zoom-scribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ar-ae | ar | clean | 20 | 1.0 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Zoom Scribe |
|---|---|
| ar-ae | 51.8% [41.5%–62.5%] |

## Formatted accuracy (case and punctuation counted)

| Set | Zoom Scribe |
|---|---|
| ar-ae | 67.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Zoom Scribe | 34.1% | 12.9% | 4.7% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Zoom Scribe | 366 | 387 | 1257 | 5284 | 20 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Zoom Scribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

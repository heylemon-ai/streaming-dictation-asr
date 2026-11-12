# ASR benchmark results — 2026-11-05 (regional-deepgram)

Options: language=regional, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Deepgram Nova-3 | nova-3 |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ar-eg | ar | clean | 20 | 1.7 | not labelled |
| ar-sa | ar | clean | 20 | 1.8 | not labelled |
| ar-ae | ar | clean | 20 | 1.0 | not labelled |
| es-419 | es | clean | 20 | 2.0 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Deepgram Nova-3 |
|---|---|
| ar-eg | 11.2% [6.3%–16.2%] |
| ar-sa | 38.3% [28.4%–49.5%] |
| ar-ae | 57.1% [47.4%–66.7%] |
| es-419 | 7.8% [3.1%–14.2%] |

## Formatted accuracy (case and punctuation counted)

| Set | Deepgram Nova-3 |
|---|---|
| ar-eg | 36.6% |
| ar-sa | 57.2% |
| ar-ae | 63.8% |
| es-419 | 16.4% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Deepgram Nova-3 | 15.7% | 11.0% | 0.8% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Deepgram Nova-3 | 436 | 1368 | 776 | 1034 | 80 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Deepgram Nova-3 | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

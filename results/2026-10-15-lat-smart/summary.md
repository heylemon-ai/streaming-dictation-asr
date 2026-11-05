# ASR benchmark results — 2026-10-15 (lat-smart)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Gemini 3.5 Transcribe (Smart) | gemini-3.5-transcribe-live |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 50 | 47.3 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Gemini 3.5 Transcribe (Smart) |
|---|---|
| en-dictation | 4.3% [3.6%–5.3%] |

## Formatted accuracy (case and punctuation counted)

| Set | Gemini 3.5 Transcribe (Smart) |
|---|---|
| en-dictation | 10.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Gemini 3.5 Transcribe (Smart) | 2.1% | 1.5% | 0.8% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Gemini 3.5 Transcribe (Smart) | 739 | 1094 | 713 | 969 | 50 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Gemini 3.5 Transcribe (Smart) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

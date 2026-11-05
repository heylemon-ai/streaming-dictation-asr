# ASR benchmark results — 2026-11-05 (regional-gemini)

Options: language=regional, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Gemini 3.5 Transcribe | gemini-3.5-transcribe-live |
| Gemini 3.5 Transcribe (Smart) | gemini-3.5-transcribe-live |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| es-419 | es | clean | 20 | 2.0 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) |
|---|---|---|
| es-419 | 6.5% [3.1%–11.2%] | 5.7% [2.5%–9.9%] |

## Formatted accuracy (case and punctuation counted)

| Set | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) |
|---|---|---|
| es-419 | 13.8% | 12.7% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Gemini 3.5 Transcribe | 4.8% | 0.4% | 1.3% |
| Gemini 3.5 Transcribe (Smart) | 4.3% | 0.4% | 0.9% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Gemini 3.5 Transcribe | 431 | 562 | 717 | 990 | 20 |
| Gemini 3.5 Transcribe (Smart) | 425 | 504 | 694 | 764 | 20 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Gemini 3.5 Transcribe | 0 | 0 |
| Gemini 3.5 Transcribe (Smart) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| es-419 | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +0.9% [0.0%–2.9%] | 0.749 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

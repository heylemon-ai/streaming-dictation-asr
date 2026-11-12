# ASR benchmark results — 2026-10-19 (oadelay--low)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | gpt-live-transcribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 50 | 47.3 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | OpenAI GPT-Live-Transcribe (Low delay) |
|---|---|
| en-dictation | 7.7% [6.5%–8.9%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI GPT-Live-Transcribe (Low delay) |
|---|---|
| en-dictation | 11.9% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 3.2% | 1.2% | 3.3% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 751 | 895 | 1307 | 1416 | 50 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

# ASR benchmark results — 2026-10-19 (oadelay--minimal)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI GPT-Live-Transcribe (Minimal delay) | gpt-live-transcribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 50 | 47.3 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | OpenAI GPT-Live-Transcribe (Minimal delay) |
|---|---|
| en-dictation | 9.4% [8.2%–10.6%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI GPT-Live-Transcribe (Minimal delay) |
|---|---|
| en-dictation | 13.6% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Minimal delay) | 4.0% | 1.5% | 3.9% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Minimal delay) | 759 | 890 | 1280 | 1494 | 50 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI GPT-Live-Transcribe (Minimal delay) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

# ASR benchmark results — 2026-11-05 (gptlow-ears)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | gpt-live-transcribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ears-whisper | en | whisper | 428 | 105.1 | 107 |
| ears-regular | en | clean | 428 | 99.4 | 107 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | OpenAI GPT-Live-Transcribe (Low delay) |
|---|---|
| ears-whisper | 2.5% [2.1%–3.0%] |
| ears-regular | 1.5% [1.1%–1.9%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI GPT-Live-Transcribe (Low delay) |
|---|---|
| ears-whisper | 6.0% |
| ears-regular | 4.2% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 1.1% | 0.4% | 0.4% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 795 | 899 | 1210 | 1350 | 856 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

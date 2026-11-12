# ASR benchmark results — 2026-11-05 (gptlow-voices)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | gpt-live-transcribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| voices-clean | en | clean | 100 | 26.0 | 100 |
| voices-far | en | far | 100 | 26.0 | 100 |
| voices-far-babble | en | far+babble | 100 | 26.0 | 100 |
| voices-far-tv | en | far+tv | 100 | 26.0 | 100 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | OpenAI GPT-Live-Transcribe (Low delay) |
|---|---|
| voices-clean | 4.1% [3.2%–5.1%] |
| voices-far | 8.8% [7.2%–10.5%] |
| voices-far-babble | 84.5% [79.7%–89.0%] |
| voices-far-tv | 29.9% [24.8%–35.2%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI GPT-Live-Transcribe (Low delay) |
|---|---|
| voices-clean | 24.8% |
| voices-far | 27.9% |
| voices-far-babble | 86.9% |
| voices-far-tv | 42.8% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 7.1% | 24.2% | 0.5% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 794 | 913 | 1207 | 1352 | 400 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

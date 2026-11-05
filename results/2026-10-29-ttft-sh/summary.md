# ASR benchmark results — 2026-10-29 (ttft-sh)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Self-Hosted | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Whisper Self-Hosted |
|---|---|
| en-dictation | 8.3% [6.9%–9.8%] |
| en-dictation-noise | 6.5% [4.1%–10.0%] |
| en-dictation-whisper | 10.1% [7.1%–13.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Self-Hosted |
|---|---|
| en-dictation | 16.0% |
| en-dictation-noise | 14.3% |
| en-dictation-whisper | 20.8% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Self-Hosted | 3.6% | 2.1% | 2.7% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Self-Hosted | 400 | 798 | 1085 | 2651 | 106 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Self-Hosted | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

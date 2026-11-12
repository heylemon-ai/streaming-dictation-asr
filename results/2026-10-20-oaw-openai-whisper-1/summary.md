# ASR benchmark results — 2026-10-20 (oaw-openai-whisper-1)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI Whisper-1 | whisper-1 |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 50 | 47.3 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | OpenAI Whisper-1 |
|---|---|
| en-dictation | 6.2% [5.1%–7.3%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI Whisper-1 |
|---|---|
| en-dictation | 11.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI Whisper-1 | 3.5% | 1.4% | 1.3% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI Whisper-1 | 3797 | 6393 | 0 | 0 | 50 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI Whisper-1 | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

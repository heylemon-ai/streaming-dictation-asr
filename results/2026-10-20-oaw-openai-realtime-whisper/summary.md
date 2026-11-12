# ASR benchmark results — 2026-10-20 (oaw-openai-realtime-whisper)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| OpenAI GPT-Realtime-Whisper | gpt-realtime-whisper |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 50 | 47.3 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | OpenAI GPT-Realtime-Whisper |
|---|---|
| en-dictation | 8.6% [7.3%–9.8%] |

## Formatted accuracy (case and punctuation counted)

| Set | OpenAI GPT-Realtime-Whisper |
|---|---|
| en-dictation | 12.7% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| OpenAI GPT-Realtime-Whisper | 3.2% | 1.3% | 4.1% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| OpenAI GPT-Realtime-Whisper | 775 | 876 | 1502 | 1774 | 50 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| OpenAI GPT-Realtime-Whisper | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

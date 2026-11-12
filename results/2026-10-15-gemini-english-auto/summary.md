# ASR benchmark results — 2026-10-15 (gemini-english-auto)

Options: language=auto, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Gemini 3.5 Transcribe | gemini-3.5-transcribe-live |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Gemini 3.5 Transcribe |
|---|---|
| en-dictation | 6.4% [5.3%–7.5%] |
| en-dictation-noise | 3.1% [2.0%–4.4%] |
| en-dictation-whisper | 4.7% [2.7%–6.2%] |

## Formatted accuracy (case and punctuation counted)

| Set | Gemini 3.5 Transcribe |
|---|---|
| en-dictation | 8.7% |
| en-dictation-noise | 6.4% |
| en-dictation-whisper | 8.8% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Gemini 3.5 Transcribe | 2.1% | 1.0% | 2.8% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Gemini 3.5 Transcribe | 628 | 1026 | 726 | 851 | 106 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Gemini 3.5 Transcribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

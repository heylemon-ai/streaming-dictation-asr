# ASR benchmark results — 2026-10-29 (ttft-meta)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Meta Muse | muse-voice-transcribe-1.0 |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Meta Muse |
|---|---|
| en-dictation | 10.3% [9.0%–11.5%] |
| en-dictation-noise | 7.2% [5.2%–9.3%] |
| en-dictation-whisper | 11.2% [8.7%–14.4%] |

## Formatted accuracy (case and punctuation counted)

| Set | Meta Muse |
|---|---|
| en-dictation | 19.1% |
| en-dictation-noise | 15.3% |
| en-dictation-whisper | 21.7% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Meta Muse | 4.3% | 1.0% | 4.8% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Meta Muse | 430 | 694 | 2246 | 3087 | 106 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Meta Muse | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

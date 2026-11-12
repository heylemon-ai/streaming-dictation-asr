# ASR benchmark results — 2026-10-21 (rime)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Rime STT | rime-stt |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |
| nonspeech | en | nonspeech | 10 | 1.8 | not labelled |
| es-419 | es | clean | 20 | 2.0 | not labelled |
| es-es | es | clean | 20 | 1.1 | 20 |
| es-pr | es | clean | 20 | 1.7 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Rime STT |
|---|---|
| en-dictation | 11.9% [10.1%–13.7%] |
| en-dictation-noise | 11.7% [9.0%–14.8%] |
| en-dictation-whisper | 19.1% [13.9%–23.9%] |
| es-419 | 7.4% [4.0%–11.7%] |
| es-es | 8.9% [1.1%–21.4%] |
| es-pr | 5.2% [2.1%–8.8%] |

## Formatted accuracy (case and punctuation counted)

| Set | Rime STT |
|---|---|
| en-dictation | 18.7% |
| en-dictation-noise | 18.8% |
| en-dictation-whisper | 26.5% |
| es-419 | 14.9% |
| es-es | 13.9% |
| es-pr | 19.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Rime STT | 6.2% | 1.0% | 5.1% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Rime STT |
|---|---|
| nonspeech | 50.0% (5/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Rime STT | 473 | 644 | 1037 | 1185 | 172 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Rime STT | 0 | 4 (en-dictation, en-dictation, en-dictation, en-dictation-whisper) |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

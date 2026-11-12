# ASR benchmark results — 2026-11-05 (aainoturn)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| AssemblyAI Universal-3.5 Pro (turn detection off) | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro (turn detection off) | universal-3-6-pro |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | AssemblyAI Universal-3.5 Pro (turn detection off) | AssemblyAI Universal-3.6 Pro (turn detection off) |
|---|---|---|
| en-dictation-whisper | 28.7% [12.8%–52.9%] | 27.2% [12.0%–51.8%] |

## Formatted accuracy (case and punctuation counted)

| Set | AssemblyAI Universal-3.5 Pro (turn detection off) | AssemblyAI Universal-3.6 Pro (turn detection off) |
|---|---|---|
| en-dictation-whisper | 33.9% | 32.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| AssemblyAI Universal-3.5 Pro (turn detection off) | 2.9% | 23.6% | 2.1% |
| AssemblyAI Universal-3.6 Pro (turn detection off) | 3.0% | 22.7% | 1.5% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| AssemblyAI Universal-3.5 Pro (turn detection off) | 926 | 1730 | 2398 | 3169 | 15 |
| AssemblyAI Universal-3.6 Pro (turn detection off) | 674 | 1201 | 1330 | 2199 | 16 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| AssemblyAI Universal-3.5 Pro (turn detection off) | 0 | 1 (en-dictation-whisper) |
| AssemblyAI Universal-3.6 Pro (turn detection off) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation-whisper | AssemblyAI Universal-3.6 Pro (turn detection off) | AssemblyAI Universal-3.5 Pro (turn detection off) | +1.0% [0.1%–1.8%] | 0.035 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

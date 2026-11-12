# ASR benchmark results — 2026-10-29 (ttft-aai)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| AssemblyAI Universal-3.5 Pro | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro | universal-3-6-pro |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro |
|---|---|---|
| en-dictation | 9.0% [7.9%–10.0%] | 8.2% [7.1%–9.1%] |
| en-dictation-noise | 4.8% [3.2%–6.6%] | 4.2% [2.9%–5.7%] |
| en-dictation-whisper | 31.2% [15.5%–56.0%] | 30.5% [14.5%–55.9%] |

## Formatted accuracy (case and punctuation counted)

| Set | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro |
|---|---|---|
| en-dictation | 14.9% | 13.0% |
| en-dictation-noise | 9.6% | 8.6% |
| en-dictation-whisper | 36.6% | 35.1% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 2.8% | 4.3% | 4.1% |
| AssemblyAI Universal-3.6 Pro | 2.8% | 4.2% | 3.5% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 792 | 1480 | 1542 | 2318 | 106 |
| AssemblyAI Universal-3.6 Pro | 833 | 1448 | 1485 | 2560 | 106 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| AssemblyAI Universal-3.5 Pro | 0 | 0 |
| AssemblyAI Universal-3.6 Pro | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +0.8% [0.3%–1.3%] | 0.001 |
| en-dictation-noise | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +0.7% [-0.5%–2.5%] | 0.516 |
| en-dictation-whisper | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +0.7% [-0.2%–1.5%] | 0.167 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

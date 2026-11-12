# ASR benchmark results — 2026-10-23 (ears-aai)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| AssemblyAI Universal-3.5 Pro | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro | universal-3-6-pro |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ears-whisper | en | whisper | 428 | 105.1 | 107 |
| ears-regular | en | clean | 428 | 99.4 | 107 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro |
|---|---|---|
| ears-whisper | 9.2% [6.5%–12.4%] | 9.0% [6.3%–12.2%] |
| ears-regular | 2.0% [1.7%–2.3%] | 2.0% [1.7%–2.4%] |

## Formatted accuracy (case and punctuation counted)

| Set | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro |
|---|---|---|
| ears-whisper | 11.9% | 11.6% |
| ears-regular | 4.9% | 4.7% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 1.3% | 3.9% | 0.4% |
| AssemblyAI Universal-3.6 Pro | 1.3% | 3.9% | 0.3% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 735 | 1175 | 1291 | 1781 | 856 |
| AssemblyAI Universal-3.6 Pro | 731 | 1234 | 1227 | 2275 | 856 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| AssemblyAI Universal-3.5 Pro | 0 | 0 |
| AssemblyAI Universal-3.6 Pro | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| ears-whisper | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +0.2% [-0.0%–0.4%] | 0.092 |
| ears-regular | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | +0.1% [-0.1%–0.4%] | 0.729 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

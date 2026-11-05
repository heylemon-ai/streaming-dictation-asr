# ASR benchmark results — 2026-11-05 (aaiflush-smoke)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| AssemblyAI Universal-3.5 Pro (flush at end) | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro (flush at end) | universal-3-6-pro |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | AssemblyAI Universal-3.5 Pro (flush at end) | AssemblyAI Universal-3.6 Pro (flush at end) |
|---|---|---|
| en-dictation-whisper | 31.2% [15.5%–56.0%] | 30.3% [14.4%–55.8%] |

## Formatted accuracy (case and punctuation counted)

| Set | AssemblyAI Universal-3.5 Pro (flush at end) | AssemblyAI Universal-3.6 Pro (flush at end) |
|---|---|---|
| en-dictation-whisper | 36.0% | 34.9% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| AssemblyAI Universal-3.5 Pro (flush at end) | 3.1% | 25.8% | 2.2% |
| AssemblyAI Universal-3.6 Pro (flush at end) | 3.3% | 25.6% | 1.5% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| AssemblyAI Universal-3.5 Pro (flush at end) | 609 | 1201 | 1202 | 1616 | 16 |
| AssemblyAI Universal-3.6 Pro (flush at end) | 606 | 1244 | 1216 | 1263 | 16 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| AssemblyAI Universal-3.5 Pro (flush at end) | 0 | 0 |
| AssemblyAI Universal-3.6 Pro (flush at end) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation-whisper | AssemblyAI Universal-3.6 Pro (flush at end) | AssemblyAI Universal-3.5 Pro (flush at end) | +0.9% [-0.1%–1.6%] | 0.107 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

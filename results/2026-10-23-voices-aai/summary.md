# ASR benchmark results — 2026-10-23 (voices-aai)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| AssemblyAI Universal-3.5 Pro | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro | universal-3-6-pro |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| voices-clean | en | clean | 100 | 26.0 | 100 |
| voices-far | en | far | 100 | 26.0 | 100 |
| voices-far-babble | en | far+babble | 100 | 26.0 | 100 |
| voices-far-tv | en | far+tv | 100 | 26.0 | 100 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro |
|---|---|---|
| voices-clean | 3.7% [2.7%–4.9%] | 3.9% [2.9%–5.1%] |
| voices-far | 6.5% [4.6%–8.8%] | 6.4% [4.5%–8.6%] |
| voices-far-babble | 53.3% [46.7%–59.6%] | 60.4% [53.3%–67.3%] |
| voices-far-tv | 13.7% [10.7%–17.0%] | 14.4% [11.3%–18.2%] |

## Formatted accuracy (case and punctuation counted)

| Set | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro |
|---|---|---|
| voices-clean | 26.9% | 26.6% |
| voices-far | 28.2% | 28.0% |
| voices-far-babble | 66.2% | 69.9% |
| voices-far-tv | 35.1% | 35.4% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 9.5% | 8.4% | 1.4% |
| AssemblyAI Universal-3.6 Pro | 7.1% | 13.3% | 0.9% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 821 | 1288 | 1209 | 1296 | 400 |
| AssemblyAI Universal-3.6 Pro | 891 | 1306 | 1223 | 1390 | 400 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| AssemblyAI Universal-3.5 Pro | 0 | 0 |
| AssemblyAI Universal-3.6 Pro | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| voices-clean | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | +0.2% [-0.1%–0.5%] | 0.351 |
| voices-far | AssemblyAI Universal-3.6 Pro | AssemblyAI Universal-3.5 Pro | +0.1% [-0.2%–0.5%] | 0.474 |
| voices-far-babble | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | +7.1% [4.4%–10.1%] | <0.001 |
| voices-far-tv | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | +0.7% [-0.8%–2.2%] | 0.373 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

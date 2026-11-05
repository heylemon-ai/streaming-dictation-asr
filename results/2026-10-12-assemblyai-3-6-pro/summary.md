# ASR benchmark results — 2026-10-12 (assemblyai-3-6-pro)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| AssemblyAI Universal-3.6 Pro | universal-3-6-pro |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |
| nonspeech | en | nonspeech | 10 | 1.8 | not labelled |
| ar-eg | ar | clean | 20 | 1.7 | not labelled |
| ar-sa | ar | clean | 20 | 1.8 | not labelled |
| ar-ae | ar | clean | 20 | 1.0 | not labelled |
| de-de | de | clean | 20 | 1.7 | not labelled |
| es-419 | es | clean | 20 | 2.0 | not labelled |
| es-es | es | clean | 20 | 1.1 | 20 |
| es-pr | es | clean | 20 | 1.7 | not labelled |
| fr-fr | fr | clean | 20 | 1.6 | not labelled |
| hi-in | hi | clean | 20 | 1.6 | not labelled |
| ur-pk | ur | clean | 20 | 1.6 | not labelled |
| zh-cn | zh | clean | 20 | 1.6 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | AssemblyAI Universal-3.6 Pro |
|---|---|
| en-dictation | 8.2% [7.2%–9.1%] |
| en-dictation-noise | 4.1% [2.7%–5.7%] |
| en-dictation-whisper | 30.5% [14.6%–55.8%] |
| ar-eg | 9.7% [4.4%–16.0%] |
| ar-sa | 33.6% [24.2%–43.7%] |
| ar-ae | 53.5% [43.5%–63.9%] |
| de-de | 4.8% [2.1%–7.6%] |
| es-419 | 2.2% [0.4%–4.6%] |
| es-es | 9.5% [1.6%–21.9%] |
| es-pr | 5.2% [2.0%–9.0%] |
| fr-fr | 2.9% [0.7%–5.8%] |
| hi-in | 9.2% [2.7%–19.0%] |
| ur-pk | 15.1% [9.2%–20.8%] |
| zh-cn | 2.7% [0.8%–4.7%] |

## Formatted accuracy (case and punctuation counted)

| Set | AssemblyAI Universal-3.6 Pro |
|---|---|
| en-dictation | 13.1% |
| en-dictation-noise | 8.8% |
| en-dictation-whisper | 35.1% |
| ar-eg | 19.6% |
| ar-sa | 42.8% |
| ar-ae | 60.1% |
| de-de | 7.6% |
| es-419 | 10.9% |
| es-es | 13.0% |
| es-pr | 20.3% |
| fr-fr | 6.1% |
| hi-in | 10.7% |
| ur-pk | 19.2% |
| zh-cn | 4.8% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| AssemblyAI Universal-3.6 Pro | 4.2% | 3.7% | 2.9% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | AssemblyAI Universal-3.6 Pro |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| AssemblyAI Universal-3.6 Pro | 722 | 1210 | 1227 | 1399 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| AssemblyAI Universal-3.6 Pro | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

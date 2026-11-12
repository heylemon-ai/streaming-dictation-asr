# ASR benchmark results — 2026-10-12 (assemblyai-3-5-pro)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| AssemblyAI Universal-3.5 Pro | universal-3-5-pro |

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

| Set | AssemblyAI Universal-3.5 Pro |
|---|---|
| en-dictation | 9.0% [7.9%–10.1%] |
| en-dictation-noise | 4.3% [2.8%–6.2%] |
| en-dictation-whisper | 30.9% [15.2%–55.9%] |
| ar-eg | 14.3% [8.5%–20.8%] |
| ar-sa | 34.8% [25.1%–45.0%] |
| ar-ae | 57.1% [47.0%–67.8%] |
| de-de | 6.0% [3.0%–8.8%] |
| es-419 | 5.2% [1.7%–9.9%] |
| es-es | 10.0% [2.1%–22.3%] |
| es-pr | 5.2% [2.0%–9.0%] |
| fr-fr | 4.0% [1.0%–7.6%] |
| hi-in | 25.9% [18.2%–34.2%] |
| ur-pk | 91.5% [76.4%–101.8%] * |
| zh-cn | 3.5% [1.8%–5.4%] |

\* No option for this language in the engine, so no language was sent and the engine auto-detected: AssemblyAI Universal-3.5 Pro on ur-pk. This is what a person choosing that language gets, not the engine's accuracy with the language set. Left out of paired comparisons.

## Formatted accuracy (case and punctuation counted)

| Set | AssemblyAI Universal-3.5 Pro |
|---|---|
| en-dictation | 14.9% |
| en-dictation-noise | 9.4% |
| en-dictation-whisper | 35.9% |
| ar-eg | 27.7% |
| ar-sa | 43.5% |
| ar-ae | 60.6% |
| de-de | 8.9% |
| es-419 | 12.4% |
| es-es | 14.4% |
| es-pr | 19.3% |
| fr-fr | 7.7% |
| hi-in | 23.5% |
| ur-pk | 148.1% * |
| zh-cn | 5.5% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 6.3% | 3.8% | 3.4% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | AssemblyAI Universal-3.5 Pro |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| AssemblyAI Universal-3.5 Pro | 727 | 1218 | 1228 | 1370 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| AssemblyAI Universal-3.5 Pro | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

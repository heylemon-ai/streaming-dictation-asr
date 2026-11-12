# ASR benchmark results — 2026-10-15 (gemini-smart)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Gemini 3.5 Transcribe (smart) | gemini-3.5-transcribe-live |

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

| Set | Gemini 3.5 Transcribe (smart) |
|---|---|
| en-dictation | 3.9% [3.2%–4.7%] |
| en-dictation-noise | 3.2% [2.1%–4.6%] |
| en-dictation-whisper | 4.2% [2.9%–5.7%] |
| ar-eg | 3.6% [1.0%–6.8%] |
| ar-sa | 35.2% [23.4%–48.5%] |
| ar-ae | 49.4% [39.6%–58.6%] |
| de-de | 4.8% [2.2%–7.4%] |
| es-419 | 5.7% [2.5%–9.9%] |
| es-es | 7.4% [0.0%–19.3%] |
| es-pr | 4.7% [1.1%–9.8%] |
| fr-fr | 6.9% [2.0%–13.7%] |
| hi-in | 2.6% [0.9%–4.9%] |
| ur-pk | 32.4% [18.1%–49.8%] * |
| zh-cn | 3.8% [1.6%–6.3%] |

\* No option for this language in the engine, so no language was sent and the engine auto-detected: Gemini 3.5 Transcribe (smart) on ur-pk. This is what a person choosing that language gets, not the engine's accuracy with the language set. Left out of paired comparisons.

## Formatted accuracy (case and punctuation counted)

| Set | Gemini 3.5 Transcribe (smart) |
|---|---|
| en-dictation | 8.8% |
| en-dictation-noise | 10.0% |
| en-dictation-whisper | 10.9% |
| ar-eg | 13.2% |
| ar-sa | 46.7% |
| ar-ae | 62.2% |
| de-de | 7.6% |
| es-419 | 12.0% |
| es-es | 12.5% |
| es-pr | 20.8% |
| fr-fr | 10.6% |
| hi-in | 4.8% |
| ur-pk | 44.8% * |
| zh-cn | 5.8% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Gemini 3.5 Transcribe (smart) | 3.4% | 1.7% | 0.6% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Gemini 3.5 Transcribe (smart) |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Gemini 3.5 Transcribe (smart) | 434 | 703 | 718 | 1201 | 326 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Gemini 3.5 Transcribe (smart) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

# ASR benchmark results — 2026-10-14 (zoom-scribe)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Zoom Scribe | zoom-scribe |

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

| Set | Zoom Scribe |
|---|---|
| en-dictation | 7.4% [6.5%–8.3%] |
| en-dictation-noise | 3.6% [2.2%–5.2%] |
| en-dictation-whisper | 34.7% [19.2%–60.2%] |
| ar-eg | 5.1% [1.6%–8.7%] |
| ar-sa | 29.7% [19.3%–41.3%] |
| ar-ae | 51.8% [41.5%–62.5%] |
| de-de | 4.8% [1.5%–9.1%] |
| es-419 | 6.1% [2.2%–11.2%] |
| es-es | 10.0% [2.1%–22.3%] |
| es-pr | 4.2% [1.1%–8.1%] |
| fr-fr | 5.1% [2.1%–8.5%] |
| hi-in | 34.6% [23.6%–46.6%] |
| ur-pk | 102.5% [100.7%–104.5%] * |
| zh-cn | 3.3% [1.5%–5.2%] |

\* No option for this language in the engine, so no language was sent and the engine auto-detected: Zoom Scribe on ur-pk. This is what a person choosing that language gets, not the engine's accuracy with the language set. Left out of paired comparisons.

## Formatted accuracy (case and punctuation counted)

| Set | Zoom Scribe |
|---|---|
| en-dictation | 13.7% |
| en-dictation-noise | 10.2% |
| en-dictation-whisper | 41.6% |
| ar-eg | 15.3% |
| ar-sa | 42.8% |
| ar-ae | 67.0% |
| de-de | 7.6% |
| es-419 | 16.4% |
| es-es | 19.4% |
| es-pr | 17.3% |
| fr-fr | 8.7% |
| hi-in | 27.6% |
| ur-pk | 103.6% * |
| zh-cn | 5.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Zoom Scribe | 6.0% | 4.3% | 2.6% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Zoom Scribe |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Zoom Scribe | 407 | 616 | 1406 | 1655 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Zoom Scribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

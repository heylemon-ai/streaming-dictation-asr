# ASR benchmark results — 2026-10-13 (whisper-no-vad)

Options: language=clip, speed=1, gate=false, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Large V3 | self-hosted (Baseten) |

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

| Set | Whisper Large V3 |
|---|---|
| en-dictation | 9.5% [8.1%–11.2%] |
| en-dictation-noise | 7.5% [4.4%–11.6%] |
| en-dictation-whisper | 61.1% [42.0%–75.6%] |
| ar-eg | 9.2% [6.0%–12.7%] |
| ar-sa | 39.5% [27.5%–52.9%] |
| ar-ae | 58.2% [48.6%–68.3%] |
| de-de | 6.9% [3.2%–10.8%] |
| es-419 | 3.5% [0.9%–6.6%] |
| es-es | 10.0% [1.6%–23.0%] |
| es-pr | 4.7% [1.0%–9.9%] |
| fr-fr | 6.9% [2.9%–11.6%] |
| hi-in | 30.3% [21.2%–40.9%] |
| ur-pk | 18.0% [11.7%–24.4%] |
| zh-cn | 4.1% [2.2%–6.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Large V3 |
|---|---|
| en-dictation | 17.5% |
| en-dictation-noise | 17.0% |
| en-dictation-whisper | 68.5% |
| ar-eg | 27.2% |
| ar-sa | 46.7% |
| ar-ae | 64.4% |
| de-de | 9.6% |
| es-419 | 11.3% |
| es-es | 15.3% |
| es-pr | 18.8% |
| fr-fr | 10.3% |
| hi-in | 26.3% |
| ur-pk | 24.4% |
| zh-cn | 11.8% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Large V3 | 5.9% | 7.1% | 2.7% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Whisper Large V3 |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Large V3 | 360 | 596 | 855 | 1125 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Large V3 | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

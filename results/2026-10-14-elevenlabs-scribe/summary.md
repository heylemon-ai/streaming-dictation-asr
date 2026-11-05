# ASR benchmark results — 2026-10-14 (elevenlabs-scribe)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| ElevenLabs Scribe v2 Realtime | scribe_v2_realtime |

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

| Set | ElevenLabs Scribe v2 Realtime |
|---|---|
| en-dictation | 8.1% [6.9%–9.3%] |
| en-dictation-noise | 6.8% [4.2%–9.6%] |
| en-dictation-whisper | 21.1% [14.6%–26.0%] |
| ar-eg | 8.7% [5.0%–12.6%] |
| ar-sa | 66.0% [54.3%–78.1%] |
| ar-ae | 74.7% [62.6%–86.0%] |
| de-de | 7.3% [4.8%–9.5%] |
| es-419 | 9.6% [6.9%–12.8%] |
| es-es | 7.9% [0.5%–20.3%] |
| es-pr | 12.0% [6.5%–18.4%] |
| fr-fr | 10.5% [5.4%–16.5%] |
| hi-in | 10.5% [4.3%–19.0%] |
| ur-pk | 19.7% [14.0%–25.9%] |
| zh-cn | 5.4% [2.8%–8.3%] |

## Formatted accuracy (case and punctuation counted)

| Set | ElevenLabs Scribe v2 Realtime |
|---|---|
| en-dictation | 18.0% |
| en-dictation-noise | 17.7% |
| en-dictation-whisper | 33.8% |
| ar-eg | 17.0% |
| ar-sa | 81.2% |
| ar-ae | 84.6% |
| de-de | 13.1% |
| es-419 | 21.8% |
| es-es | 10.6% |
| es-pr | 29.4% |
| fr-fr | 13.8% |
| hi-in | 15.3% |
| ur-pk | 21.8% |
| zh-cn | 8.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| ElevenLabs Scribe v2 Realtime | 6.4% | 2.0% | 3.2% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | ElevenLabs Scribe v2 Realtime |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| ElevenLabs Scribe v2 Realtime | 15620 | 15987 | 718 | 1015 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| ElevenLabs Scribe v2 Realtime | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

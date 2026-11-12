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
| en-dictation | 12.8% [10.9%–14.9%] |
| en-dictation-noise | 5.8% [3.7%–8.2%] |
| en-dictation-whisper | 9.1% [5.4%–12.9%] |
| ar-eg | 10.2% [5.2%–15.8%] |
| ar-sa | 34.8% [23.3%–47.4%] |
| ar-ae | 61.8% [51.4%–72.3%] |
| de-de | 4.0% [1.6%–6.7%] |
| es-419 | 2.6% [0.8%–5.1%] |
| es-es | 8.9% [1.1%–21.3%] |
| es-pr | 8.9% [3.1%–15.7%] |
| fr-fr | 9.1% [4.8%–13.9%] |
| hi-in | 11.8% [4.8%–21.3%] |
| ur-pk | 22.2% [15.7%–28.6%] |
| zh-cn | 5.2% [2.4%–8.2%] |

## Formatted accuracy (case and punctuation counted)

| Set | ElevenLabs Scribe v2 Realtime |
|---|---|
| en-dictation | 21.9% |
| en-dictation-noise | 11.6% |
| en-dictation-whisper | 16.0% |
| ar-eg | 20.4% |
| ar-sa | 53.3% |
| ar-ae | 76.1% |
| de-de | 7.9% |
| es-419 | 9.1% |
| es-es | 13.0% |
| es-pr | 22.8% |
| fr-fr | 13.5% |
| hi-in | 16.4% |
| ur-pk | 23.4% |
| zh-cn | 7.2% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| ElevenLabs Scribe v2 Realtime | 4.8% | 1.7% | 5.9% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | ElevenLabs Scribe v2 Realtime |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| ElevenLabs Scribe v2 Realtime | 398 | 493 | 685 | 765 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| ElevenLabs Scribe v2 Realtime | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

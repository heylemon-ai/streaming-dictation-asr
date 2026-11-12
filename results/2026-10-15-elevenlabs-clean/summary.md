# ASR benchmark results — 2026-10-15 (elevenlabs-clean)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| ElevenLabs Scribe v2 Realtime (no verbatim) | scribe_v2_realtime |

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

| Set | ElevenLabs Scribe v2 Realtime (no verbatim) |
|---|---|
| en-dictation | 5.1% [4.3%–5.9%] |
| en-dictation-noise | 4.5% [3.1%–6.0%] |
| en-dictation-whisper | 7.1% [3.6%–10.7%] |
| ar-eg | 9.2% [5.1%–13.4%] |
| ar-sa | 66.0% [55.1%–77.0%] |
| ar-ae | 79.4% [66.5%–91.6%] |
| de-de | 3.6% [1.2%–6.2%] |
| es-419 | 1.7% [0.4%–3.5%] |
| es-es | 7.9% [0.5%–20.3%] |
| es-pr | 8.4% [2.7%–15.3%] |
| fr-fr | 9.4% [4.5%–15.0%] |
| hi-in | 10.5% [4.3%–19.0%] |
| ur-pk | 19.4% [13.8%–25.4%] |
| zh-cn | 4.4% [1.9%–6.9%] |

## Formatted accuracy (case and punctuation counted)

| Set | ElevenLabs Scribe v2 Realtime (no verbatim) |
|---|---|
| en-dictation | 9.0% |
| en-dictation-noise | 8.9% |
| en-dictation-whisper | 12.4% |
| ar-eg | 17.4% |
| ar-sa | 81.9% |
| ar-ae | 85.6% |
| de-de | 6.9% |
| es-419 | 8.4% |
| es-es | 10.6% |
| es-pr | 22.8% |
| fr-fr | 12.2% |
| hi-in | 15.1% |
| ur-pk | 21.1% |
| zh-cn | 6.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| ElevenLabs Scribe v2 Realtime (no verbatim) | 4.8% | 1.7% | 1.4% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | ElevenLabs Scribe v2 Realtime (no verbatim) |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| ElevenLabs Scribe v2 Realtime (no verbatim) | 395 | 459 | 660 | 727 | 336 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| ElevenLabs Scribe v2 Realtime (no verbatim) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

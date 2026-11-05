# ASR benchmark results — 2026-10-23 (ears)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Meta Muse | muse-voice-transcribe-1.0 |
| Gemini 3.5 Transcribe | gemini-3.5-transcribe-live |
| Gemini 3.5 Transcribe (Smart) | gemini-3.5-transcribe-live |
| Whisper Self-Hosted | self-hosted (Baseten) |
| Deepgram Nova-3 | nova-3 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | scribe_v2_realtime |
| ElevenLabs Scribe v2 Realtime | scribe_v2_realtime |
| OpenAI GPT-Live-Transcribe (Low delay) | gpt-live-transcribe |
| OpenAI GPT-Realtime-Whisper | gpt-realtime-whisper |
| Zoom Scribe | zoom-scribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ears-whisper | en | whisper | 428 | 105.1 | 107 |
| ears-regular | en | clean | 428 | 99.4 | 107 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|
| ears-whisper | 2.1% [1.7%–2.6%] | 1.4% [1.1%–1.7%] | 1.3% [1.0%–1.6%] | 11.7% [8.3%–15.5%] | 4.3% [3.6%–5.3%] | 1.7% [1.4%–2.1%] | 2.0% [1.6%–2.5%] | 2.4% [2.0%–2.9%] | 2.3% [1.9%–2.8%] | 25.1% [19.9%–31.1%] |
| ears-regular | 1.6% [1.2%–2.0%] | 1.1% [0.8%–1.3%] | 1.0% [0.7%–1.2%] | 1.6% [1.0%–2.4%] | 2.8% [2.3%–3.3%] | 1.4% [1.0%–1.7%] | 1.7% [1.3%–2.1%] | 1.5% [1.1%–2.0%] | 1.4% [1.1%–1.7%] | 1.0% [0.8%–1.3%] |

## Formatted accuracy (case and punctuation counted)

| Set | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|
| ears-whisper | 10.6% | 3.9% | 3.5% | 15.3% | 9.8% | 4.0% | 4.3% | 5.9% | 4.5% | 28.4% |
| ears-regular | 9.4% | 3.5% | 3.2% | 6.4% | 6.3% | 3.6% | 4.2% | 4.1% | 3.4% | 3.4% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Meta Muse | 0.9% | 0.5% | 0.4% |
| Gemini 3.5 Transcribe | 0.6% | 0.3% | 0.3% |
| Gemini 3.5 Transcribe (Smart) | 0.6% | 0.3% | 0.2% |
| Whisper Self-Hosted | 0.8% | 5.6% | 0.3% |
| Deepgram Nova-3 | 1.6% | 1.4% | 0.6% |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 0.8% | 0.4% | 0.3% |
| ElevenLabs Scribe v2 Realtime | 0.9% | 0.4% | 0.6% |
| OpenAI GPT-Live-Transcribe (Low delay) | 1.1% | 0.5% | 0.4% |
| OpenAI GPT-Realtime-Whisper | 1.0% | 0.4% | 0.4% |
| Zoom Scribe | 1.0% | 11.8% | 0.2% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Meta Muse | 393 | 620 | 1594 | 2156 | 856 |
| Gemini 3.5 Transcribe | 512 | 705 | 687 | 989 | 856 |
| Gemini 3.5 Transcribe (Smart) | 515 | 718 | 671 | 911 | 856 |
| Whisper Self-Hosted | 408 | 537 | 922 | 1147 | 856 |
| Deepgram Nova-3 | 357 | 422 | 887 | 1041 | 856 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 455 | 544 | 791 | 889 | 830 |
| ElevenLabs Scribe v2 Realtime | 450 | 594 | 817 | 992 | 833 |
| OpenAI GPT-Live-Transcribe (Low delay) | 719 | 850 | 1194 | 1276 | 856 |
| OpenAI GPT-Realtime-Whisper | 723 | 842 | 1181 | 1258 | 856 |
| Zoom Scribe | 457 | 547 | 1326 | 1418 | 856 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Meta Muse | 0 | 0 |
| Gemini 3.5 Transcribe | 0 | 0 |
| Gemini 3.5 Transcribe (Smart) | 0 | 0 |
| Whisper Self-Hosted | 0 | 0 |
| Deepgram Nova-3 | 0 | 0 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 0 | 26 (ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular) |
| ElevenLabs Scribe v2 Realtime | 0 | 23 (ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular, ears-regular) |
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |
| OpenAI GPT-Realtime-Whisper | 0 | 0 |
| Zoom Scribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +0.1% [-0.1%–0.3%] | 0.296 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.5% [0.3%–0.7%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +0.8% [0.5%–1.0%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Meta Muse | +0.8% [0.6%–1.1%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +1.0% [0.7%–1.4%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +1.2% [0.9%–1.5%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +3.1% [2.5%–3.9%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +10.4% [7.1%–14.2%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +23.9% [18.6%–29.3%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +0.1% [-0.0%–0.2%] | 0.151 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +0.1% [0.0%–0.2%] | 0.042 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.4% [0.2%–0.6%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +0.4% [0.2%–0.6%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +0.6% [0.3%–0.8%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Meta Muse | +0.6% [0.4%–0.8%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +0.7% [0.1%–1.3%] | 0.003 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +0.7% [0.5%–1.0%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +1.8% [1.5%–2.2%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

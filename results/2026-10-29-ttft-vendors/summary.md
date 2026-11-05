# ASR benchmark results — 2026-10-29 (ttft-vendors)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Gemini 3.5 Transcribe | gemini-3.5-transcribe-live |
| Gemini 3.5 Transcribe (Smart) | gemini-3.5-transcribe-live |
| Deepgram Nova-3 | nova-3 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | scribe_v2_realtime |
| ElevenLabs Scribe v2 Realtime | scribe_v2_realtime |
| OpenAI GPT-Live-Transcribe (Low delay) | gpt-live-transcribe |
| OpenAI GPT-Realtime-Whisper | gpt-realtime-whisper |
| Zoom Scribe | zoom-scribe |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|
| en-dictation | 6.8% [5.7%–7.8%] | 4.0% [3.2%–5.0%] | 13.6% [12.0%–15.2%] | 5.1% [4.4%–6.0%] | 12.0% [10.3%–13.5%] | 7.8% [6.8%–8.7%] | 8.2% [7.0%–9.3%] | 7.5% [6.6%–8.4%] |
| en-dictation-noise | 2.4% [1.5%–3.3%] | 4.3% [2.2%–7.4%] | 11.2% [8.7%–13.7%] | 4.5% [3.1%–6.0%] | 6.0% [3.9%–8.4%] | 3.2% [2.1%–4.4%] | 3.7% [2.1%–5.5%] | 4.2% [2.7%–5.7%] |
| en-dictation-whisper | 4.4% [2.7%–5.9%] | 5.0% [3.5%–7.4%] | 19.5% [15.4%–23.4%] | 6.6% [3.6%–9.3%] | 9.0% [5.2%–12.8%] | 9.3% [7.4%–11.6%] | 8.3% [6.7%–9.9%] | 35.6% [20.6%–60.4%] |

## Formatted accuracy (case and punctuation counted)

| Set | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|
| en-dictation | 9.2% | 8.9% | 22.7% | 8.9% | 21.2% | 11.8% | 12.1% | 13.4% |
| en-dictation-noise | 6.2% | 9.8% | 19.7% | 8.9% | 11.6% | 7.8% | 7.3% | 9.8% |
| en-dictation-whisper | 7.7% | 13.6% | 31.8% | 11.8% | 16.0% | 15.2% | 12.7% | 42.6% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Gemini 3.5 Transcribe | 2.1% | 1.0% | 3.0% |
| Gemini 3.5 Transcribe (Smart) | 1.8% | 1.6% | 0.7% |
| Deepgram Nova-3 | 6.6% | 2.5% | 5.0% |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 2.7% | 1.1% | 1.4% |
| ElevenLabs Scribe v2 Realtime | 3.0% | 1.0% | 7.0% |
| OpenAI GPT-Live-Transcribe (Low delay) | 3.4% | 1.1% | 3.0% |
| OpenAI GPT-Realtime-Whisper | 3.1% | 1.4% | 3.3% |
| Zoom Scribe | 3.1% | 4.4% | 3.1% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Gemini 3.5 Transcribe | 738 | 1213 | 813 | 1491 | 106 |
| Gemini 3.5 Transcribe (Smart) | 752 | 1204 | 985 | 1590 | 106 |
| Deepgram Nova-3 | 521 | 1193 | 1572 | 2718 | 106 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 375 | 634 | 688 | 1492 | 106 |
| ElevenLabs Scribe v2 Realtime | 391 | 590 | 657 | 1224 | 106 |
| OpenAI GPT-Live-Transcribe (Low delay) | 725 | 854 | 1116 | 1239 | 106 |
| OpenAI GPT-Realtime-Whisper | 743 | 911 | 1141 | 1330 | 106 |
| Zoom Scribe | 426 | 640 | 1295 | 1492 | 106 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Gemini 3.5 Transcribe | 0 | 0 |
| Gemini 3.5 Transcribe (Smart) | 0 | 0 |
| Deepgram Nova-3 | 0 | 0 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 0 | 0 |
| ElevenLabs Scribe v2 Realtime | 0 | 0 |
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |
| OpenAI GPT-Realtime-Whisper | 0 | 0 |
| Zoom Scribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +1.1% [0.3%–1.9%] | 0.004 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +2.8% [1.7%–3.8%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +3.5% [2.5%–4.3%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +3.8% [2.8%–4.8%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +4.2% [3.1%–5.3%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +7.9% [6.6%–9.3%] | <0.001 |
| en-dictation | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +9.6% [8.2%–10.9%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | OpenAI GPT-Live-Transcribe (Low delay) | +0.8% [0.2%–1.6%] | 0.011 |
| en-dictation-noise | Gemini 3.5 Transcribe | OpenAI GPT-Realtime-Whisper | +1.3% [0.3%–2.7%] | 0.008 |
| en-dictation-noise | Gemini 3.5 Transcribe | Zoom Scribe | +1.8% [0.4%–3.1%] | 0.014 |
| en-dictation-noise | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | +2.0% [0.0%–4.9%] | 0.052 |
| en-dictation-noise | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +2.2% [0.9%–3.4%] | 0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +3.7% [1.8%–5.7%] | <0.001 |
| en-dictation-noise | Gemini 3.5 Transcribe | Deepgram Nova-3 | +8.9% [6.3%–11.6%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | +0.6% [-1.5%–3.7%] | 0.614 |
| en-dictation-whisper | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +2.2% [0.5%–4.0%] | 0.006 |
| en-dictation-whisper | Gemini 3.5 Transcribe | OpenAI GPT-Realtime-Whisper | +3.9% [2.7%–5.2%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | ElevenLabs Scribe v2 Realtime | +4.6% [2.1%–7.4%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | OpenAI GPT-Live-Transcribe (Low delay) | +4.9% [2.6%–7.4%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Deepgram Nova-3 | +15.1% [11.8%–18.7%] | <0.001 |
| en-dictation-whisper | Gemini 3.5 Transcribe | Zoom Scribe | +31.2% [15.8%–55.9%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

# ASR benchmark results — 2026-10-23 (voices)

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
| voices-clean | en | clean | 100 | 26.0 | 100 |
| voices-far | en | far | 100 | 26.0 | 100 |
| voices-far-babble | en | far+babble | 100 | 26.0 | 100 |
| voices-far-tv | en | far+tv | 100 | 26.0 | 100 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|
| voices-clean | 2.7% [2.0%–3.4%] | 3.7% [2.6%–4.9%] | 5.8% [3.5%–8.6%] | 2.7% [2.1%–3.2%] | 5.2% [4.1%–6.4%] | 3.7% [2.6%–5.1%] | 3.9% [2.7%–5.3%] | 3.6% [2.7%–4.5%] | 3.4% [2.5%–4.4%] | 3.6% [2.5%–4.9%] |
| voices-far | 7.0% [5.6%–8.6%] | 6.1% [4.7%–7.6%] | 6.5% [5.1%–8.0%] | 5.3% [4.1%–6.7%] | 10.8% [9.2%–12.5%] | 6.0% [4.5%–7.7%] | 5.9% [4.6%–7.5%] | 8.8% [7.1%–10.6%] | 9.9% [7.7%–12.8%] | 8.8% [5.2%–13.0%] |
| voices-far-babble | 77.9% [72.8%–83.0%] | 41.4% [31.9%–51.2%] | 66.8% [60.5%–72.7%] | 62.8% [56.1%–69.3%] | 94.9% [91.8%–97.5%] | 66.2% [59.8%–72.1%] | 67.0% [61.2%–72.6%] | 85.3% [80.6%–89.6%] | 93.7% [89.8%–97.1%] | 39.3% [32.7%–46.4%] |
| voices-far-tv | 25.9% [21.3%–30.7%] | 19.7% [15.3%–24.3%] | 23.6% [18.8%–28.7%] | 18.5% [14.6%–22.9%] | 50.8% [43.8%–57.9%] | 19.8% [16.1%–23.9%] | 20.0% [15.9%–24.0%] | 29.4% [24.3%–34.7%] | 41.9% [34.7%–49.5%] | 11.4% [7.9%–15.5%] |

## Formatted accuracy (case and punctuation counted)

| Set | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|
| voices-clean | 6.9% | 25.2% | 29.0% | 15.8% | 27.5% | 29.2% | 30.2% | 24.4% | 24.9% | 27.7% |
| voices-far | 16.6% | 27.1% | 29.4% | 23.8% | 33.2% | 31.4% | 31.1% | 27.8% | 29.3% | 31.1% |
| voices-far-babble | 80.6% | 54.1% | 76.6% | 73.0% | 96.1% | 78.7% | 80.8% | 87.3% | 95.0% | 54.0% |
| voices-far-tv | 35.7% | 38.1% | 42.1% | 36.6% | 63.6% | 43.6% | 44.0% | 42.2% | 53.4% | 33.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Meta Muse | 6.6% | 21.3% | 0.5% |
| Gemini 3.5 Transcribe | 6.5% | 5.4% | 0.7% |
| Gemini 3.5 Transcribe (Smart) | 11.1% | 11.6% | 1.5% |
| Whisper Self-Hosted | 8.7% | 12.5% | 1.1% |
| Deepgram Nova-3 | 5.3% | 34.4% | 0.8% |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 14.0% | 7.8% | 2.2% |
| ElevenLabs Scribe v2 Realtime | 14.5% | 7.3% | 2.2% |
| OpenAI GPT-Live-Transcribe (Low delay) | 7.1% | 24.2% | 0.5% |
| OpenAI GPT-Realtime-Whisper | 4.8% | 32.2% | 0.3% |
| Zoom Scribe | 5.9% | 9.4% | 0.5% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Meta Muse | 348 | 403 | 1313 | 1581 | 400 |
| Gemini 3.5 Transcribe | 526 | 640 | 693 | 847 | 326 |
| Gemini 3.5 Transcribe (Smart) | 514 | 629 | 659 | 719 | 386 |
| Whisper Self-Hosted | 379 | 497 | 801 | 856 | 400 |
| Deepgram Nova-3 | 343 | 374 | 852 | 988 | 400 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 418 | 469 | 743 | 806 | 387 |
| ElevenLabs Scribe v2 Realtime | 429 | 519 | 773 | 877 | 391 |
| OpenAI GPT-Live-Transcribe (Low delay) | 729 | 864 | 1224 | 1300 | 400 |
| OpenAI GPT-Realtime-Whisper | 754 | 890 | 1223 | 1319 | 400 |
| Zoom Scribe | 492 | 614 | 1355 | 1482 | 400 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Meta Muse | 0 | 0 |
| Gemini 3.5 Transcribe | 0 | 74 (voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv) |
| Gemini 3.5 Transcribe (Smart) | 0 | 14 (voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble) |
| Whisper Self-Hosted | 0 | 0 |
| Deepgram Nova-3 | 0 | 0 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 0 | 13 (voices-clean, voices-clean, voices-clean, voices-clean, voices-far, voices-far, voices-far, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-tv, voices-far-tv) |
| ElevenLabs Scribe v2 Realtime | 0 | 9 (voices-clean, voices-clean, voices-far, voices-far, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-tv, voices-far-tv) |
| OpenAI GPT-Live-Transcribe (Low delay) | 0 | 0 |
| OpenAI GPT-Realtime-Whisper | 0 | 0 |
| Zoom Scribe | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| voices-clean | Whisper Self-Hosted | Meta Muse | +0.0% [-0.5%–0.6%] | 0.976 |
| voices-clean | Whisper Self-Hosted | OpenAI GPT-Realtime-Whisper | +0.7% [0.1%–1.4%] | 0.021 |
| voices-clean | Whisper Self-Hosted | OpenAI GPT-Live-Transcribe (Low delay) | +0.9% [0.3%–1.6%] | 0.002 |
| voices-clean | Whisper Self-Hosted | Zoom Scribe | +0.9% [0.0%–2.2%] | 0.050 |
| voices-clean | Whisper Self-Hosted | Gemini 3.5 Transcribe | +1.0% [0.1%–2.2%] | 0.016 |
| voices-clean | Whisper Self-Hosted | ElevenLabs Scribe v2 Realtime (no verbatim) | +1.1% [0.2%–2.5%] | 0.010 |
| voices-clean | Whisper Self-Hosted | ElevenLabs Scribe v2 Realtime | +1.2% [0.3%–2.4%] | 0.004 |
| voices-clean | Whisper Self-Hosted | Deepgram Nova-3 | +2.6% [1.6%–3.6%] | <0.001 |
| voices-clean | Whisper Self-Hosted | Gemini 3.5 Transcribe (Smart) | +3.1% [1.0%–6.0%] | <0.001 |
| voices-far | Whisper Self-Hosted | ElevenLabs Scribe v2 Realtime | +0.6% [-0.3%–1.5%] | 0.193 |
| voices-far | Whisper Self-Hosted | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.6% [-0.4%–1.5%] | 0.269 |
| voices-far | Whisper Self-Hosted | Gemini 3.5 Transcribe | +0.8% [-0.2%–1.7%] | 0.126 |
| voices-far | Whisper Self-Hosted | Gemini 3.5 Transcribe (Smart) | +1.2% [0.2%–2.2%] | 0.012 |
| voices-far | Whisper Self-Hosted | Meta Muse | +1.7% [0.7%–2.8%] | <0.001 |
| voices-far | Whisper Self-Hosted | Zoom Scribe | +3.5% [0.1%–7.8%] | 0.041 |
| voices-far | Whisper Self-Hosted | OpenAI GPT-Live-Transcribe (Low delay) | +3.5% [2.2%–4.8%] | <0.001 |
| voices-far | Whisper Self-Hosted | OpenAI GPT-Realtime-Whisper | +4.6% [2.6%–7.2%] | <0.001 |
| voices-far | Whisper Self-Hosted | Deepgram Nova-3 | +5.5% [4.3%–6.8%] | <0.001 |
| voices-far-babble | Zoom Scribe | Gemini 3.5 Transcribe | +22.1% [13.1%–30.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | Whisper Self-Hosted | +23.5% [17.9%–29.5%] | <0.001 |
| voices-far-babble | Zoom Scribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +26.3% [21.1%–31.7%] | <0.001 |
| voices-far-babble | Zoom Scribe | Gemini 3.5 Transcribe (Smart) | +33.4% [26.9%–39.9%] | <0.001 |
| voices-far-babble | Zoom Scribe | ElevenLabs Scribe v2 Realtime | +27.6% [22.0%–32.7%] | <0.001 |
| voices-far-babble | Zoom Scribe | Meta Muse | +38.6% [32.5%–44.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | OpenAI GPT-Live-Transcribe (Low delay) | +45.9% [39.1%–52.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | OpenAI GPT-Realtime-Whisper | +54.3% [47.4%–61.1%] | <0.001 |
| voices-far-babble | Zoom Scribe | Deepgram Nova-3 | +55.6% [48.3%–62.4%] | <0.001 |
| voices-far-tv | Zoom Scribe | Whisper Self-Hosted | +7.1% [3.6%–10.7%] | <0.001 |
| voices-far-tv | Zoom Scribe | Gemini 3.5 Transcribe | +10.4% [6.4%–14.7%] | <0.001 |
| voices-far-tv | Zoom Scribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +8.2% [5.0%–11.4%] | <0.001 |
| voices-far-tv | Zoom Scribe | ElevenLabs Scribe v2 Realtime | +8.6% [5.3%–12.0%] | <0.001 |
| voices-far-tv | Zoom Scribe | Gemini 3.5 Transcribe (Smart) | +12.2% [8.0%–16.7%] | <0.001 |
| voices-far-tv | Zoom Scribe | Meta Muse | +14.5% [10.4%–18.9%] | <0.001 |
| voices-far-tv | Zoom Scribe | OpenAI GPT-Live-Transcribe (Low delay) | +18.0% [13.4%–23.0%] | <0.001 |
| voices-far-tv | Zoom Scribe | OpenAI GPT-Realtime-Whisper | +30.5% [24.1%–37.2%] | <0.001 |
| voices-far-tv | Zoom Scribe | Deepgram Nova-3 | +39.4% [32.9%–45.9%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

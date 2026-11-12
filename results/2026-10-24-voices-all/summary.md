# ASR benchmark results — 2026-10-24 (voices-all)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Large V3 | self-hosted (Baseten) |
| Qwen3-ASR | self-hosted (Baseten) |
| Meta Muse | muse-voice-transcribe-1.0 |
| Gemini 3.5 Transcribe | gemini-3.5-transcribe-live |
| Gemini 3.5 Transcribe (Smart) | gemini-3.5-transcribe-live |
| Whisper Self-Hosted | self-hosted (Baseten) |
| AssemblyAI Universal-3.5 Pro | universal-3-5-pro |
| AssemblyAI Universal-3.6 Pro | universal-3-6-pro |
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

| Set | Whisper Large V3 | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| voices-clean | 2.7% [2.1%–3.4%] | 2.5% [1.9%–3.2%] | 2.7% [2.0%–3.4%] | 3.7% [2.6%–4.9%] | 5.8% [3.5%–8.6%] | 2.7% [2.1%–3.2%] | 3.7% [2.7%–4.9%] | 3.9% [2.9%–5.1%] | 5.2% [4.1%–6.4%] | 3.8% [2.7%–5.1%] | 3.8% [2.7%–5.1%] | 3.6% [2.7%–4.5%] | 3.4% [2.5%–4.4%] | 3.6% [2.5%–4.9%] |
| voices-far | 12.7% [8.7%–17.4%] | 10.9% [6.7%–15.3%] | 7.0% [5.6%–8.6%] | 6.1% [4.7%–7.6%] | 6.5% [5.1%–8.0%] | 5.3% [4.1%–6.7%] | 6.5% [4.6%–8.8%] | 6.4% [4.5%–8.6%] | 10.8% [9.2%–12.5%] | 5.8% [4.3%–7.4%] | 5.8% [4.4%–7.3%] | 8.8% [7.1%–10.6%] | 9.9% [7.7%–12.8%] | 8.8% [5.2%–13.0%] |
| voices-far-babble | 63.7% [57.0%–70.0%] | 51.5% [45.3%–57.2%] | 77.9% [72.8%–83.0%] | 41.4% [31.9%–51.2%] | 67.6% [61.2%–73.8%] | 62.8% [56.1%–69.3%] | 53.3% [46.7%–59.6%] | 60.4% [53.3%–67.3%] | 94.9% [91.8%–97.5%] | 66.6% [60.7%–72.2%] | 66.7% [61.1%–72.2%] | 85.3% [80.6%–89.6%] | 93.7% [89.8%–97.1%] | 39.3% [32.7%–46.4%] |
| voices-far-tv | 24.0% [19.1%–29.7%] | 16.5% [12.6%–20.9%] | 25.9% [21.3%–30.7%] | 19.7% [15.3%–24.3%] | 23.6% [18.8%–28.7%] | 18.5% [14.6%–22.9%] | 13.7% [10.7%–17.0%] | 14.4% [11.3%–18.2%] | 50.8% [43.8%–57.9%] | 19.5% [15.8%–23.4%] | 20.1% [16.4%–24.3%] | 29.4% [24.3%–34.7%] | 41.9% [34.7%–49.5%] | 11.4% [7.9%–15.5%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Large V3 | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| voices-clean | 16.9% | 27.0% | 6.9% | 25.2% | 29.0% | 15.8% | 26.9% | 26.6% | 27.5% | 29.7% | 30.3% | 24.4% | 24.9% | 27.7% |
| voices-far | 29.9% | 33.2% | 16.6% | 27.1% | 29.4% | 23.8% | 28.2% | 28.0% | 33.2% | 30.9% | 31.0% | 27.8% | 29.3% | 31.1% |
| voices-far-babble | 75.3% | 63.6% | 80.6% | 54.1% | 77.1% | 73.0% | 66.2% | 69.9% | 96.1% | 79.1% | 80.3% | 87.3% | 95.0% | 54.0% |
| voices-far-tv | 43.0% | 37.4% | 35.7% | 38.1% | 42.1% | 36.6% | 35.1% | 35.4% | 63.6% | 43.3% | 44.2% | 42.2% | 53.4% | 33.3% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Large V3 | 10.8% | 13.5% | 1.5% |
| Qwen3-ASR | 10.5% | 9.3% | 0.6% |
| Meta Muse | 6.6% | 21.3% | 0.5% |
| Gemini 3.5 Transcribe | 6.5% | 5.4% | 0.7% |
| Gemini 3.5 Transcribe (Smart) | 11.1% | 12.0% | 1.5% |
| Whisper Self-Hosted | 8.7% | 12.5% | 1.1% |
| AssemblyAI Universal-3.5 Pro | 9.5% | 8.4% | 1.4% |
| AssemblyAI Universal-3.6 Pro | 7.1% | 13.3% | 0.9% |
| Deepgram Nova-3 | 5.3% | 34.4% | 0.8% |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 13.9% | 7.8% | 2.3% |
| ElevenLabs Scribe v2 Realtime | 14.6% | 7.3% | 2.2% |
| OpenAI GPT-Live-Transcribe (Low delay) | 7.1% | 24.2% | 0.5% |
| OpenAI GPT-Realtime-Whisper | 4.8% | 32.2% | 0.3% |
| Zoom Scribe | 5.9% | 9.4% | 0.5% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Large V3 | 422 | 531 | 749 | 835 | 397 |
| Qwen3-ASR | 387 | 501 | 873 | 2729 | 400 |
| Meta Muse | 348 | 403 | 1313 | 1581 | 400 |
| Gemini 3.5 Transcribe | 526 | 640 | 693 | 847 | 326 |
| Gemini 3.5 Transcribe (Smart) | 514 | 629 | 659 | 725 | 388 |
| Whisper Self-Hosted | 379 | 497 | 801 | 856 | 400 |
| AssemblyAI Universal-3.5 Pro | 821 | 1288 | 1209 | 1296 | 400 |
| AssemblyAI Universal-3.6 Pro | 891 | 1306 | 1223 | 1390 | 400 |
| Deepgram Nova-3 | 343 | 374 | 852 | 988 | 400 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 419 | 474 | 747 | 807 | 400 |
| ElevenLabs Scribe v2 Realtime | 429 | 520 | 773 | 877 | 400 |
| OpenAI GPT-Live-Transcribe (Low delay) | 729 | 864 | 1224 | 1300 | 400 |
| OpenAI GPT-Realtime-Whisper | 754 | 890 | 1223 | 1319 | 400 |
| Zoom Scribe | 492 | 614 | 1355 | 1482 | 400 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Large V3 | 3 (voices-far, voices-far, voices-far-babble) | 0 |
| Qwen3-ASR | 0 | 0 |
| Meta Muse | 0 | 0 |
| Gemini 3.5 Transcribe | 0 | 74 (voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv) |
| Gemini 3.5 Transcribe (Smart) | 0 | 12 (voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble) |
| Whisper Self-Hosted | 0 | 0 |
| AssemblyAI Universal-3.5 Pro | 0 | 0 |
| AssemblyAI Universal-3.6 Pro | 0 | 0 |
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
| voices-clean | Qwen3-ASR | Whisper Self-Hosted | +0.2% [-0.3%–0.7%] | 0.559 |
| voices-clean | Qwen3-ASR | Meta Muse | +0.2% [-0.4%–0.8%] | 0.607 |
| voices-clean | Qwen3-ASR | Whisper Large V3 | +0.2% [-0.4%–0.9%] | 0.496 |
| voices-clean | Qwen3-ASR | OpenAI GPT-Realtime-Whisper | +0.9% [0.2%–1.6%] | 0.008 |
| voices-clean | Qwen3-ASR | OpenAI GPT-Live-Transcribe (Low delay) | +1.1% [0.4%–1.8%] | 0.001 |
| voices-clean | Qwen3-ASR | Zoom Scribe | +1.1% [0.2%–2.3%] | 0.008 |
| voices-clean | Qwen3-ASR | Gemini 3.5 Transcribe | +1.1% [0.2%–2.4%] | 0.010 |
| voices-clean | Qwen3-ASR | AssemblyAI Universal-3.5 Pro | +1.2% [0.3%–2.4%] | 0.002 |
| voices-clean | Qwen3-ASR | ElevenLabs Scribe v2 Realtime (no verbatim) | +1.3% [0.3%–2.6%] | 0.002 |
| voices-clean | Qwen3-ASR | ElevenLabs Scribe v2 Realtime | +1.3% [0.4%–2.6%] | 0.002 |
| voices-clean | Qwen3-ASR | AssemblyAI Universal-3.6 Pro | +1.4% [0.4%–2.6%] | <0.001 |
| voices-clean | Qwen3-ASR | Deepgram Nova-3 | +2.7% [1.8%–3.8%] | <0.001 |
| voices-clean | Qwen3-ASR | Gemini 3.5 Transcribe (Smart) | +3.3% [1.2%–6.2%] | <0.001 |
| voices-far | Whisper Self-Hosted | ElevenLabs Scribe v2 Realtime | +0.5% [-0.3%–1.4%] | 0.269 |
| voices-far | Whisper Self-Hosted | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.5% [-0.3%–1.5%] | 0.254 |
| voices-far | Whisper Self-Hosted | Gemini 3.5 Transcribe | +0.8% [-0.2%–1.7%] | 0.126 |
| voices-far | Whisper Self-Hosted | AssemblyAI Universal-3.6 Pro | +1.1% [-0.5%–2.9%] | 0.209 |
| voices-far | Whisper Self-Hosted | Gemini 3.5 Transcribe (Smart) | +1.2% [0.2%–2.2%] | 0.012 |
| voices-far | Whisper Self-Hosted | AssemblyAI Universal-3.5 Pro | +1.2% [-0.4%–3.1%] | 0.156 |
| voices-far | Whisper Self-Hosted | Meta Muse | +1.7% [0.7%–2.8%] | <0.001 |
| voices-far | Whisper Self-Hosted | Zoom Scribe | +3.5% [0.1%–7.8%] | 0.041 |
| voices-far | Whisper Self-Hosted | OpenAI GPT-Live-Transcribe (Low delay) | +3.5% [2.2%–4.8%] | <0.001 |
| voices-far | Whisper Self-Hosted | OpenAI GPT-Realtime-Whisper | +4.6% [2.6%–7.2%] | <0.001 |
| voices-far | Whisper Self-Hosted | Deepgram Nova-3 | +5.5% [4.3%–6.8%] | <0.001 |
| voices-far | Whisper Self-Hosted | Qwen3-ASR | +5.6% [1.6%–10.4%] | 0.005 |
| voices-far | Whisper Self-Hosted | Whisper Large V3 | +7.4% [3.7%–12.1%] | <0.001 |
| voices-far-babble | Zoom Scribe | Gemini 3.5 Transcribe | +22.1% [13.1%–30.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | Qwen3-ASR | +12.1% [7.9%–16.1%] | <0.001 |
| voices-far-babble | Zoom Scribe | AssemblyAI Universal-3.5 Pro | +14.0% [9.3%–19.0%] | <0.001 |
| voices-far-babble | Zoom Scribe | AssemblyAI Universal-3.6 Pro | +21.1% [15.7%–26.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | Whisper Self-Hosted | +23.5% [17.9%–29.5%] | <0.001 |
| voices-far-babble | Zoom Scribe | Whisper Large V3 | +24.3% [18.8%–29.9%] | <0.001 |
| voices-far-babble | Zoom Scribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +27.2% [22.0%–32.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | ElevenLabs Scribe v2 Realtime | +27.3% [22.2%–32.4%] | <0.001 |
| voices-far-babble | Zoom Scribe | Gemini 3.5 Transcribe (Smart) | +33.6% [27.0%–40.1%] | <0.001 |
| voices-far-babble | Zoom Scribe | Meta Muse | +38.6% [32.5%–44.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | OpenAI GPT-Live-Transcribe (Low delay) | +45.9% [39.1%–52.6%] | <0.001 |
| voices-far-babble | Zoom Scribe | OpenAI GPT-Realtime-Whisper | +54.3% [47.4%–61.1%] | <0.001 |
| voices-far-babble | Zoom Scribe | Deepgram Nova-3 | +55.6% [48.3%–62.4%] | <0.001 |
| voices-far-tv | Zoom Scribe | AssemblyAI Universal-3.5 Pro | +2.3% [-0.8%–5.4%] | 0.124 |
| voices-far-tv | Zoom Scribe | AssemblyAI Universal-3.6 Pro | +3.0% [-0.4%–6.5%] | 0.080 |
| voices-far-tv | Zoom Scribe | Qwen3-ASR | +5.1% [2.8%–7.5%] | <0.001 |
| voices-far-tv | Zoom Scribe | Whisper Self-Hosted | +7.1% [3.6%–10.7%] | <0.001 |
| voices-far-tv | Zoom Scribe | ElevenLabs Scribe v2 Realtime (no verbatim) | +8.1% [4.9%–11.4%] | <0.001 |
| voices-far-tv | Zoom Scribe | Gemini 3.5 Transcribe | +10.4% [6.4%–14.7%] | <0.001 |
| voices-far-tv | Zoom Scribe | ElevenLabs Scribe v2 Realtime | +8.7% [5.4%–12.0%] | <0.001 |
| voices-far-tv | Zoom Scribe | Gemini 3.5 Transcribe (Smart) | +12.2% [8.0%–16.7%] | <0.001 |
| voices-far-tv | Zoom Scribe | Whisper Large V3 | +12.6% [9.7%–15.7%] | <0.001 |
| voices-far-tv | Zoom Scribe | Meta Muse | +14.5% [10.4%–18.9%] | <0.001 |
| voices-far-tv | Zoom Scribe | OpenAI GPT-Live-Transcribe (Low delay) | +18.0% [13.4%–23.0%] | <0.001 |
| voices-far-tv | Zoom Scribe | OpenAI GPT-Realtime-Whisper | +30.5% [24.1%–37.2%] | <0.001 |
| voices-far-tv | Zoom Scribe | Deepgram Nova-3 | +39.4% [32.9%–45.9%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

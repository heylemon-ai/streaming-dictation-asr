# ASR benchmark results — 2026-10-24 (ears-all)

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
| ears-whisper | en | whisper | 428 | 105.1 | 107 |
| ears-regular | en | clean | 428 | 99.4 | 107 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Whisper Large V3 | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ears-whisper | 43.2% [36.3%–50.2%] | 32.3% [26.4%–38.4%] | 2.1% [1.7%–2.6%] | 1.4% [1.1%–1.7%] | 1.3% [1.0%–1.6%] | 11.7% [8.3%–15.5%] | 9.2% [6.5%–12.4%] | 9.0% [6.3%–12.2%] | 4.3% [3.6%–5.3%] | 1.8% [1.4%–2.2%] | 2.0% [1.6%–2.4%] | 2.4% [2.0%–2.9%] | 2.3% [1.9%–2.8%] | 25.1% [19.9%–31.1%] |
| ears-regular | 1.1% [0.9%–1.5%] | 1.3% [1.0%–1.6%] | 1.6% [1.2%–2.0%] | 1.1% [0.8%–1.3%] | 1.0% [0.7%–1.2%] | 1.6% [1.0%–2.4%] | 2.0% [1.7%–2.3%] | 2.0% [1.7%–2.4%] | 2.8% [2.3%–3.3%] | 1.4% [1.0%–1.7%] | 1.6% [1.3%–2.1%] | 1.5% [1.1%–2.0%] | 1.4% [1.1%–1.7%] | 1.0% [0.8%–1.3%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Large V3 | Qwen3-ASR | Meta Muse | Gemini 3.5 Transcribe | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | AssemblyAI Universal-3.5 Pro | AssemblyAI Universal-3.6 Pro | Deepgram Nova-3 | ElevenLabs Scribe v2 Realtime (no verbatim) | ElevenLabs Scribe v2 Realtime | OpenAI GPT-Live-Transcribe (Low delay) | OpenAI GPT-Realtime-Whisper | Zoom Scribe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ears-whisper | 46.2% | 35.9% | 10.6% | 3.9% | 3.5% | 15.3% | 11.9% | 11.6% | 9.8% | 4.0% | 4.3% | 5.9% | 4.5% | 28.4% |
| ears-regular | 4.1% | 4.2% | 9.4% | 3.5% | 3.2% | 6.4% | 4.9% | 4.7% | 6.3% | 3.7% | 4.2% | 4.1% | 3.4% | 3.4% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Large V3 | 1.9% | 19.9% | 0.4% |
| Qwen3-ASR | 0.9% | 15.5% | 0.4% |
| Meta Muse | 0.9% | 0.5% | 0.4% |
| Gemini 3.5 Transcribe | 0.6% | 0.3% | 0.3% |
| Gemini 3.5 Transcribe (Smart) | 0.6% | 0.3% | 0.2% |
| Whisper Self-Hosted | 0.8% | 5.6% | 0.3% |
| AssemblyAI Universal-3.5 Pro | 1.3% | 3.9% | 0.4% |
| AssemblyAI Universal-3.6 Pro | 1.3% | 3.9% | 0.3% |
| Deepgram Nova-3 | 1.6% | 1.4% | 0.6% |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 0.8% | 0.4% | 0.3% |
| ElevenLabs Scribe v2 Realtime | 0.8% | 0.4% | 0.6% |
| OpenAI GPT-Live-Transcribe (Low delay) | 1.1% | 0.5% | 0.4% |
| OpenAI GPT-Realtime-Whisper | 1.0% | 0.4% | 0.4% |
| Zoom Scribe | 1.0% | 11.8% | 0.2% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Large V3 | 408 | 571 | 774 | 897 | 818 |
| Qwen3-ASR | 344 | 463 | 865 | 1321 | 856 |
| Meta Muse | 393 | 620 | 1594 | 2156 | 856 |
| Gemini 3.5 Transcribe | 512 | 705 | 687 | 989 | 856 |
| Gemini 3.5 Transcribe (Smart) | 515 | 718 | 671 | 911 | 856 |
| Whisper Self-Hosted | 408 | 537 | 922 | 1147 | 856 |
| AssemblyAI Universal-3.5 Pro | 735 | 1175 | 1291 | 1781 | 856 |
| AssemblyAI Universal-3.6 Pro | 731 | 1234 | 1227 | 2275 | 856 |
| Deepgram Nova-3 | 357 | 422 | 887 | 1041 | 856 |
| ElevenLabs Scribe v2 Realtime (no verbatim) | 454 | 543 | 793 | 887 | 856 |
| ElevenLabs Scribe v2 Realtime | 449 | 593 | 816 | 985 | 856 |
| OpenAI GPT-Live-Transcribe (Low delay) | 719 | 850 | 1194 | 1276 | 856 |
| OpenAI GPT-Realtime-Whisper | 723 | 842 | 1181 | 1258 | 856 |
| Zoom Scribe | 457 | 547 | 1326 | 1418 | 856 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Large V3 | 38 (ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper, ears-whisper) | 0 |
| Qwen3-ASR | 0 | 0 |
| Meta Muse | 0 | 0 |
| Gemini 3.5 Transcribe | 0 | 0 |
| Gemini 3.5 Transcribe (Smart) | 0 | 0 |
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
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +0.1% [-0.1%–0.3%] | 0.296 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.5% [0.3%–0.7%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +0.7% [0.5%–1.0%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Meta Muse | +0.8% [0.6%–1.1%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +1.0% [0.7%–1.4%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +1.2% [0.9%–1.5%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +3.1% [2.5%–3.9%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.6 Pro | +7.7% [5.1%–10.9%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.5 Pro | +7.9% [5.3%–11.1%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +10.4% [7.1%–14.2%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +23.9% [18.6%–29.3%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Qwen3-ASR | +31.0% [25.3%–36.9%] | <0.001 |
| ears-whisper | Gemini 3.5 Transcribe (Smart) | Whisper Large V3 | +41.9% [35.3%–48.8%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Zoom Scribe | +0.1% [-0.0%–0.2%] | 0.151 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Gemini 3.5 Transcribe | +0.1% [0.0%–0.2%] | 0.042 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Whisper Large V3 | +0.2% [0.0%–0.3%] | 0.008 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Qwen3-ASR | +0.3% [0.2%–0.5%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime (no verbatim) | +0.4% [0.2%–0.6%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Realtime-Whisper | +0.4% [0.2%–0.6%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | OpenAI GPT-Live-Transcribe (Low delay) | +0.6% [0.3%–0.8%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Meta Muse | +0.6% [0.4%–0.8%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Whisper Self-Hosted | +0.7% [0.1%–1.3%] | 0.003 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | ElevenLabs Scribe v2 Realtime | +0.7% [0.5%–0.9%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.5 Pro | +1.0% [0.9%–1.1%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | AssemblyAI Universal-3.6 Pro | +1.1% [0.8%–1.3%] | <0.001 |
| ears-regular | Gemini 3.5 Transcribe (Smart) | Deepgram Nova-3 | +1.8% [1.5%–2.2%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

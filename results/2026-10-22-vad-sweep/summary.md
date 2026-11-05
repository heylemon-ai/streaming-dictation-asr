# ASR benchmark results — 2026-10-22 (vad-sweep)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Self-Hosted (Silero drops audio, threshold 0.2) | self-hosted (Baseten) |
| Whisper Self-Hosted (Silero drops audio, threshold 0.3) | self-hosted (Baseten) |
| Whisper Self-Hosted (Silero drops audio, threshold 0.4) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN drops audio, threshold 0.2) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN drops audio, threshold 0.3) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN drops audio, threshold 0.4) | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |
| nonspeech | en | nonspeech | 10 | 1.8 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Whisper Self-Hosted (Silero drops audio, threshold 0.2) | Whisper Self-Hosted (Silero drops audio, threshold 0.3) | Whisper Self-Hosted (Silero drops audio, threshold 0.4) | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (TEN drops audio, threshold 0.4) |
|---|---|---|---|---|---|---|
| en-dictation-noise | 7.4% [5.1%–9.9%] | 5.9% [3.9%–8.2%] | 5.8% [3.7%–8.4%] | 6.2% [3.7%–9.5%] | 5.3% [3.5%–7.3%] | 5.9% [4.0%–8.2%] |
| en-dictation-whisper | 41.1% [25.1%–67.1%] | 44.7% [28.4%–72.2%] | 46.3% [29.6%–73.5%] | 10.0% [7.6%–12.2%] | 10.2% [7.5%–12.4%] | 10.5% [7.4%–12.6%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Self-Hosted (Silero drops audio, threshold 0.2) | Whisper Self-Hosted (Silero drops audio, threshold 0.3) | Whisper Self-Hosted (Silero drops audio, threshold 0.4) | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (TEN drops audio, threshold 0.4) |
|---|---|---|---|---|---|---|
| en-dictation-noise | 15.4% | 13.8% | 13.0% | 14.9% | 14.0% | 14.9% |
| en-dictation-whisper | 47.4% | 51.2% | 52.2% | 18.3% | 18.5% | 18.5% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Self-Hosted (Silero drops audio, threshold 0.2) | 5.3% | 18.6% | 1.9% |
| Whisper Self-Hosted (Silero drops audio, threshold 0.3) | 5.1% | 20.4% | 1.6% |
| Whisper Self-Hosted (Silero drops audio, threshold 0.4) | 5.4% | 21.1% | 1.5% |
| Whisper Self-Hosted (TEN drops audio, threshold 0.2) | 4.4% | 2.5% | 1.4% |
| Whisper Self-Hosted (TEN drops audio, threshold 0.3) | 4.2% | 2.4% | 1.4% |
| Whisper Self-Hosted (TEN drops audio, threshold 0.4) | 4.2% | 2.9% | 1.3% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Whisper Self-Hosted (Silero drops audio, threshold 0.2) | Whisper Self-Hosted (Silero drops audio, threshold 0.3) | Whisper Self-Hosted (Silero drops audio, threshold 0.4) | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (TEN drops audio, threshold 0.4) |
|---|---|---|---|---|---|---|
| nonspeech | 0.0% (0/10) | 0.0% (0/10) | 0.0% (0/10) | 20.0% (2/10) | 20.0% (2/10) | 20.0% (2/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Self-Hosted (Silero drops audio, threshold 0.2) | 384 | 1340 | 1130 | 2708 | 43 |
| Whisper Self-Hosted (Silero drops audio, threshold 0.3) | 311 | 427 | 877 | 1108 | 43 |
| Whisper Self-Hosted (Silero drops audio, threshold 0.4) | 308 | 383 | 816 | 888 | 43 |
| Whisper Self-Hosted (TEN drops audio, threshold 0.2) | 315 | 422 | 830 | 941 | 43 |
| Whisper Self-Hosted (TEN drops audio, threshold 0.3) | 302 | 407 | 826 | 947 | 43 |
| Whisper Self-Hosted (TEN drops audio, threshold 0.4) | 331 | 500 | 849 | 1238 | 43 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Self-Hosted (Silero drops audio, threshold 0.2) | 0 | 0 |
| Whisper Self-Hosted (Silero drops audio, threshold 0.3) | 0 | 0 |
| Whisper Self-Hosted (Silero drops audio, threshold 0.4) | 0 | 0 |
| Whisper Self-Hosted (TEN drops audio, threshold 0.2) | 0 | 0 |
| Whisper Self-Hosted (TEN drops audio, threshold 0.3) | 0 | 0 |
| Whisper Self-Hosted (TEN drops audio, threshold 0.4) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation-noise | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (Silero drops audio, threshold 0.4) | +0.6% [-0.5%–1.7%] | 0.376 |
| en-dictation-noise | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (Silero drops audio, threshold 0.3) | +0.7% [-0.3%–1.7%] | 0.257 |
| en-dictation-noise | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (TEN drops audio, threshold 0.4) | +0.7% [0.0%–1.5%] | 0.077 |
| en-dictation-noise | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | +0.9% [-0.2%–2.6%] | 0.202 |
| en-dictation-noise | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | Whisper Self-Hosted (Silero drops audio, threshold 0.2) | +2.1% [0.8%–3.5%] | <0.001 |
| en-dictation-whisper | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (TEN drops audio, threshold 0.3) | +0.2% [-0.5%–1.0%] | 0.709 |
| en-dictation-whisper | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (TEN drops audio, threshold 0.4) | +0.5% [-0.9%–1.5%] | 0.504 |
| en-dictation-whisper | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (Silero drops audio, threshold 0.2) | +31.1% [14.6%–56.8%] | <0.001 |
| en-dictation-whisper | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (Silero drops audio, threshold 0.3) | +34.7% [17.4%–62.4%] | <0.001 |
| en-dictation-whisper | Whisper Self-Hosted (TEN drops audio, threshold 0.2) | Whisper Self-Hosted (Silero drops audio, threshold 0.4) | +36.3% [19.2%–64.0%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

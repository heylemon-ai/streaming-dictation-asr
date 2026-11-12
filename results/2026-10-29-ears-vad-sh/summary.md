# ASR benchmark results — 2026-10-29 (ears-vad-sh)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Self-Hosted (VAD drops audio) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN VAD) | self-hosted (Baseten) |
| Whisper Self-Hosted (TEN VAD drops audio) | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| ears-whisper | en | whisper | 428 | 105.1 | 107 |
| ears-regular | en | clean | 428 | 99.4 | 107 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) |
|---|---|---|---|
| ears-whisper | 38.4% [31.9%–45.4%] | 9.7% [6.6%–13.5%] | 14.7% [10.4%–19.8%] |
| ears-regular | 1.6% [1.1%–2.4%] | 1.4% [0.9%–2.1%] | 1.9% [1.1%–3.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) |
|---|---|---|---|
| ears-whisper | 41.0% | 13.4% | 17.1% |
| ears-regular | 4.6% | 7.1% | 5.2% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Self-Hosted (VAD drops audio) | 1.4% | 18.5% | 0.2% |
| Whisper Self-Hosted (TEN VAD) | 0.7% | 4.7% | 0.2% |
| Whisper Self-Hosted (TEN VAD drops audio) | 0.8% | 7.3% | 0.2% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Self-Hosted (VAD drops audio) | 432 | 729 | 994 | 1844 | 856 |
| Whisper Self-Hosted (TEN VAD) | 470 | 700 | 889 | 1626 | 856 |
| Whisper Self-Hosted (TEN VAD drops audio) | 516 | 746 | 1038 | 1748 | 856 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Self-Hosted (VAD drops audio) | 0 | 0 |
| Whisper Self-Hosted (TEN VAD) | 0 | 0 |
| Whisper Self-Hosted (TEN VAD drops audio) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| ears-whisper | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +4.9% [2.5%–7.7%] | <0.001 |
| ears-whisper | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (VAD drops audio) | +28.7% [23.6%–34.1%] | <0.001 |
| ears-regular | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (VAD drops audio) | +0.2% [-0.6%–1.0%] | 0.638 |
| ears-regular | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | +0.5% [-0.3%–1.4%] | 0.227 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

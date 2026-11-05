# ASR benchmark results — 2026-10-23 (voices-baseten)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Whisper Large V3 | self-hosted (Baseten) |
| Qwen3-ASR | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| voices-clean | en | clean | 100 | 26.0 | 100 |
| voices-far | en | far | 100 | 26.0 | 100 |
| voices-far-babble | en | far+babble | 100 | 26.0 | 100 |
| voices-far-tv | en | far+tv | 100 | 26.0 | 100 |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Whisper Large V3 | Qwen3-ASR |
|---|---|---|
| voices-clean | 2.7% [2.1%–3.4%] | 3.6% [1.8%–5.5%] |
| voices-far | 12.7% [8.7%–17.4%] | 19.3% [4.1%–39.8%] |
| voices-far-babble | 63.7% [57.0%–70.0%] | 61.1% [44.0%–78.3%] |
| voices-far-tv | 24.0% [19.1%–29.7%] | 19.8% [9.7%–36.0%] |

## Formatted accuracy (case and punctuation counted)

| Set | Whisper Large V3 | Qwen3-ASR |
|---|---|---|
| voices-clean | 16.9% | 26.1% |
| voices-far | 29.9% | 37.9% |
| voices-far-babble | 75.3% | 70.8% |
| voices-far-tv | 43.0% | 38.6% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Whisper Large V3 | 10.8% | 13.5% | 1.5% |
| Qwen3-ASR | 13.6% | 11.3% | 0.7% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Whisper Large V3 | 422 | 531 | 749 | 835 | 397 |
| Qwen3-ASR | 338 | 477 | 4077 | 4853 | 41 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Whisper Large V3 | 3 (voices-far, voices-far, voices-far-babble) | 0 |
| Qwen3-ASR | 0 | 359 (voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-clean, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-babble, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv) |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| voices-clean | Whisper Large V3 | Qwen3-ASR | +0.6% [-1.1%–2.8%] | 0.618 |
| voices-far | Whisper Large V3 | Qwen3-ASR | +5.5% [-5.4%–22.0%] | 0.671 |
| voices-far-babble | Qwen3-ASR | Whisper Large V3 | +9.4% [1.1%–20.8%] | 0.021 |
| voices-far-tv | Qwen3-ASR | Whisper Large V3 | +7.1% [2.1%–12.5%] | 0.005 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

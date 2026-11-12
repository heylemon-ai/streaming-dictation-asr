# ASR benchmark results — 2026-10-23 (voices-qwen)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
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

| Set | Qwen3-ASR |
|---|---|
| voices-clean | 2.5% [1.9%–3.2%] |
| voices-far | 10.9% [6.7%–15.3%] |
| voices-far-babble | 51.5% [45.3%–57.2%] |
| voices-far-tv | 17.2% [13.2%–21.6%] |

## Formatted accuracy (case and punctuation counted)

| Set | Qwen3-ASR |
|---|---|
| voices-clean | 27.0% |
| voices-far | 33.2% |
| voices-far-babble | 63.6% |
| voices-far-tv | 38.0% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Qwen3-ASR | 10.6% | 9.4% | 0.6% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Qwen3-ASR | 386 | 501 | 873 | 2729 | 395 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Qwen3-ASR | 0 | 5 (voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv, voices-far-tv) |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

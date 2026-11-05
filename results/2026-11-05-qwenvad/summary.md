# ASR benchmark results — 2026-11-05 (qwenvad)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Qwen3-ASR | self-hosted (Baseten) |
| Qwen3-ASR (relaxed server VAD) | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation-whisper | en | whisper | 16 | 11.1 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Qwen3-ASR | Qwen3-ASR (relaxed server VAD) |
|---|---|---|
| en-dictation-whisper | 46.7% [32.9%–67.5%] | 16.4% [11.0%–26.8%] |

## Formatted accuracy (case and punctuation counted)

| Set | Qwen3-ASR | Qwen3-ASR (relaxed server VAD) |
|---|---|---|
| en-dictation-whisper | 56.3% | 25.1% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Qwen3-ASR | 11.0% | 32.2% | 3.4% |
| Qwen3-ASR (relaxed server VAD) | 8.0% | 5.7% | 2.6% |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Qwen3-ASR | 275 | 373 | 938 | 1173 | 16 |
| Qwen3-ASR (relaxed server VAD) | 393 | 716 | 1064 | 2305 | 16 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Qwen3-ASR | 0 | 0 |
| Qwen3-ASR (relaxed server VAD) | 0 | 0 |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|
| en-dictation-whisper | Qwen3-ASR (relaxed server VAD) | Qwen3-ASR | +30.3% [17.3%–49.2%] | <0.001 |

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

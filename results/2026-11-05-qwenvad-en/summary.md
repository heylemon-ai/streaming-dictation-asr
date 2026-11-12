# ASR benchmark results — 2026-11-05 (qwenvad-en)

Options: language=clip, speed=1, gate=true, runs=1, clientProfile=published

| Engine | Model |
|---|---|
| Qwen3-ASR (relaxed server VAD) | self-hosted (Baseten) |

## Test sets

| Set | Language | Condition | Clips | Minutes | Speakers |
|---|---|---|---|---|---|
| en-dictation | en | clean | 73 | 61.6 | not labelled |
| en-dictation-noise | en | noise | 17 | 8.7 | not labelled |
| nonspeech | en | nonspeech | 10 | 1.8 | not labelled |

## Accuracy (normalized error rate, lower is better)

95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.

| Set | Qwen3-ASR (relaxed server VAD) |
|---|---|
| en-dictation | 10.3% [8.4%–12.5%] |
| en-dictation-noise | 5.6% [4.1%–7.1%] |

## Formatted accuracy (case and punctuation counted)

| Set | Qwen3-ASR (relaxed server VAD) |
|---|---|
| en-dictation | 15.9% |
| en-dictation-noise | 11.6% |

## Error types (share of reference words, all speech sets)

| Engine | Substitutions | Deletions | Insertions |
|---|---|---|---|
| Qwen3-ASR (relaxed server VAD) | 3.8% | 1.1% | 4.6% |

## Output on non-speech audio (lower is better)

Share of silence or noise-only clips where the engine returned any text.

| Set | Qwen3-ASR (relaxed server VAD) |
|---|---|
| nonspeech | 0.0% (0/10) |

## Latency (ms, every run)

Wait = end of audio to final transcript. Connect = time to open a session.

| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |
|---|---|---|---|---|---|
| Qwen3-ASR (relaxed server VAD) | 439 | 608 | 20541 | 27779 | 70 |

## Failures

| Engine | Dropped by client gate | Connection or timeout failures |
|---|---|---|
| Qwen3-ASR (relaxed server VAD) | 0 | 30 (en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation, en-dictation-noise, en-dictation-noise, en-dictation-noise) |

## Paired comparisons

Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.

| Set | Best | Other | Difference [95% interval] | p |
|---|---|---|---|---|

Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.

# Gemini vs Gemini Smart: same audio, 20 rounds

Each round plays the clip on both engines at the same moment. Wait = end of audio to final text.

| Clip | Length | Engine | Sessions | Failed | Wait p50 | Wait p90 | Min | Max | SD | Connect p50 | WER | Same text |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 048-google-docs | 9.90 s | gemini | 20 | 0 | 473 | 724 | 416 | 865 | 131 | 764 | 4.2% | 100% |
| 048-google-docs | 9.90 s | gemini-smart | 20 | 0 | 469 | 600 | 400 | 923 | 115 | 764 | 4.2% | 100% |
| 080-whatsapp | 45.40 s | gemini | 20 | 0 | 752 | 820 | 697 | 915 | 51 | 734 | 15.7% | 100% |
| 080-whatsapp | 45.40 s | gemini-smart | 20 | 0 | 753 | 845 | 657 | 1073 | 96 | 726 | 0.3% | 90% |
| 035-slack | 91.39 s | gemini | 20 | 0 | 1135 | 1294 | 1021 | 1554 | 123 | 754 | 4.2% | 95% |
| 035-slack | 91.39 s | gemini-smart | 20 | 0 | 1120 | 1262 | 1003 | 1590 | 127 | 717 | 3.2% | 100% |
| **All** |  | gemini | 60 | 0 | 769 | 1171 | 416 | 1554 | 281 | 751 |  |  |
| **All** |  | gemini-smart | 60 | 0 | 762 | 1138 | 400 | 1590 | 282 | 730 |  |  |

Paired (same clip, same moment), 60 pairs: Smart minus Gemini median -24 ms (p10 -158, p90 113); Smart faster in 33 of 60.

# Gemini vs Gemini Smart: same audio, 20 rounds

Each round plays the clip on both engines at the same moment. Wait = end of audio to final text.

| Clip | Length | Engine | Sessions | Failed | Wait p50 | Wait p90 | Min | Max | SD | Connect p50 | WER | Same text |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 048-google-docs | 9.90 s | gemini | 20 | 0 | 450 | 532 | 420 | 2676 | 483 | 801 | 4.2% | 100% |
| 048-google-docs | 9.90 s | gemini-smart | 20 | 0 | 500 | 673 | 406 | 2849 | 523 | 806 | 4.2% | 100% |
| 080-whatsapp | 45.40 s | gemini | 20 | 0 | 759 | 814 | 666 | 884 | 54 | 754 | 15.7% | 100% |
| 080-whatsapp | 45.40 s | gemini-smart | 20 | 0 | 708 | 766 | 639 | 788 | 45 | 786 | 0% | 100% |
| 035-slack | 91.39 s | gemini | 20 | 0 | 1091 | 1219 | 984 | 1278 | 82 | 776 | 4.1% | 100% |
| 035-slack | 91.39 s | gemini-smart | 20 | 0 | 1044 | 1155 | 982 | 1386 | 90 | 772 | 3.2% | 100% |
| **All** |  | gemini | 60 | 0 | 772 | 1156 | 420 | 2676 | 356 | 770 |  |  |
| **All** |  | gemini-smart | 60 | 0 | 716 | 1096 | 406 | 2849 | 364 | 778 |  |  |

Paired (same clip, same moment), 60 pairs: Smart minus Gemini median -17 ms (p10 -112, p90 111); Smart faster in 42 of 60.

# Two languages in one recording — 2026-10-21

A recording counts only if every engine gets each half right when that clip is played alone, so a lost language is caused by the switch.

## English plus another language

| Language setting | Fair recordings | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|---|---|---|---|---|---|
| Both languages selected | 85 | 26 of 85 (31%) | 54 of 85 (64%) | 33 of 85 (39%) | 39 of 85 (46%) | 27 of 85 (32%) | 39 of 85 (46%) | 4 of 85 (5%) | 75 of 85 (88%) |
| English only selected | 85 | 67 of 85 (79%) | 70 of 85 (82%) | 72 of 85 (85%) | 72 of 85 (85%) | 70 of 85 (82%) | 70 of 85 (82%) | 4 of 85 (5%) | 64 of 85 (75%) |
| Auto-detect | 85 | 28 of 85 (33%) | 51 of 85 (60%) | 36 of 85 (42%) | 40 of 85 (47%) | 28 of 85 (33%) | 40 of 85 (47%) | 3 of 85 (4%) | 75 of 85 (88%) |

Share of fair recordings where one language was lost (under 20% of its words in the transcript).

### Which half was lost

| Setting | Engine | English lost | Other language lost | First half lost | Second half lost |
|---|---|---|---|---|---|
| Both languages selected | Whisper Large V3 | 14 of 85 (16%) | 12 of 85 (14%) | 16 of 85 (19%) | 10 of 85 (12%) |
| Both languages selected | OpenAI Whisper-1 (split at pauses) | 35 of 85 (41%) | 22 of 85 (26%) | 16 of 85 (19%) | 41 of 85 (48%) |
| Both languages selected | Whisper Self-Hosted | 12 of 85 (14%) | 21 of 85 (25%) | 21 of 85 (25%) | 12 of 85 (14%) |
| Both languages selected | Whisper Self-Hosted (VAD drops audio) | 20 of 85 (24%) | 19 of 85 (22%) | 26 of 85 (31%) | 13 of 85 (15%) |
| Both languages selected | Whisper Self-Hosted (TEN VAD) | 8 of 85 (9%) | 19 of 85 (22%) | 17 of 85 (20%) | 10 of 85 (12%) |
| Both languages selected | Whisper Self-Hosted (TEN VAD drops audio) | 16 of 85 (19%) | 23 of 85 (27%) | 26 of 85 (31%) | 13 of 85 (15%) |
| Both languages selected | OpenAI GPT-Realtime-Whisper | 1 of 85 (1%) | 3 of 85 (4%) | 1 of 85 (1%) | 3 of 85 (4%) |
| Both languages selected | OpenAI Whisper-1 | 68 of 85 (80%) | 17 of 85 (20%) | 33 of 85 (39%) | 52 of 85 (61%) |
| English only selected | Whisper Large V3 | 2 of 85 (2%) | 66 of 85 (78%) | 38 of 85 (45%) | 30 of 85 (35%) |
| English only selected | OpenAI Whisper-1 (split at pauses) | 4 of 85 (5%) | 70 of 85 (82%) | 35 of 85 (41%) | 39 of 85 (46%) |
| English only selected | Whisper Self-Hosted | 1 of 85 (1%) | 71 of 85 (84%) | 39 of 85 (46%) | 33 of 85 (39%) |
| English only selected | Whisper Self-Hosted (VAD drops audio) | 6 of 85 (7%) | 71 of 85 (84%) | 40 of 85 (47%) | 37 of 85 (44%) |
| English only selected | Whisper Self-Hosted (TEN VAD) | 1 of 85 (1%) | 69 of 85 (81%) | 38 of 85 (45%) | 32 of 85 (38%) |
| English only selected | Whisper Self-Hosted (TEN VAD drops audio) | 6 of 85 (7%) | 69 of 85 (81%) | 43 of 85 (51%) | 32 of 85 (38%) |
| English only selected | OpenAI GPT-Realtime-Whisper | 0 of 85 (0%) | 4 of 85 (5%) | 1 of 85 (1%) | 3 of 85 (4%) |
| English only selected | OpenAI Whisper-1 | 24 of 85 (28%) | 64 of 85 (75%) | 34 of 85 (40%) | 54 of 85 (64%) |
| Auto-detect | Whisper Large V3 | 14 of 85 (16%) | 14 of 85 (16%) | 18 of 85 (21%) | 10 of 85 (12%) |
| Auto-detect | OpenAI Whisper-1 (split at pauses) | 32 of 85 (38%) | 22 of 85 (26%) | 16 of 85 (19%) | 38 of 85 (45%) |
| Auto-detect | Whisper Self-Hosted | 12 of 85 (14%) | 24 of 85 (28%) | 23 of 85 (27%) | 13 of 85 (15%) |
| Auto-detect | Whisper Self-Hosted (VAD drops audio) | 20 of 85 (24%) | 21 of 85 (25%) | 27 of 85 (32%) | 14 of 85 (16%) |
| Auto-detect | Whisper Self-Hosted (TEN VAD) | 8 of 85 (9%) | 20 of 85 (24%) | 17 of 85 (20%) | 11 of 85 (13%) |
| Auto-detect | Whisper Self-Hosted (TEN VAD drops audio) | 16 of 85 (19%) | 25 of 85 (29%) | 28 of 85 (33%) | 13 of 85 (15%) |
| Auto-detect | OpenAI GPT-Realtime-Whisper | 0 of 85 (0%) | 3 of 85 (4%) | 1 of 85 (1%) | 2 of 85 (2%) |
| Auto-detect | OpenAI Whisper-1 | 68 of 85 (80%) | 17 of 85 (20%) | 33 of 85 (39%) | 52 of 85 (61%) |

### By language (Both languages selected)

| Language | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|---|---|---|---|---|
| Arabic | 11 of 20 (55%) | 18 of 20 (90%) | 8 of 20 (40%) | 8 of 20 (40%) | 6 of 20 (30%) | 8 of 20 (40%) | 2 of 20 (10%) | 20 of 20 (100%) |
| French | 3 of 10 (30%) | 6 of 10 (60%) | 2 of 10 (20%) | 5 of 10 (50%) | 2 of 10 (20%) | 4 of 10 (40%) | 0 of 10 (0%) | 9 of 10 (90%) |
| German | 1 of 10 (10%) | 4 of 10 (40%) | 2 of 10 (20%) | 1 of 10 (10%) | 1 of 10 (10%) | 3 of 10 (30%) | 0 of 10 (0%) | 9 of 10 (90%) |
| Hindi | 1 of 7 (14%) | 6 of 7 (86%) | 5 of 7 (71%) | 5 of 7 (71%) | 4 of 7 (57%) | 5 of 7 (71%) | 1 of 7 (14%) | 6 of 7 (86%) |
| Mandarin | 5 of 10 (50%) | 5 of 10 (50%) | 4 of 10 (40%) | 5 of 10 (50%) | 3 of 10 (30%) | 4 of 10 (40%) | 1 of 10 (10%) | 9 of 10 (90%) |
| Spanish | 5 of 28 (18%) | 15 of 28 (54%) | 12 of 28 (43%) | 15 of 28 (54%) | 11 of 28 (39%) | 15 of 28 (54%) | 0 of 28 (0%) | 22 of 28 (79%) |

## Two languages, neither English

| Language setting | Fair recordings | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|---|---|---|---|---|---|
| Both languages selected | 232 | 127 of 232 (55%) | 204 of 232 (88%) | 201 of 232 (87%) | 225 of 232 (97%) | 218 of 232 (94%) | 225 of 232 (97%) | 10 of 232 (4%) | 215 of 232 (93%) |
| Auto-detect | 232 | 132 of 232 (57%) | 205 of 232 (88%) | 202 of 232 (87%) | 227 of 232 (98%) | 218 of 232 (94%) | 225 of 232 (97%) | 12 of 232 (5%) | 215 of 232 (93%) |

Share of fair recordings where one language was lost (under 20% of its words in the transcript).

### By language (Both languages selected)

| Language | Whisper Large V3 | OpenAI Whisper-1 (split at pauses) | Whisper Self-Hosted | Whisper Self-Hosted (VAD drops audio) | Whisper Self-Hosted (TEN VAD) | Whisper Self-Hosted (TEN VAD drops audio) | OpenAI GPT-Realtime-Whisper | OpenAI Whisper-1 |
|---|---|---|---|---|---|---|---|---|
| Arabic + French | 6 of 13 (46%) | 12 of 13 (92%) | 12 of 13 (92%) | 12 of 13 (92%) | 13 of 13 (100%) | 13 of 13 (100%) | 2 of 13 (15%) | 13 of 13 (100%) |
| Arabic + German | 7 of 12 (58%) | 11 of 12 (92%) | 7 of 12 (58%) | 10 of 12 (83%) | 10 of 12 (83%) | 10 of 12 (83%) | 2 of 12 (17%) | 12 of 12 (100%) |
| Arabic + Hindi | 2 of 7 (29%) | 7 of 7 (100%) | 7 of 7 (100%) | 7 of 7 (100%) | 7 of 7 (100%) | 7 of 7 (100%) | 1 of 7 (14%) | 7 of 7 (100%) |
| Arabic + Mandarin | 4 of 11 (36%) | 10 of 11 (91%) | 9 of 11 (82%) | 10 of 11 (91%) | 11 of 11 (100%) | 11 of 11 (100%) | 0 of 11 (0%) | 11 of 11 (100%) |
| Arabic + Spanish | 5 of 14 (36%) | 14 of 14 (100%) | 12 of 14 (86%) | 12 of 14 (86%) | 12 of 14 (86%) | 13 of 14 (93%) | 2 of 14 (14%) | 14 of 14 (100%) |
| French + German | 14 of 20 (70%) | 17 of 20 (85%) | 18 of 20 (90%) | 20 of 20 (100%) | 18 of 20 (90%) | 20 of 20 (100%) | 0 of 20 (0%) | 17 of 20 (85%) |
| French + Hindi | 9 of 15 (60%) | 15 of 15 (100%) | 13 of 15 (87%) | 15 of 15 (100%) | 15 of 15 (100%) | 15 of 15 (100%) | 1 of 15 (7%) | 15 of 15 (100%) |
| French + Mandarin | 11 of 20 (55%) | 17 of 20 (85%) | 17 of 20 (85%) | 20 of 20 (100%) | 19 of 20 (95%) | 19 of 20 (95%) | 0 of 20 (0%) | 19 of 20 (95%) |
| French + Spanish | 9 of 20 (45%) | 12 of 20 (60%) | 17 of 20 (85%) | 19 of 20 (95%) | 18 of 20 (90%) | 19 of 20 (95%) | 0 of 20 (0%) | 13 of 20 (65%) |
| German + Hindi | 9 of 15 (60%) | 15 of 15 (100%) | 11 of 15 (73%) | 15 of 15 (100%) | 13 of 15 (87%) | 15 of 15 (100%) | 0 of 15 (0%) | 15 of 15 (100%) |
| German + Mandarin | 15 of 20 (75%) | 15 of 20 (75%) | 16 of 20 (80%) | 20 of 20 (100%) | 20 of 20 (100%) | 20 of 20 (100%) | 0 of 20 (0%) | 19 of 20 (95%) |
| German + Spanish | 11 of 18 (61%) | 14 of 18 (78%) | 16 of 18 (89%) | 18 of 18 (100%) | 16 of 18 (89%) | 16 of 18 (89%) | 0 of 18 (0%) | 14 of 18 (78%) |
| Hindi + Mandarin | 7 of 15 (47%) | 15 of 15 (100%) | 15 of 15 (100%) | 15 of 15 (100%) | 14 of 15 (93%) | 15 of 15 (100%) | 1 of 15 (7%) | 15 of 15 (100%) |
| Hindi + Spanish | 7 of 14 (50%) | 14 of 14 (100%) | 14 of 14 (100%) | 14 of 14 (100%) | 14 of 14 (100%) | 14 of 14 (100%) | 1 of 14 (7%) | 14 of 14 (100%) |
| Mandarin + Spanish | 11 of 18 (61%) | 16 of 18 (89%) | 17 of 18 (94%) | 18 of 18 (100%) | 18 of 18 (100%) | 18 of 18 (100%) | 0 of 18 (0%) | 17 of 18 (94%) |

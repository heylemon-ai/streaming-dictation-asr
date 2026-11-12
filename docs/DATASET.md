# Dataset

What each test set contains. The in-house English recordings, both of their
references and every tested system's transcripts are released at
[huggingface.co/datasets/hey-lemon/streaming-dictation-asr](https://huggingface.co/datasets/hey-lemon/streaming-dictation-asr)
under CC BY 4.0, together with every system's per-clip output, the list of
public language clips used (`data/third-party-clips.tsv`) and the two-language
recipe (`data/codeswitch/mixes.tsv`). The audio of the public language clips,
EARS and VOiCES is not redistributed; the per-clip outputs of those runs include
their reference text, which stays under each dataset's own licence.

## In-house English recordings

106 messages written to resemble chat, email, notes and prompts to AI
assistants, read aloud by one speaker, a member of our team, who consented to
their public release. Each message was recorded once, in one condition, on a
laptop microphone. The reader deliberately moved between US, South Asian,
British and Irish English, often within a message.

| Set | Clips | Audio | Script words | Description |
|---|---|---|---|---|
| en-dictation | 73 | 61.6 min | 8,324 | Read in a quiet room. 10–177 s per clip. |
| en-dictation-noise | 17 | 8.7 min | 1,039 | Read with a fan running nearby. |
| en-dictation-whisper | 16 | 11.1 min | 1,264 | Whispered. |

The three sets contain different messages. Each message has two references:
the script the reader was given, and a record of what was actually said (the spoken reference),
which differs from the script in 85 of the 106 messages.

## Clips drawn from public datasets

20 short clips per set, 3–9 s each.

| Set | Language | Source |
|---|---|---|
| ar-eg | Arabic, Modern Standard (Egyptian speakers) | FLEURS |
| ar-sa | Arabic, Saudi (12 Najdi, 8 Hijazi clips) | SADA |
| ar-ae | Arabic, Emirati | Casablanca |
| de-de | German | FLEURS |
| es-419 | Spanish, Latin American | FLEURS |
| es-es | Spanish, Spain (European Parliament speech) | VoxPopuli |
| es-pr | Spanish, Puerto Rico | OpenSLR SLR74 |
| fr-fr | French | FLEURS |
| hi-in | Hindi | FLEURS |
| ur-pk | Urdu | FLEURS |
| zh-cn | Mandarin Chinese | FLEURS |

## Generated

| Set | Clips | Description |
|---|---|---|
| nonspeech | 10 | Digital silence (3, 10, 30 s), pink room noise at three levels, mains hum at 50/60/120 Hz, and a louder noise burst. Generated deterministically by `scripts/make-nonspeech.ts`. |
| codeswitch | 400 | Two-language recordings built from the clips above by `scripts/make-codeswitch.ts`: 100 English plus another language, 300 pairs of non-English languages. |

## External corpora

Fetched from their sources into `data-external/` (see
[`data-external/README.md`](../data-external/README.md)) and scored
separately from the sets above.

| Set | Clips | Description |
|---|---|---|
| EARS | 2 × 428 | 107 speakers reading parts 1–4 of the Rainbow Passage, normally and whispered, in an anechoic studio (CC BY-NC 4.0). |
| VOiCES | 4 × 100 | 100 LibriSpeech sentences, one per speaker: the clean original, and recorded by a far microphone in one room with no background sound, with babble and with a television (CC BY 4.0). |

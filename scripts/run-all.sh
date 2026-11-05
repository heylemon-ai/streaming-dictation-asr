#!/usr/bin/env bash
# Runs every system on every dataset, each data root on its own, so third-party audio never mixes with ours.
#
#   scripts/run-all.sh [--family]        (--family also runs the other Whisper setups of the paper's Whisper guide)
#
# Data roots (see data-external/README.md):
#   data/                  our own recordings and the public language clips   -> results/<date>-all
#   data-external/ears     EARS, whispered and normal, 107 speakers            -> results/<date>-ears
#   data-external/voices   VOiCES, clean / far / far+babble / far+TV, 100 spk  -> results/<date>-voices
# Finished sessions are cached (cache/results.json), so re-running only plays what is missing.
# Qwen and gated Whisper need their Baseten deployments switched on; otherwise the runner skips them.
set -euo pipefail
cd "$(dirname "$0")/.."

MAIN=whisper-self-hosted,qwen,meta,gemini,gemini-smart,deepgram,assemblyai-3-6-pro,assemblyai-3-5-pro,zoom-scribe,elevenlabs-scribe,elevenlabs-scribe-clean,openai-live-transcribe-low,openai-realtime-whisper
FAMILY=whisper,whisper-self-hosted-vad,whisper-self-hosted-ten,whisper-self-hosted-ten-vad,openai-whisper-1,openai-whisper-1-split
ENGINES=$MAIN
[[ "${1:-}" == "--family" ]] && ENGINES=$MAIN,$FAMILY

npm run run -- --engines "$ENGINES" --concurrency 12 --label all
for root in ears voices; do
  if [[ -f "data-external/$root/manifest.tsv" ]]; then
    ASR_DATA="data-external/$root" npm run run -- --engines "$ENGINES" --concurrency 12 --label "$root"
  else
    echo "skipping $root: no data-external/$root/manifest.tsv (run its fetch and build scripts first)"
  fi
done

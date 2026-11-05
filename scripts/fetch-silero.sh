#!/usr/bin/env bash
# Downloads the open Silero VAD model (MIT licence) used by the client VAD gate.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p models
URL="https://github.com/snakers4/silero-vad/raw/master/src/silero_vad/data/silero_vad.onnx"
curl -fL "$URL" -o models/silero_vad.onnx
echo "models/silero_vad.onnx ($(wc -c < models/silero_vad.onnx) bytes)"

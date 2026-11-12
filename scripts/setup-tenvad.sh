#!/bin/sh
# Installs TEN VAD (github.com/TEN-framework/ten-vad, Apache 2.0) into .venv-tenvad/,
# used by src/audio/tenvad.ts through scripts/tenvad_server.py.
set -e
cd "$(dirname "$0")/.."
python3 -m venv .venv-tenvad
.venv-tenvad/bin/pip install -q --upgrade pip
.venv-tenvad/bin/pip install -q numpy "git+https://github.com/TEN-framework/ten-vad.git"
.venv-tenvad/bin/python -c "import ten_vad; print('TEN VAD ready')"

#!/bin/sh
# Walk the Crossy Road score smoke. Starts Vite on :5175 when it is down.
# 5173 is Marooned's Vite in this workspace.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$ROOT"
PORT=5175

STARTED=0
if ! curl -sf -o /dev/null --max-time 2 "http://localhost:${PORT}/"; then
  npx vite --port "$PORT" --strictPort >/tmp/crossy-road-vite.log 2>&1 &
  STARTED=$!
  ready=0
  i=0
  while [ "$i" -lt 40 ]; do
    if curl -sf -o /dev/null --max-time 1 "http://localhost:${PORT}/"; then
      ready=1
      break
    fi
    i=$((i + 1))
    sleep 0.5
  done
  if [ "$ready" -ne 1 ]; then
    echo "Vite did not answer on http://localhost:${PORT}" >&2
    kill "$STARTED" 2>/dev/null || true
    exit 1
  fi
fi

cleanup() {
  if [ "$STARTED" != 0 ]; then
    kill "$STARTED" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "── qa/flows/smoke-score.yml"
# The Google session is a local file, never git. Without it the popup asks for
# an email and the walk cannot finish. Validate, and walk once the session exists.
if [ ! -s "$ROOT/tmp/kaloko/.auth/local/player.json" ]; then
  echo "No saved test Gmail session at tmp/kaloko/.auth/local/player.json"
  echo "Sign in once, then rerun: npx kaloko auth save --env local --account player"
  npx kaloko validate qa/flows/smoke-score.yml
  exit $?
fi
npx kaloko start --scenario qa/flows/smoke-score.yml --env local
npx kaloko walk
npx kaloko evaluate

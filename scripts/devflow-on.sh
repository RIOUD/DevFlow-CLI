#!/usr/bin/env bash

# Source this file from a repo that contains test-vibe.js.
# Example:
#   source scripts/devflow-on.sh

if [ ! -f "./test-vibe.js" ]; then
  echo "DevFlow not found in this folder."
  echo "Expected: ./test-vibe.js"
  echo "Tip: run this inside a DevFlow-enabled repo."
  return 1 2>/dev/null || exit 1
fi

alias df='node ./test-vibe.js'

echo "DevFlow is active in this terminal."
echo "Use Mistral with: vibe"
echo "Use DevFlow with: df @doctor"

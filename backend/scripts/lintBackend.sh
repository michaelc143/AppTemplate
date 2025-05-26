#!/bin/bash
# Lint and test the code
# Usage: ./lintAndTest.sh
# This script runs the linter and tests the code.

# Get the directory of the current script
SCRIPT_DIR=$(dirname "$0")
ROOT_DIR=$(realpath "$SCRIPT_DIR/..")

# Check if package.json exists in the root directory
if [ ! -f "$ROOT_DIR/.pylintrc" ]; then
  echo "package.json not found in the root directory: $ROOT_DIR"
  exit 1
fi

# Change to the root directory
cd "$ROOT_DIR" || exit

# Run the linter
echo "Running backend linter..."
pylint **/*.py --rcfile=.pylintrc
#!/bin/bash
# Lint and test the code
# Usage: ./lintAndTest.sh
# This script runs the linter and tests the code.

# Get the directory of the current script
SCRIPT_DIR=$(dirname "$0")
ROOT_DIR=$(realpath "$SCRIPT_DIR/..")

# Start the backend compose
docker compose -f "$ROOT_DIR/../compose-backend.yml" up -d --build

# Check if package.json exists in the root directory
if [ ! -f "$ROOT_DIR/package.json" ]; then
  echo "package.json not found in the root directory: $ROOT_DIR"
  exit 1
fi

# Change to the root directory
cd "$ROOT_DIR" || exit

# Run the linter
echo "Running frontend..."
npm run start
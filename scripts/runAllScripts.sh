# Script to run all scripts in the project
# Usage: ./runAllScripts.sh
# This script runs all scripts in the project.
# It is assumed that the scripts are executable.
#!/bin/bash
../backend/scripts/lintBackend.sh
../frontend/scripts/lintAndTest.sh
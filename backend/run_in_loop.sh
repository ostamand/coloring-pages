#!/bin/bash

# This script executes a given command in a loop.
#
# Usage:
#   ./run_in_loop.sh "<command>" [iterations]
#
# Parameters:
#   command: The command to be executed. It should be enclosed in quotes to handle spaces and arguments correctly.
#   iterations: (Optional) The number of times the command should be executed. Defaults to 10 if not provided.

# Check if the command argument is provided.
if [ -z "$1" ]; then
    echo "Error: No command provided."
    echo "Usage: $0 \"<command>\" [iterations]"
    exit 1
fi

# The command to execute, passed as the first argument.
COMMAND_TO_RUN=$1

# The number of iterations, passed as the second argument.
# Defaults to 10 if not provided.
MAX_ITERATIONS=${2:-10}

echo "Starting loop to run command for $MAX_ITERATIONS iterations."
echo "Command: $COMMAND_TO_RUN"
echo "---"

for i in $(seq 1 $MAX_ITERATIONS)
do
    echo "Running iteration #$i of $MAX_ITERATIONS..."
    eval $COMMAND_TO_RUN
    echo "---"
done

echo "Loop finished after $MAX_ITERATIONS iterations."

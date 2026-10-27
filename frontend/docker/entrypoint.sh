#!/bin/bash
set -e

# Start Bun API server on port 3001 in background
echo "Starting Bun FlatCAM backend on port 3001..."
PORT=3001 bun run /app/server/index.ts &
BUN_PID=$!

# Trap signals and forward to child processes
trap "kill -TERM $BUN_PID" TERM INT

# Start Nginx in foreground
echo "Starting Nginx on port 80..."
nginx -g "daemon off;"

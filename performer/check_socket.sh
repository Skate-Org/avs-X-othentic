#!/bin/bash

# Path to the socket file
SOCKET_PATH="/tmp/performer_SkateKernel_logs.sock"

# Timeout in seconds
TIMEOUT=5
elapsed=0

while [ ! -S "$SOCKET_PATH" ]; do
  sleep 1
  elapsed=$((elapsed + 1))
  if [ $elapsed -ge $TIMEOUT ]; then
    echo "Timeout: Socket not created after $TIMEOUT seconds."
    exit 1
  fi
done

echo "Socket is available."
exit 0


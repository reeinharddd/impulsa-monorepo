#!/bin/bash

# Fix permissions for the current project directory
# Usage: ./scripts/fix-permissions.sh

echo "🔒 Fixing file permissions for project..."
echo "User: $USER"
echo "Group: $(id -gn)"

# Change ownership of all files to the current user (requires sudo if files are owned by root)
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  Some files might be owned by root (from Docker). You might need to enter your sudo password."
  sudo chown -R $(id -u):$(id -g) .
else
  chown -R $(id -u):$(id -g) .
fi

echo "✅ Permissions fixed!"

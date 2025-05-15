#!/bin/bash

# Print diagnostics information
echo "=== Build Environment ==="
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"
echo "Working Directory: $(pwd)"
echo "Files in Directory:"
ls -la
echo ""

echo "=== Available Commands ==="
echo "Checking for vite in path:"
which vite || echo "vite not found in PATH"
echo ""
echo "Checking node_modules bin:"
ls -la ./node_modules/.bin/ || echo "No bin directory found"
echo ""

echo "=== Checking package.json ==="
cat package.json

# Run the build
echo "=== Starting Build ==="
node build.js 
#!/usr/bin/env sh

cd /app

# Only install modules if they are not already installed:
[ ! -d "node_modules" ] && npm ci || echo "Node modules already installed skipping install."

npm run live
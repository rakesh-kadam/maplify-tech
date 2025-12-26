#!/bin/sh
set -e

echo "Running database migrations..."
npx --yes prisma@5.22.0 migrate deploy

echo "Starting DrawBoard API..."
exec node dist/index.js

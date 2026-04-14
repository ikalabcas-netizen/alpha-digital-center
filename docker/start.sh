#!/bin/sh
# Push database schema on startup (safe - only applies changes)
npx prisma db push --skip-generate 2>/dev/null || echo "Schema push skipped (no DB connection or already up to date)"

# Start Next.js
node server.js

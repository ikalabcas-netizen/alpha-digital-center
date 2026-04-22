#!/bin/sh
# Boot script — chạy tại container startup:
#   1. Chạy migrations-manual/*.sql qua psql (idempotent)
#   2. Chạy init-db.js (baseline)
#   3. Start Next.js server
# Không fail hard — dù migration nào lỗi, app vẫn khởi động (tránh crashloop).

set +e

MIGRATIONS_DIR="packages/database/migrations-manual"

if [ -n "$DATABASE_URL" ] && [ -d "$MIGRATIONS_DIR" ]; then
  echo "[boot] Applying manual migrations from $MIGRATIONS_DIR"
  for f in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
    echo "[boot] ▶ $f"
    if psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f" > /tmp/migrate.log 2>&1; then
      echo "[boot] ✓ OK $f"
    else
      echo "[boot] ✗ FAIL $f — log:"
      tail -30 /tmp/migrate.log
      echo "[boot] (continuing anyway)"
    fi
  done
else
  echo "[boot] Skipping manual migrations (DATABASE_URL unset or dir missing)"
fi

# Legacy baseline init
if [ -f "apps/website/scripts/init-db.js" ]; then
  node apps/website/scripts/init-db.js || true
fi

echo "[boot] Starting Next.js server..."
exec node apps/website/server.js

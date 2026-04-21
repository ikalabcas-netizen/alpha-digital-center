// Idempotent database initializer.
// Runs on container startup: reads prisma/init.sql and executes each statement
// via Prisma Client's $executeRawUnsafe. Swallows "already exists" errors so
// subsequent boots are no-ops.

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// PostgreSQL error codes we treat as "already applied"
const ALREADY_EXISTS_CODES = new Set([
  '42P07', // duplicate_table
  '42710', // duplicate_object (constraint, index when named)
  '42P06', // duplicate_schema
  '42701', // duplicate_column
  '42723', // duplicate_function
]);

function splitSqlStatements(sql) {
  // Strip SQL line comments, then split on ';' followed by newline.
  const cleaned = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  return cleaned
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  // Try monorepo path first (packages/database/prisma), fallback to legacy co-located path.
  const candidates = [
    path.join(__dirname, '..', '..', '..', 'packages', 'database', 'prisma', 'init.sql'), // monorepo runtime
    path.join(__dirname, '..', 'prisma', 'init.sql'),                                       // legacy/dev
  ];
  const sqlPath = candidates.find((p) => fs.existsSync(p));
  if (!sqlPath) {
    console.error(`[init-db] init.sql not found. Checked:\n  ${candidates.join('\n  ')}`);
    process.exit(0); // don't block app startup
  }
  console.log(`[init-db] Using ${sqlPath}`);

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = splitSqlStatements(sql);
  console.log(`[init-db] Executing ${statements.length} statements...`);

  const prisma = new PrismaClient();
  let applied = 0;
  let skipped = 0;

  try {
    await prisma.$connect();

    for (const stmt of statements) {
      try {
        await prisma.$executeRawUnsafe(stmt);
        applied++;
      } catch (err) {
        const code = err && err.code;
        const msg = (err && err.message) || String(err);
        if (ALREADY_EXISTS_CODES.has(code) || /already exists/i.test(msg)) {
          skipped++;
          continue;
        }
        console.error('[init-db] Statement failed:');
        console.error(stmt.slice(0, 200));
        console.error(msg);
        // Don't exit — keep going so partial schemas can still start the app.
      }
    }

    console.log(`[init-db] Done. applied=${applied} skipped=${skipped}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[init-db] Fatal error:', err);
  // Exit 0 so the server still tries to start — better than a crash loop.
  process.exit(0);
});

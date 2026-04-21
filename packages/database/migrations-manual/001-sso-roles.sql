-- ================================================================
-- Migration 001 — SSO role enum + isActive + LoginLog + CustomerProfile
-- ================================================================
-- Run this ONCE on the Coolify Postgres BEFORE deploying the Phase 2
-- branch to production. It is idempotent: safe to re-run (guards with
-- IF NOT EXISTS / DO blocks).
--
-- Apply via:
--   psql $DATABASE_URL -f 001-sso-roles.sql
-- Or paste into Coolify → Postgres → Terminal.
-- ================================================================

BEGIN;

-- 1. Create UserRole enum type (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    CREATE TYPE "UserRole" AS ENUM (
      'SUPER_ADMIN','ADMIN','EDITOR',
      'HR_MANAGER','EMPLOYEE','ACCOUNTANT','SALES',
      'CUSTOMER','PENDING','REJECTED'
    );
  END IF;
END $$;

-- 2. Migrate users.role from TEXT ('super_admin', ...) to UserRole enum.
DO $$
DECLARE
  col_type text;
BEGIN
  SELECT data_type INTO col_type FROM information_schema.columns
   WHERE table_name='users' AND column_name='role';

  IF col_type = 'text' OR col_type = 'character varying' THEN
    ALTER TABLE users ADD COLUMN role_new "UserRole";
    UPDATE users SET role_new = (CASE role
      WHEN 'super_admin' THEN 'SUPER_ADMIN'
      WHEN 'admin'       THEN 'ADMIN'
      WHEN 'editor'      THEN 'EDITOR'
      WHEN 'viewer'      THEN 'PENDING'   -- deprecated role, park as pending
      WHEN 'pending'     THEN 'PENDING'
      WHEN 'rejected'    THEN 'REJECTED'
      ELSE 'PENDING' END)::"UserRole";
    ALTER TABLE users DROP COLUMN role;
    ALTER TABLE users RENAME COLUMN role_new TO role;
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'PENDING';
    ALTER TABLE users ALTER COLUMN role SET NOT NULL;
  END IF;
END $$;

-- 3. Add is_active (false by default; activate existing staff roles).
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE users SET is_active = TRUE
  WHERE role IN ('SUPER_ADMIN','ADMIN','EDITOR')
    AND is_active = FALSE;

-- 4. Add phone (nullable).
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- 5. Add updated_at (backfill with created_at for existing rows).
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(3);
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- 6. login_logs table — audit every SSO login.
CREATE TABLE IF NOT EXISTS login_logs (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider    TEXT NOT NULL DEFAULT 'google',
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS login_logs_user_id_idx ON login_logs(user_id);

-- 7. customer_profiles table — extra B2B metadata for CUSTOMER role.
CREATE TABLE IF NOT EXISTS customer_profiles (
  id                 TEXT PRIMARY KEY,
  user_id            TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  lab_name           TEXT,
  tax_code           TEXT,
  city               TEXT,
  district           TEXT,
  address            TEXT,
  dentist_name       TEXT,
  source             TEXT,
  converted_lead_id  TEXT,
  created_at         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

-- ================================================================
-- Verification (run after to confirm data integrity):
--   SELECT role, is_active, COUNT(*) FROM users GROUP BY 1,2;
--   SELECT to_regtype('"UserRole"') IS NOT NULL;  -- true
--   SELECT COUNT(*) FROM login_logs;              -- 0 on first run
--   SELECT COUNT(*) FROM customer_profiles;       -- 0 on first run
-- ================================================================

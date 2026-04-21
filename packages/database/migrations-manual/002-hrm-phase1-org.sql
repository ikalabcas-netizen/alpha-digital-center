-- ================================================================
-- Migration 002 — HRM Phase 1: Organization (Departments/Positions/Employees)
-- ================================================================
-- Chạy SAU 001-sso-roles.sql. Idempotent — re-run an toàn.
--
-- Apply:
--   psql $DATABASE_URL -f 002-hrm-phase1-org.sql
-- ================================================================

BEGIN;

-- 1. hrm_departments — cây phòng ban (tự tham chiếu cha)
CREATE TABLE IF NOT EXISTS hrm_departments (
  id             TEXT PRIMARY KEY,
  code           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  description    TEXT,
  parent_id      TEXT,
  manager_id     TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FK self-reference (add only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
     WHERE table_name='hrm_departments' AND constraint_name='hrm_departments_parent_id_fkey'
  ) THEN
    ALTER TABLE hrm_departments
      ADD CONSTRAINT hrm_departments_parent_id_fkey
      FOREIGN KEY (parent_id) REFERENCES hrm_departments(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. hrm_positions — chức vụ gắn phòng ban
CREATE TABLE IF NOT EXISTS hrm_positions (
  id             TEXT PRIMARY KEY,
  department_id  TEXT NOT NULL REFERENCES hrm_departments(id),
  code           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  description    TEXT,
  level          INTEGER NOT NULL DEFAULT 1,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS hrm_positions_department_id_idx ON hrm_positions(department_id);

-- 3. hrm_employees — hồ sơ NV, 1:1 (nullable) với users
CREATE TABLE IF NOT EXISTS hrm_employees (
  id                   TEXT PRIMARY KEY,
  employee_code        TEXT NOT NULL UNIQUE,
  user_id              TEXT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  full_name            TEXT NOT NULL,
  dob                  DATE,
  gender               TEXT,
  phone                TEXT,
  personal_email       TEXT,
  work_email           TEXT NOT NULL UNIQUE,
  national_id          TEXT,
  address              TEXT,
  avatar_url           TEXT,
  department_id        TEXT NOT NULL REFERENCES hrm_departments(id),
  position_id          TEXT NOT NULL REFERENCES hrm_positions(id),
  manager_id           TEXT,
  hire_date            DATE NOT NULL,
  probation_end_date   DATE,
  termination_date     DATE,
  employment_status    TEXT NOT NULL DEFAULT 'probation',
  -- "probation" | "active" | "on_leave" | "terminated"
  employment_type      TEXT NOT NULL DEFAULT 'full_time',
  -- "full_time" | "part_time" | "contractor" | "intern"
  hr_role              TEXT NOT NULL DEFAULT 'employee',
  -- "hr_admin" | "hr_manager" | "manager" | "employee"
  note                 TEXT,
  created_at           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FK self-reference cho manager
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
     WHERE table_name='hrm_employees' AND constraint_name='hrm_employees_manager_id_fkey'
  ) THEN
    ALTER TABLE hrm_employees
      ADD CONSTRAINT hrm_employees_manager_id_fkey
      FOREIGN KEY (manager_id) REFERENCES hrm_employees(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS hrm_employees_department_id_idx ON hrm_employees(department_id);
CREATE INDEX IF NOT EXISTS hrm_employees_position_id_idx ON hrm_employees(position_id);
CREATE INDEX IF NOT EXISTS hrm_employees_manager_id_idx ON hrm_employees(manager_id);

COMMIT;

-- ================================================================
-- Verification:
--   SELECT COUNT(*) FROM hrm_departments; -- 0 on first run
--   SELECT COUNT(*) FROM hrm_positions;   -- 0 on first run
--   SELECT COUNT(*) FROM hrm_employees;   -- 0 on first run
--   \d hrm_employees                      -- inspect columns
-- ================================================================

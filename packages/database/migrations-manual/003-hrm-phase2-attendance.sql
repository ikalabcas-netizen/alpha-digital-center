-- ================================================================
-- Migration 003 — HRM Phase 2: Shifts + Attendance + Leave
-- ================================================================
-- Chạy SAU 002-hrm-phase1-org.sql. Idempotent — re-run an toàn.
--
-- Apply:
--   psql $DATABASE_URL -f 003-hrm-phase2-attendance.sql
-- ================================================================

BEGIN;

-- 1. hrm_shift_templates — mẫu ca làm
CREATE TABLE IF NOT EXISTS hrm_shift_templates (
  id              TEXT PRIMARY KEY,
  code            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  start_time      TEXT NOT NULL, -- "HH:mm"
  end_time        TEXT NOT NULL,
  break_minutes   INTEGER NOT NULL DEFAULT 60,
  shift_type      TEXT NOT NULL DEFAULT 'day', -- "day"|"night"|"flexible"
  late_after_min  INTEGER NOT NULL DEFAULT 15,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. hrm_shift_assignments — NV × ngày → mẫu ca
CREATE TABLE IF NOT EXISTS hrm_shift_assignments (
  id           TEXT PRIMARY KEY,
  employee_id  TEXT NOT NULL REFERENCES hrm_employees(id) ON DELETE CASCADE,
  template_id  TEXT NOT NULL REFERENCES hrm_shift_templates(id),
  work_date    DATE NOT NULL,
  note         TEXT,
  created_at   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT hrm_shift_assignments_employee_date_unique UNIQUE (employee_id, work_date)
);
CREATE INDEX IF NOT EXISTS hrm_shift_assignments_work_date_idx ON hrm_shift_assignments(work_date);

-- 3. hrm_attendances — chấm công (GPS + IP + status)
CREATE TABLE IF NOT EXISTS hrm_attendances (
  id             TEXT PRIMARY KEY,
  employee_id    TEXT NOT NULL REFERENCES hrm_employees(id) ON DELETE CASCADE,
  work_date      DATE NOT NULL,
  clock_in_at    TIMESTAMP(3),
  clock_out_at   TIMESTAMP(3),
  clock_in_lat   DOUBLE PRECISION,
  clock_in_lng   DOUBLE PRECISION,
  clock_in_ip    TEXT,
  clock_out_lat  DOUBLE PRECISION,
  clock_out_lng  DOUBLE PRECISION,
  clock_out_ip   TEXT,
  status         TEXT NOT NULL DEFAULT 'present',
  -- "present"|"late"|"absent"|"half_day"|"remote"
  work_minutes   INTEGER,
  note           TEXT,
  created_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT hrm_attendances_employee_date_unique UNIQUE (employee_id, work_date)
);
CREATE INDEX IF NOT EXISTS hrm_attendances_work_date_idx ON hrm_attendances(work_date);

-- 4. hrm_leave_requests — đơn nghỉ phép + workflow duyệt
CREATE TABLE IF NOT EXISTS hrm_leave_requests (
  id              TEXT PRIMARY KEY,
  employee_id     TEXT NOT NULL REFERENCES hrm_employees(id) ON DELETE CASCADE,
  leave_type      TEXT NOT NULL,
  -- "annual"|"sick"|"unpaid"|"maternity"|"wedding"|"bereavement"|"other"
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  total_days      DOUBLE PRECISION NOT NULL,
  reason          TEXT,
  attachment_url  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  -- "pending"|"approved"|"rejected"|"cancelled"
  approver_id     TEXT REFERENCES hrm_employees(id) ON DELETE SET NULL,
  approved_at     TIMESTAMP(3),
  reject_reason   TEXT,
  created_at      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS hrm_leave_requests_employee_status_idx ON hrm_leave_requests(employee_id, status);
CREATE INDEX IF NOT EXISTS hrm_leave_requests_date_range_idx ON hrm_leave_requests(start_date, end_date);

COMMIT;

-- ================================================================
-- Verification:
--   SELECT COUNT(*) FROM hrm_shift_templates;   -- 0 on first run
--   SELECT COUNT(*) FROM hrm_shift_assignments; -- 0 on first run
--   SELECT COUNT(*) FROM hrm_attendances;       -- 0 on first run
--   SELECT COUNT(*) FROM hrm_leave_requests;    -- 0 on first run
-- ================================================================

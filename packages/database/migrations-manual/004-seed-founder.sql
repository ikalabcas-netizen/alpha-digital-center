-- ================================================================
-- Migration 004 — Seed founder HR Admin + BGD dept + CEO position
-- ================================================================
-- Chạy SAU 003. Idempotent: chỉ insert nếu chưa có; chỉ link user_id
-- nếu user vuvanthanh1986@gmail.com đã đăng nhập (tồn tại trong users).
--
-- Apply:
--   psql $DATABASE_URL -f 004-seed-founder.sql
-- ================================================================

BEGIN;

-- 1. Phòng Ban Giám đốc
INSERT INTO hrm_departments (id, code, name, display_order, is_active)
VALUES (gen_random_uuid()::text, 'BGD', 'Ban Giám đốc', 1, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 2. Chức vụ Tổng Giám đốc
INSERT INTO hrm_positions (id, code, title, department_id, level, is_active)
SELECT gen_random_uuid()::text, 'CEO', 'Tổng Giám đốc', d.id, 5, TRUE
FROM hrm_departments d WHERE d.code = 'BGD'
ON CONFLICT (code) DO NOTHING;

-- 3. Founder employee (link với User nếu đã đăng nhập Google)
INSERT INTO hrm_employees (
  id, employee_code, user_id, full_name, work_email,
  department_id, position_id,
  hire_date, employment_status, employment_type, hr_role
)
SELECT
  gen_random_uuid()::text,
  'ADC-0001',
  u.id,                                   -- NULL nếu founder chưa login
  'Vũ Văn Thanh',
  'vuvanthanh1986@gmail.com',
  d.id, p.id,
  DATE '2020-01-01',
  'active',
  'full_time',
  'hr_admin'
FROM hrm_departments d
JOIN hrm_positions p ON p.code = 'CEO' AND p.department_id = d.id
LEFT JOIN users u ON u.email = 'vuvanthanh1986@gmail.com'
WHERE d.code = 'BGD'
ON CONFLICT (work_email) DO UPDATE
  SET user_id = COALESCE(hrm_employees.user_id, EXCLUDED.user_id),
      hr_role = 'hr_admin',
      employment_status = 'active';

-- 4. Nếu founder sau này mới login (user_id hiện đang NULL) → re-link
UPDATE hrm_employees e
SET user_id = u.id
FROM users u
WHERE e.work_email = u.email
  AND e.user_id IS NULL;

COMMIT;

-- ================================================================
-- Verification:
--   SELECT e.employee_code, e.full_name, e.hr_role, e.user_id,
--          d.name AS dept, p.title AS position
--     FROM hrm_employees e
--     JOIN hrm_departments d ON d.id = e.department_id
--     JOIN hrm_positions p ON p.id = e.position_id
--    WHERE e.work_email = 'vuvanthanh1986@gmail.com';
-- ================================================================

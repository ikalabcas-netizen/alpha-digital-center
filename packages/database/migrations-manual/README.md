# Manual SQL Migrations — ADC

Quy trình deploy schema mới lên production Postgres trên Coolify.
Các file được thiết kế idempotent — re-run an toàn.

## Thứ tự chạy

```
001-sso-roles.sql            — UserRole enum + LoginLog + CustomerProfile (Phase 2 SSO)
002-hrm-phase1-org.sql       — hrm_departments / hrm_positions / hrm_employees
003-hrm-phase2-attendance.sql — hrm_shift_templates / hrm_shift_assignments /
                                 hrm_attendances / hrm_leave_requests
```

**Luôn backup DB trước khi chạy 001** (ALTER TYPE enum không rollback dễ).

## Cách chạy trên Coolify

### Option 1 — Coolify UI (khuyến nghị, không cần SSH)

1. Vào https://{COOLIFY_HOST}/project/{project_uuid} → chọn database `adc-marketing-db`
2. Tab **Terminal** (hoặc **Execute Command**)
3. Paste lần lượt nội dung 3 file SQL (chạy từng file một, verify output trước khi sang file tiếp theo)
4. Sau mỗi file, chạy 2-3 câu `SELECT` ở cuối file để verify

### Option 2 — Qua psql từ VPS (nếu có SSH)

```bash
# SSH vào VPS
ssh root@89.167.61.19

# Copy file SQL vào container, chạy qua psql
docker cp 001-sso-roles.sql <db-container-name>:/tmp/
docker exec -it <db-container-name> psql -U adc_admin -d adc_marketing -f /tmp/001-sso-roles.sql

# Lặp cho 002, 003
```

### Option 3 — Port-forward về local

```bash
# Setup SSH tunnel
ssh -L 5433:localhost:<coolify-postgres-port> root@89.167.61.19 -N &

# Chạy từ máy local
psql "postgres://adc_admin:ADC_Mk2026_Secure!@localhost:5433/adc_marketing" -f 001-sso-roles.sql
psql "postgres://adc_admin:ADC_Mk2026_Secure!@localhost:5433/adc_marketing" -f 002-hrm-phase1-org.sql
psql "postgres://adc_admin:ADC_Mk2026_Secure!@localhost:5433/adc_marketing" -f 003-hrm-phase2-attendance.sql
```

## Verify sau migration

Mỗi file có phần verification ở cuối. Chạy nhanh check tổng:

```sql
-- Enum đã tồn tại
SELECT to_regtype('"UserRole"') IS NOT NULL;  -- t

-- User đã chuyển qua enum
SELECT role, is_active, COUNT(*) FROM users GROUP BY 1,2;

-- HRM tables
SELECT COUNT(*) FROM hrm_departments;
SELECT COUNT(*) FROM hrm_employees;
SELECT COUNT(*) FROM hrm_attendances;
SELECT COUNT(*) FROM hrm_leave_requests;
```

## Sau khi migrate DB xong

1. Set env vars trên Coolify app `adc-marketing` (xem ENV section dưới)
2. Redeploy app
3. Chạy seed: `pnpm --filter @adc/database exec tsx prisma/seed-hrm.ts` với `DATABASE_URL` trỏ prod
   (hoặc login site với founder → HR Admin tự tạo sau khi seed)

## ENV mới cần set trên Coolify

| Key | Giá trị ví dụ | Ghi chú |
|---|---|---|
| `NEXT_PUBLIC_ID_URL` | `https://id.alphacenter.vn/login` | Chưa có → để trống, middleware sẽ 401 |
| `OFFICE_GEOFENCES` | `10.802866,106.644254,ALPHA_HCM` | Format `lat,lng[,radius][,name]` (default 150m); multi-office: `;` |
| `OFFICE_IPS` | `115.78.234.109` | Bare IP = `/32`, hoặc CIDR; nhiều giá trị cách bằng `,` |

Các env cũ giữ nguyên: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_ALLOWED_EMAILS`, `DB_SETUP_KEY`.

# Deploy SSO — Coolify runbook (Phase 4)

Hướng dẫn deploy monorepo ADC (website + id) trên **Coolify project "Alpha Digital Center" hiện có**. Không tạo project mới, không tạo Postgres mới.

Sau khi chạy hết runbook này, flow chuẩn sẽ là:
1. User truy cập `https://alphacenter.vn/admin` → middleware redirect về `https://id.alphacenter.vn/?callbackUrl=…`
2. Login Google trên id. → tạo user `PENDING` (hoặc `SUPER_ADMIN` nếu email là `vuvanthanh1986@gmail.com`)
3. id. redirect sang `/dashboard` với app launcher 3 card (Marketing · HRM · Customer)
4. Click "Quản trị Marketing" → về `alphacenter.vn/admin` với session valid nhờ cookie `.alphacenter.vn` share được

---

## Bước 1 — SQL migration (tự động qua boot.sh)

`apps/website/scripts/boot.sh` tự chạy mọi file `.sql` trong `packages/database/migrations-manual/` theo thứ tự khi container khởi động (idempotent, re-run an toàn). Migration sẽ được áp ngay khi website redeploy ở Bước 8.

**Chỉ cần làm thủ công nếu:**
- Muốn dry-run trước khi deploy để confirm không có data lạ.
- Muốn migration apply trước khi id. khởi động (thay vì chờ website bật lên trước).

Để chạy thủ công: Coolify → project → Postgres resource → **Terminal** → paste nội dung file [`packages/database/migrations-manual/001-sso-roles.sql`](../packages/database/migrations-manual/001-sso-roles.sql).

Verify sau khi chạy (thủ công hoặc qua boot.sh):
```sql
SELECT role, is_active, COUNT(*) FROM users GROUP BY 1,2;
-- Kết quả: SUPER_ADMIN|t|1, các admin/editor cũ đã is_active=t
SELECT to_regtype('"UserRole"');  -- phải = "UserRole"
```

---

## Bước 2 — Google OAuth client mới cho `id.alphacenter.vn`

1. Google Cloud Console → APIs & Services → Credentials.
2. **Create Credentials → OAuth client ID → Web application**:
   - Name: `Alpha Digital Center ID`
   - Authorized JavaScript origins: `https://id.alphacenter.vn`
   - Authorized redirect URIs: `https://id.alphacenter.vn/api/auth/callback/google`
3. Copy **Client ID** + **Client Secret** — sẽ paste vào Coolify ở Bước 4.
4. **Không xóa** OAuth client cũ của website; nó vẫn phục vụ redirect URI `alphacenter.vn/api/auth/callback/google` cho kịch bản fallback (nhưng sẽ không còn được sử dụng sau khi SSO live).

---

## Bước 3 — DNS cho `id.alphacenter.vn`

Cloudflare → zone `alphacenter.vn`:
- Type: `A` hoặc `CNAME` tuỳ hạ tầng VPS
- Name: `id`
- Target: IP VPS Coolify (hoặc CNAME tới VPS host)
- Proxy status: **DNS only** (grey cloud) — để Traefik của Coolify tự cấp SSL Let's Encrypt. Nếu để Proxy (orange), bật "Full (strict)" SSL mode.

Chờ DNS propagate (thường ~1 phút) rồi:
```bash
dig id.alphacenter.vn +short    # phải ra IP VPS
```

---

## Bước 4 — Environment variables (Project-level)

Trong Coolify → project "Alpha Digital Center" → **Environment Variables** (tab project, không phải per-application). Set các biến sau để cả `website`, `id` (và tương lai `noibo`) cùng nhận:

| Key | Value | Ghi chú |
|---|---|---|
| `DATABASE_URL` | connection string Postgres hiện có | Giữ nguyên, đừng đổi |
| `AUTH_SECRET` | `openssl rand -base64 32` | **Generate mới 1 lần**, dùng chung |
| `NEXTAUTH_SECRET` | same as `AUTH_SECRET` | Alias để tương thích ngược |
| `AUTH_TRUST_HOST` | `true` | Bắt buộc sau reverse-proxy |
| `GOOGLE_CLIENT_ID` | Client ID từ Bước 2 | |
| `GOOGLE_CLIENT_SECRET` | Client Secret từ Bước 2 | |
| `NEXT_PUBLIC_ID_URL` | `https://id.alphacenter.vn` | website redirect tới đây |
| `NEXT_PUBLIC_WEBSITE_URL` | `https://alphacenter.vn` | id. app launcher |
| `NEXT_PUBLIC_NOIBO_URL` | `https://noibo.alphacenter.vn` | Để sẵn cho HRM |

Các biến cũ như `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`, `DEEPSEEK_API_KEY`, `FACEBOOK_*`, `S3_*`/`MINIO_*` vẫn chỉ website cần — có thể để ở Application-level của `website` (tránh lộ cho id.).

---

## Bước 5 — Update Application "Alpha Digital Center" (website hiện có)

1. Coolify → project "Alpha Digital Center" → Application `Alpha Digital Center`.
2. **Configuration → General**:
   - Base Directory: `/` (monorepo root — quan trọng, để build context = root)
   - Dockerfile Location: `apps/website/docker/Dockerfile`
   - Port: `3000`
3. **Domains**: giữ `https://alphacenter.vn` và `https://www.alphacenter.vn`.
4. **Health Check URL**: `/api/health` nếu có, nếu không để trống.
5. Save → chờ deploy thử 1 lần để confirm build OK với structure mới.

---

## Bước 6 — Tạo Application mới "Alpha Digital Center ID"

1. Coolify → project "Alpha Digital Center" → **+ New** → **Application** → **Public Repository** (cùng Git repo với website).
2. **Source**:
   - Git URL: cùng repo như website
   - Branch: `main` (hoặc branch sẽ merge vào)
   - Build Pack: **Dockerfile**
3. **Configuration**:
   - Name: `Alpha Digital Center ID`
   - Base Directory: `/`
   - Dockerfile Location: `apps/id/Dockerfile`
   - Port: `4000`
4. **Domains**: thêm `https://id.alphacenter.vn`.
5. **Environment Variables**: project-level (từ Bước 4) sẽ tự inherit. Không cần set thêm.
6. **Persistent Storage**: không cần.
7. Save → **Deploy**.
8. Theo dõi logs đến khi thấy `✓ Ready in Xs` trên port 4000.

---

## Bước 7 — (Tuỳ chọn) Scaffold "Alpha Digital Center HRM"

Chỉ nếu bạn muốn `noibo.alphacenter.vn` hiện HRM placeholder ngay. Nếu chưa cần, bỏ qua, sẽ làm ở phase HRM sau.

1. Tạo Application mới "Alpha Digital Center HRM".
2. Base Directory `/`, Dockerfile `apps/noibo/Dockerfile` (chưa tồn tại — để enabled=false cho đến khi Phase 5 scaffold xong).
3. Domain `https://noibo.alphacenter.vn`.

---

## Bước 8 — Thứ tự deploy

**Deploy website TRƯỚC** để `boot.sh` chạy migration trước khi id. đụng vào schema mới. Window giữa 2 lần deploy ngắn (~2 phút), `/admin` có thể 502 trong lúc này — chấp nhận được.

1. Push branch `feat/monorepo-sso` (merge sang `main` hoặc giữ nguyên tuỳ workflow).
2. Coolify auto-trigger build.
3. **Deploy website trước** → boot.sh apply migration → chờ `alphacenter.vn` xanh. Xem log container:
   ```
   [boot] Applying manual migrations from packages/database/migrations-manual
   [boot] ▶ .../001-sso-roles.sql
   [boot] ✓ OK
   [boot] Starting Next.js server...
   ```
4. **Deploy "ADC ID"** → chờ `id.alphacenter.vn` xanh.
5. Nếu có HRM app → deploy sau cùng.

Nếu bạn chạy SQL migration thủ công ở Bước 1, thứ tự deploy không còn quan trọng — deploy song song OK.

---

## Bước 9 — Smoke test sau deploy

Xoá toàn bộ cookie browser trước test.

### 9.1 DNS + SSL
```bash
curl -I https://id.alphacenter.vn            # 200 hoặc 307 — không được 5xx
curl -I https://alphacenter.vn               # 200
```

### 9.2 Redirect flow
```bash
curl -I https://alphacenter.vn/admin
# Expect: HTTP/2 307
# Location: https://id.alphacenter.vn/?callbackUrl=https%3A%2F%2Falphacenter.vn%2Fadmin
```

### 9.3 Login + cookie
1. Browser → `https://alphacenter.vn/admin`.
2. Redirected tới id. → click **Đăng nhập với Google**.
3. OAuth → callback → dashboard với 3 app card.
4. DevTools → Application → Cookies cho `.alphacenter.vn`:
   - Tên: `__Secure-authjs.session-token`
   - Domain: `.alphacenter.vn` (bắt đầu bằng dấu `.`)
   - Secure: ✓, HttpOnly: ✓, SameSite: Lax
5. Click card "Quản trị Marketing" → về `alphacenter.vn/admin` với session valid, không bị redirect lại.

### 9.4 Super admin & role gate
- Vào `https://id.alphacenter.vn/admin` — chỉ SUPER_ADMIN thấy được.
- Vào `/api/me` của id: `curl https://id.alphacenter.vn/api/me -b "<cookie>"` → trả JSON với role + isActive.

### 9.5 Open-redirect protection
```bash
# Cố gắng redirect đến evil.com — phải về /dashboard default
curl -I "https://id.alphacenter.vn/dashboard?from=https%3A%2F%2Fevil.com" -b "<cookie>"
```

### 9.6 Kịch bản user PENDING
1. Login từ tài khoản Gmail KHÁC (không phải vuvanthanh1986@gmail.com).
2. Được tạo user với `role=PENDING`, `isActive=false`.
3. id. redirect sang `https://id.alphacenter.vn/pending` — thấy trang chờ duyệt.
4. Vũ (SUPER_ADMIN) vào `id.alphacenter.vn/admin` → đổi role + toggle isActive → user có thể login lại bình thường.

---

## Rollback

Nếu deploy fail:
1. Coolify → Application → **Deployments** tab → **Rollback** về commit trước Phase 1.
2. SQL schema không rollback được tự động, nhưng code cũ read role TEXT thì vẫn hoạt động với data enum (Postgres enum giá trị trùng với string). Lưu ý: `is_active` cột mới không ảnh hưởng code cũ.
3. Chỉ drop enum + cột nếu chắc chắn không rollback forward: `ALTER TABLE users ALTER COLUMN role TYPE TEXT USING role::TEXT; DROP TYPE "UserRole"; ALTER TABLE users DROP COLUMN is_active, DROP COLUMN phone, DROP COLUMN updated_at; DROP TABLE login_logs, customer_profiles;`

---

## Troubleshooting nhanh

| Triệu chứng | Nguyên nhân thường gặp |
|---|---|
| Login xong vẫn redirect về id. loop | `AUTH_SECRET` khác nhau giữa 2 app — set lại project-level env, redeploy cả 2. |
| Cookie không share giữa subdomain | `packages/auth/src/index.ts` chỉ set `domain=".alphacenter.vn"` khi `NODE_ENV=production`. Kiểm tra env đang đúng. |
| `OAuthCallback` error | Redirect URI ở Google Cloud Console chưa đúng `https://id.alphacenter.vn/api/auth/callback/google`. |
| `PrismaClientKnownRequestError: role enum value` | Migration SQL chưa chạy trên Postgres prod. Chạy Bước 1. |
| 502 từ Traefik | Base Directory sai, Dockerfile không build. Check Coolify build log. |
| Website boot OK nhưng /admin redirect tới `/` thay vì id. | `NEXT_PUBLIC_ID_URL` chưa set ở env project-level. |

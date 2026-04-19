# MinIO Setup — ADC Marketing

**Trạng thái**: ✅ Đã deploy + config + smoke test thành công (2026-04-19).

## Tóm tắt

- **API endpoint (S3)**: `https://cdn.alphacenter.vn`
- **Web Console**: `https://console.alphacenter.vn` (login: `adc_minio_admin` / pwd lưu trong Coolify env của service `adc-minio`)
- **Bucket**: `adc-uploads` (public-read cho 9 prefixes)
- **Service UUID** (Coolify): `nwt96bzcgmyq7gav82csv3b6`
- **App env vars (ADC Marketing)**: `S3_*` đã set trên Coolify app `jyu5qtyvmm03yg365ttedt84`

## Kiến trúc đã triển khai

### 1. MinIO trên Coolify
Service `adc-minio` trong project Alpha Digital Center, docker-compose với explicit
Traefik labels route 2 ports ra 2 domain:

- Port `9000` (S3 API) → `https://cdn.alphacenter.vn`
- Port `9001` (Console) → `https://console.alphacenter.vn`

Compose gốc ở [`docker/minio-compose.yml`](../docker/minio-compose.yml). Deploy đã
thực hiện qua Coolify API (không cần UI).

Env vars set trên MinIO service:
- `MINIO_ROOT_USER=adc_minio_admin`
- `MINIO_ROOT_PASSWORD=<xem Coolify env UI hoặc .env.local local>`
- `MINIO_API_CORS_ALLOW_ORIGIN=https://www.alphacenter.vn,https://alphacenter.vn,http://localhost:3000`

### 2. Cloudflare DNS

Zone `alphacenter.vn` → 2 A records:
- `cdn.alphacenter.vn` → `89.167.61.19` (proxy off)
- `console.alphacenter.vn` → `89.167.61.19` (proxy off)

Let's Encrypt cert issued by Coolify Traefik tự động.

### 3. Bucket + policy

- Bucket: `adc-uploads`
- Public-read policy cho 9 prefix: `home/`, `about/`, `products/`, `blog/`,
  `testimonials/`, `tech/`, `materials/`, `team/`, `misc/`

### 4. CORS

**Lưu ý quan trọng**: MinIO **KHÔNG** implement S3 `PutBucketCors` API (trả 501
NotImplemented). CORS phải config qua env var `MINIO_API_CORS_ALLOW_ORIGIN` trên
chính MinIO container. Không dùng `mc cors set` hoặc AWS SDK `PutBucketCorsCommand`.

### 5. Access Key cho ADC app

Hiện dùng `MINIO_ROOT_USER` làm access key (MVP pragmatic). Có thể rotate sau:
- Login `console.alphacenter.vn` → Access Keys → Create Access Key → gắn policy
  scoped chỉ bucket `adc-uploads`.
- Update Coolify app env `S3_ACCESS_KEY_ID` + `S3_SECRET_ACCESS_KEY`.

## Scripts

- [`scripts/setup-minio.mjs`](../scripts/setup-minio.mjs) — idempotent setup (bucket
  + policy + smoke test). Re-run để verify.
  ```bash
  S3_ENDPOINT=https://cdn.alphacenter.vn S3_BUCKET=adc-uploads \
    S3_ACCESS_KEY_ID=... S3_SECRET_ACCESS_KEY=... \
    node scripts/setup-minio.mjs
  ```

## Quan trọng khi viết code dùng S3 SDK

MinIO không hỗ trợ một số header checksum mới của AWS SDK v3:

```typescript
new S3Client({
  // ...
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});
```

Đã áp dụng ở `src/lib/storage.ts`. Nếu thấy lỗi `501 NotImplemented`, check SDK
version + config này.

## Rotate password

Nếu cần rotate `MINIO_ROOT_PASSWORD`:
1. Coolify → service `adc-minio` → Environment → update var + redeploy.
2. Update `S3_SECRET_ACCESS_KEY` trên app `adc-marketing` → redeploy.
3. Update `.env.local`.

## Troubleshooting

- **Upload 403 từ Next.js**: check env vars trên Coolify app, check key hoạt động
  bằng `node scripts/setup-minio.mjs`.
- **CORS error browser**: kiểm tra `MINIO_API_CORS_ALLOW_ORIGIN` có chứa origin
  đang call không. Phải match exact (bao gồm cả port).
- **Ảnh public load 403**: prefix có trong policy không? Chỉ 9 prefixes trong danh
  sách mới public-read.
- **Container restart loop**: check `MINIO_ROOT_PASSWORD` độ dài ≥ 8 chars; MinIO
  reject weak passwords.
- **Traefik 404**: DNS đã propagate chưa? `nslookup cdn.alphacenter.vn 1.1.1.1`.

## Monitor disk

Coolify VPS volume `nwt96bzcgmyq7gav82csv3b6_minio-data`. Alert Coolify khi
disk > 80%.

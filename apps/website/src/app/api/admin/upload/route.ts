import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { buildKey, uploadFile, isStorageConfigured, deleteFile, extractKey } from '@/lib/storage';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);
const ALLOWED_PREFIX = new Set([
  'home',
  'about',
  'products',
  'blog',
  'testimonials',
  'tech',
  'materials',
  'team',
  'misc',
]);

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: 'Storage chưa được cấu hình. Thiếu S3_* env vars.' },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get('file');
  const prefixRaw = (form.get('prefix') as string | null) || 'misc';

  if (!file || !(file instanceof File)) return badRequest('Thiếu file');
  if (!ALLOWED_MIME.has(file.type)) return badRequest(`Định dạng không hỗ trợ: ${file.type}`);
  if (file.size > MAX_SIZE) return badRequest(`File quá lớn (tối đa ${MAX_SIZE / 1024 / 1024}MB)`);

  const prefix = ALLOWED_PREFIX.has(prefixRaw) ? prefixRaw : 'misc';

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildKey(prefix, file.name || 'upload');

  try {
    const result = await uploadFile({ buffer, key, contentType: file.type });
    logger.info('Admin upload', {
      userId: (session.user as any)?.id,
      key,
      size: file.size,
      contentType: file.type,
    });
    return NextResponse.json(result);
  } catch (err) {
    logger.error('Upload failed', err, { key });
    return NextResponse.json({ error: 'Upload thất bại' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const urlOrKey = searchParams.get('key') || searchParams.get('url');
  if (!urlOrKey) return badRequest('Thiếu key hoặc url');

  const key = extractKey(urlOrKey);
  if (!key || /^https?:\/\//i.test(key)) {
    return badRequest('URL không thuộc bucket quản lý');
  }

  try {
    await deleteFile(key);
    logger.info('Admin delete file', { userId: (session.user as any)?.id, key });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('Delete failed', err, { key });
    return NextResponse.json({ error: 'Xóa thất bại' }, { status: 500 });
  }
}

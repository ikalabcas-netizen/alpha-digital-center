import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('S3 config missing: S3_ENDPOINT / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY');
  }
  _client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  return _client;
}

function bucket(): string {
  const b = process.env.S3_BUCKET;
  if (!b) throw new Error('S3_BUCKET not set');
  return b;
}

function publicBase(): string {
  const base = process.env.S3_PUBLIC_URL;
  if (base) return base.replace(/\/$/, '');
  const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '') || '';
  return `${endpoint}/${bucket()}`;
}

export function slugifyFilename(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 50);
  return `${base || 'file'}${ext}`;
}

export function buildKey(prefix: string, filename: string): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const uuid = randomUUID().slice(0, 8);
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
  return `${cleanPrefix}/${yyyy}/${mm}/${uuid}-${slugifyFilename(filename)}`;
}

export function getPublicUrl(key: string): string {
  if (!key) return '';
  if (/^https?:\/\//i.test(key)) return key;
  return `${publicBase()}/${key.replace(/^\/+/, '')}`;
}

export function extractKey(publicUrl: string): string {
  if (!publicUrl) return '';
  const base = publicBase();
  if (publicUrl.startsWith(base + '/')) return publicUrl.slice(base.length + 1);
  return publicUrl;
}

export async function uploadFile(opts: {
  buffer: Buffer;
  key: string;
  contentType: string;
}): Promise<{ url: string; key: string }> {
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: opts.key,
      Body: opts.buffer,
      ContentType: opts.contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  return { url: getPublicUrl(opts.key), key: opts.key };
}

export async function deleteFile(key: string): Promise<void> {
  if (!key) return;
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket(),
      Key: key,
    }),
  );
}

export async function presignGet(key: string, expiresSec = 3600): Promise<string> {
  const client = getClient();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket(), Key: key }),
    { expiresIn: expiresSec },
  );
}

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET,
  );
}

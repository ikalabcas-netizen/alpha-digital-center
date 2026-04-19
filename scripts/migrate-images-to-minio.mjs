// One-off: download sample Unsplash images, upload to MinIO, update DB URLs.
// Run:
//   S3_ACCESS_KEY_ID=... S3_SECRET_ACCESS_KEY=... node scripts/migrate-images-to-minio.mjs
//
// Reads DATABASE_URL from env or defaults to the prod public URL (only works if
// port 5433 is open — otherwise run via `node … | ssh vps psql` pattern).

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';
import path from 'node:path';

const S3_ENDPOINT = process.env.S3_ENDPOINT || 'https://cdn.alphacenter.vn';
const S3_BUCKET = process.env.S3_BUCKET || 'adc-uploads';
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || `${S3_ENDPOINT}/${S3_BUCKET}`;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error('Missing S3 credentials');
  process.exit(1);
}

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

const prisma = new PrismaClient();

// Source images — prefix decides MinIO folder.
const SAMPLES = [
  { key: 'heroLab', prefix: 'home', url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&q=80', slug: 'hero-lab' },
  { key: 'cadcam', prefix: 'tech', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80', slug: 'cadcam-mill' },
  { key: 'tech', prefix: 'tech', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80', slug: 'tech-station' },
  { key: 'scanner', prefix: 'tech', url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1200&q=80', slug: 'scanner' },
  { key: 'tools', prefix: 'tech', url: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200&q=80', slug: 'tools' },
  { key: 'office', prefix: 'about', url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&q=80', slug: 'office' },
  { key: 'hands', prefix: 'about', url: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=1400&q=80', slug: 'hands' },
  { key: 'crown', prefix: 'products', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=80', slug: 'crown' },
  { key: 'team', prefix: 'team', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&q=80', slug: 'team' },
];

async function uploadSample(s) {
  console.log(`[fetch] ${s.key} from Unsplash...`);
  const res = await fetch(s.url);
  if (!res.ok) throw new Error(`fetch ${s.key}: ${res.status}`);
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const body = Buffer.from(await res.arrayBuffer());
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const uuid = crypto.randomUUID().slice(0, 8);
  const key = `${s.prefix}/2026/04/${uuid}-${s.slug}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  const publicUrl = `${S3_PUBLIC_URL}/${key}`;
  console.log(`[ok] ${s.key} → ${publicUrl} (${body.length} bytes)`);
  return { ...s, publicUrl };
}

async function updateDb(uploaded) {
  const byKey = Object.fromEntries(uploaded.map((u) => [u.key, u.publicUrl]));

  // Map Unsplash source URLs → new MinIO URLs. Do substring replace in DB fields.
  const replacements = uploaded.map((u) => ({ from: u.url.split('?')[0], to: u.publicUrl }));

  let total = 0;

  // cms_page_hero
  for (const r of replacements) {
    const n = await prisma.$executeRawUnsafe(
      `UPDATE cms_page_hero SET image_url = $1 WHERE image_url LIKE $2`,
      r.to, `${r.from}%`,
    );
    total += n;
  }

  // cms_tech_cards
  for (const r of replacements) {
    const n = await prisma.$executeRawUnsafe(
      `UPDATE cms_tech_cards SET image_url = $1 WHERE image_url LIKE $2`,
      r.to, `${r.from}%`,
    );
    total += n;
  }

  // cms_story_blocks — 2 columns
  for (const r of replacements) {
    const n1 = await prisma.$executeRawUnsafe(
      `UPDATE cms_story_blocks SET image_url_1 = $1 WHERE image_url_1 LIKE $2`,
      r.to, `${r.from}%`,
    );
    const n2 = await prisma.$executeRawUnsafe(
      `UPDATE cms_story_blocks SET image_url_2 = $1 WHERE image_url_2 LIKE $2`,
      r.to, `${r.from}%`,
    );
    total += n1 + n2;
  }

  console.log(`[db] updated ${total} rows`);
  return { replacements, rowsUpdated: total };
}

(async () => {
  try {
    const uploaded = [];
    for (const s of SAMPLES) uploaded.push(await uploadSample(s));

    if (process.env.DATABASE_URL) {
      console.log('\nUpdating DB with new URLs...');
      await updateDb(uploaded);
    } else {
      console.log('\n[skip db] DATABASE_URL not set. URL mapping:');
      uploaded.forEach((u) => console.log(`  ${u.key}: ${u.publicUrl}`));
    }

    await prisma.$disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();

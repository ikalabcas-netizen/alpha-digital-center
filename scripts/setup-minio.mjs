// One-off: create bucket + public-read policy + CORS on MinIO.
// Run: node scripts/setup-minio.mjs
// Requires env: S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET

// Note: CORS is configured server-side via MINIO_API_CORS_ALLOW_ORIGIN env var
// on the MinIO container — MinIO does NOT implement S3 PutBucketCors API.
// This script handles bucket + public-read policy + smoke test only.

import {
  S3Client,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const endpoint = process.env.S3_ENDPOINT || 'https://cdn.alphacenter.vn';
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const Bucket = process.env.S3_BUCKET || 'adc-uploads';

if (!accessKeyId || !secretAccessKey) {
  console.error('Missing S3_ACCESS_KEY_ID or S3_SECRET_ACCESS_KEY');
  process.exit(1);
}

const client = new S3Client({
  endpoint,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

// Strip the flexible-checksum middleware that adds x-amz-sdk-checksum-algorithm
// (MinIO returns 501 NotImplemented on some ops when this header is present)
client.middlewareStack.remove('flexibleChecksumsMiddleware');

const PREFIXES = ['home', 'about', 'products', 'blog', 'testimonials', 'tech', 'materials', 'team', 'misc'];

async function ensureBucket() {
  try {
    await client.send(new HeadBucketCommand({ Bucket }));
    console.log(`[ok] bucket ${Bucket} exists`);
  } catch (err) {
    if (err.$metadata?.httpStatusCode === 404 || err.name === 'NotFound') {
      await client.send(new CreateBucketCommand({ Bucket }));
      console.log(`[ok] bucket ${Bucket} created`);
    } else {
      throw err;
    }
  }
}

async function setPolicy() {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: PREFIXES.map((p) => `arn:aws:s3:::${Bucket}/${p}/*`),
      },
    ],
  };
  await client.send(new PutBucketPolicyCommand({ Bucket, Policy: JSON.stringify(policy) }));
  console.log(`[ok] public-read policy applied for ${PREFIXES.length} prefixes`);
}

async function smokeTest() {
  const key = 'misc/_smoke-test.txt';
  const body = Buffer.from(`ping ${new Date().toISOString()}`);
  await client.send(new PutObjectCommand({ Bucket, Key: key, Body: body, ContentType: 'text/plain' }));
  const publicUrl = `${endpoint.replace(/\/$/, '')}/${Bucket}/${key}`;
  const res = await fetch(publicUrl);
  const text = await res.text();
  if (res.ok && text === body.toString()) {
    console.log(`[ok] public read works: ${publicUrl}`);
  } else {
    console.warn(`[warn] public read returned status=${res.status} body="${text.slice(0, 80)}"`);
  }
  await client.send(new DeleteObjectCommand({ Bucket, Key: key }));
  console.log('[ok] smoke file cleaned up');
}

(async () => {
  try {
    await ensureBucket();
    await setPolicy();
    await smokeTest();
    console.log('\nMinIO setup complete.');
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();

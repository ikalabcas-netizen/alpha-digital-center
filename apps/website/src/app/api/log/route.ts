import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Client-side error ingest endpoint.
 * ErrorTracker.tsx POSTs window.onerror / unhandledrejection events here.
 *
 * Rate-limit đơn giản: chặn >30 request/phút/IP in-memory (đủ chống spam,
 * không cần Redis cho scope hiện tại).
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const counters = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = counters.get(ip);
  if (!entry || entry.resetAt < now) {
    counters.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= MAX_PER_WINDOW;
}

type ClientErrorPayload = {
  message?: unknown;
  source?: unknown;
  url?: unknown;
  userAgent?: unknown;
  stack?: unknown;
  type?: unknown; // 'error' | 'unhandledrejection'
  extra?: unknown;
};

function str(v: unknown, max = 2000): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return s.length > max ? s.slice(0, max) + '…[truncated]' : s;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  let body: ClientErrorPayload = {};
  try {
    body = (await req.json()) as ClientErrorPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = str(body.message) || 'Client error (no message)';
  logger.warn(`[client] ${message}`, {
    source: 'client',
    type: str(body.type, 50),
    url: str(body.url, 500),
    userAgent: str(body.userAgent, 300),
    stack: str(body.stack, 4000),
    extra: body.extra && typeof body.extra === 'object' ? body.extra : undefined,
    ip,
  });

  return new NextResponse(null, { status: 204 });
}

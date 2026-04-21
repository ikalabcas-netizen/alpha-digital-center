import { NextResponse, type NextRequest } from 'next/server';
import { logger } from './logger';

type RouteHandler<T = unknown> = (
  req: NextRequest,
  ctx: { params: Promise<T> }
) => Promise<Response> | Response;

/**
 * Wrap một route handler để auto-catch + log lỗi chưa xử lý.
 * Usage:
 *   export const GET = withErrorLog(async (req) => { ... });
 */
export function withErrorLog<T = unknown>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (req, ctx) => {
    const startedAt = Date.now();
    const url = req.nextUrl.pathname + (req.nextUrl.search || '');
    try {
      const res = await handler(req, ctx);
      // Log 5xx coming from handler itself
      if (res && res.status >= 500) {
        logger.warn('Route returned 5xx', {
          method: req.method,
          url,
          status: res.status,
          durationMs: Date.now() - startedAt,
        });
      }
      return res;
    } catch (err) {
      logger.error('Unhandled error in route handler', err, {
        method: req.method,
        url,
        durationMs: Date.now() - startedAt,
      });
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}

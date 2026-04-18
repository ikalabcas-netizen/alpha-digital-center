import { NextResponse } from 'next/server';
import { withErrorLog } from '@/lib/with-error-log';

export const GET = withErrorLog(async () => {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

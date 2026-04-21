import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { seedCmsContent } from '../../../../../../../packages/database/prisma/seed-cms';

export const runtime = 'nodejs';

export async function POST() {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  try {
    const summary = await seedCmsContent(prisma);
    logger.info('CMS seed triggered', { userId: (session.user as any)?.id, summary });
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    logger.error('CMS seed failed', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}

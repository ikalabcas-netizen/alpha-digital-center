import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const { tag, meta, title, description, imageUrl, displayOrder, isActive } = body;
  try {
    const item = await prisma.cmsTechCard.update({
      where: { id },
      data: { tag, meta, title, description, imageUrl, displayOrder, isActive },
    });
    revalidatePath('/');
    return NextResponse.json(item);
  } catch (err) {
    logger.error('TechCard update failed', err, { id });
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  try {
    await prisma.cmsTechCard.delete({ where: { id } });
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('TechCard delete failed', err, { id });
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

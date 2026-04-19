import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const items = await prisma.cmsTechCard.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { tag, meta, title, description, imageUrl, displayOrder, isActive } = body;
  if (!tag || !title || !description || !imageUrl) return badRequest('Thiếu trường bắt buộc');
  try {
    const item = await prisma.cmsTechCard.create({
      data: { tag, meta: meta || '', title, description, imageUrl, displayOrder: displayOrder ?? 0, isActive: isActive ?? true },
    });
    revalidatePath('/');
    logger.info('TechCard created', { id: item.id });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    logger.error('TechCard create failed', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

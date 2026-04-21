import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const items = await prisma.cmsMaterial.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { name, country, material, sinceYear, displayOrder, isActive } = body;
  if (!name || !country || !material) return badRequest('Thiếu trường bắt buộc');
  try {
    const item = await prisma.cmsMaterial.create({
      data: { name, country, material, sinceYear: sinceYear || '', displayOrder: displayOrder ?? 0, isActive: isActive ?? true },
    });
    revalidatePath('/');
    logger.info('Material created', { id: item.id });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    logger.error('Material create failed', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

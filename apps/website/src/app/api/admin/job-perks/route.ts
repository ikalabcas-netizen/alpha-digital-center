import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const items = await prisma.cmsJobPerk.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { title, description, iconKey, displayOrder } = body;
  if (!title || !description) return badRequest('Thiếu trường bắt buộc');
  const item = await prisma.cmsJobPerk.create({
    data: { title, description, iconKey: iconKey || null, displayOrder: displayOrder ?? 0 },
  });
  revalidatePath('/tuyen-dung');
  return NextResponse.json(item, { status: 201 });
}

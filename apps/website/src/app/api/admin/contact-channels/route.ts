import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const items = await prisma.cmsContactChannel.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { label, value, subtitle, iconKey, displayOrder, isActive } = body;
  if (!label || !value || !iconKey) return badRequest('Thiếu trường bắt buộc');
  const item = await prisma.cmsContactChannel.create({
    data: { label, value, subtitle: subtitle || '', iconKey, displayOrder: displayOrder ?? 0, isActive: isActive ?? true },
  });
  revalidatePath('/lien-he');
  return NextResponse.json(item, { status: 201 });
}

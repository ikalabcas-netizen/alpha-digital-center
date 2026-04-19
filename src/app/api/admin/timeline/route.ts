import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const items = await prisma.cmsTimelineEntry.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { year, title, description, displayOrder } = body;
  if (!year || !title || !description) return badRequest('Thiếu trường bắt buộc');
  const item = await prisma.cmsTimelineEntry.create({
    data: { year, title, description, displayOrder: displayOrder ?? 0 },
  });
  revalidatePath('/gioi-thieu');
  return NextResponse.json(item, { status: 201 });
}

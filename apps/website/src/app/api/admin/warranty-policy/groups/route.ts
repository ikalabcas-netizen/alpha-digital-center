import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const groups = await prisma.cmsWarrantyPolicyGroup.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { items: { orderBy: { displayOrder: 'asc' } } },
  });
  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { categoryName, displayOrder } = body;
  if (!categoryName) return badRequest('Thiếu categoryName');
  const group = await prisma.cmsWarrantyPolicyGroup.create({
    data: { categoryName, displayOrder: displayOrder ?? 0 },
  });
  revalidatePath('/bao-hanh');
  return NextResponse.json(group, { status: 201 });
}

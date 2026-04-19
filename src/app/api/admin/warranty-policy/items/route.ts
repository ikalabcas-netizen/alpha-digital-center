import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { groupId, productName, warrantyText, displayOrder } = body;
  if (!groupId || !productName || !warrantyText) return badRequest('Thiếu trường bắt buộc');
  const item = await prisma.cmsWarrantyPolicyItem.create({
    data: { groupId, productName, warrantyText, displayOrder: displayOrder ?? 0 },
  });
  revalidatePath('/bao-hanh');
  return NextResponse.json(item, { status: 201 });
}

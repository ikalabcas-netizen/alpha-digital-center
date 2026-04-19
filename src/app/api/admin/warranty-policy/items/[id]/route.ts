import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.cmsWarrantyPolicyItem.update({ where: { id }, data: body });
  revalidatePath('/bao-hanh');
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  await prisma.cmsWarrantyPolicyItem.delete({ where: { id } });
  revalidatePath('/bao-hanh');
  return NextResponse.json({ ok: true });
}

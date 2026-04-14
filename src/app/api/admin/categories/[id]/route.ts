import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound, slugify } from '@/lib/api-auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const category = await prisma.productCategory.findUnique({
    where: { id },
    include: { products: true, children: true },
  });

  if (!category) return notFound('Category');
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const { nameVi, nameEn, descriptionVi, descriptionEn, imageUrl, displayOrder, isActive, parentId } = body;

  const updated = await prisma.productCategory.update({
    where: { id },
    data: {
      ...(nameVi !== undefined && { nameVi, slug: slugify(nameVi) }),
      ...(nameEn !== undefined && { nameEn }),
      ...(descriptionVi !== undefined && { descriptionVi }),
      ...(descriptionEn !== undefined && { descriptionEn }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isActive !== undefined && { isActive }),
      ...(parentId !== undefined && { parentId }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.productCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

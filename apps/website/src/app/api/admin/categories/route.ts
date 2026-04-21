import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest, slugify } from '@/lib/api-auth';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const categories = await prisma.productCategory.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const { nameVi, nameEn, descriptionVi, descriptionEn, imageUrl, displayOrder, parentId } = body;

  if (!nameVi) return badRequest('nameVi is required');

  const slug = slugify(nameVi);

  const category = await prisma.productCategory.create({
    data: {
      nameVi,
      nameEn: nameEn || null,
      slug,
      descriptionVi: descriptionVi || null,
      descriptionEn: descriptionEn || null,
      imageUrl: imageUrl || null,
      displayOrder: displayOrder || 0,
      parentId: parentId || null,
    },
  });

  return NextResponse.json(category, { status: 201 });
}

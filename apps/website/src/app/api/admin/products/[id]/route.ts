import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound, slugify } from '@/lib/api-auth';

function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: { orderBy: { createdAt: 'asc' } },
      images: { orderBy: { displayOrder: 'asc' } },
    },
  });

  if (!product) return notFound('Product');
  return NextResponse.json(serializeBigInt(product));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const {
    nameVi, nameEn, categoryId, sku, descriptionVi, descriptionEn,
    material, origin, warrantyYears, displayOrder, isActive, isFeatured,
    seoTitle, seoDescription,
  } = body;

  const data: any = {};
  if (nameVi !== undefined) { data.nameVi = nameVi; data.slug = slugify(nameVi); }
  if (nameEn !== undefined) data.nameEn = nameEn;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (sku !== undefined) data.sku = sku;
  if (descriptionVi !== undefined) data.descriptionVi = descriptionVi;
  if (descriptionEn !== undefined) data.descriptionEn = descriptionEn;
  if (material !== undefined) data.material = material;
  if (origin !== undefined) data.origin = origin;
  if (warrantyYears !== undefined) data.warrantyYears = warrantyYears;
  if (displayOrder !== undefined) data.displayOrder = displayOrder;
  if (isActive !== undefined) data.isActive = isActive;
  if (isFeatured !== undefined) data.isFeatured = isFeatured;
  if (seoTitle !== undefined) data.seoTitle = seoTitle;
  if (seoDescription !== undefined) data.seoDescription = seoDescription;

  const updated = await prisma.product.update({
    where: { id },
    data,
    include: {
      category: { select: { id: true, nameVi: true } },
      variants: true,
      images: true,
    },
  });

  return NextResponse.json(serializeBigInt(updated));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

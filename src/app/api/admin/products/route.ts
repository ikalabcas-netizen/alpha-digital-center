import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest, slugify } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search');
  const active = searchParams.get('active');

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (active !== null && active !== '') where.isActive = active === 'true';
  if (search) {
    where.OR = [
      { nameVi: { contains: search, mode: 'insensitive' } },
      { material: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { id: true, nameVi: true, slug: true } },
      variants: { orderBy: { createdAt: 'asc' } },
      images: { orderBy: { displayOrder: 'asc' } },
      _count: { select: { warranties: true } },
    },
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const {
    nameVi, nameEn, categoryId, sku, descriptionVi, descriptionEn,
    material, origin, warrantyYears, displayOrder, isFeatured,
    seoTitle, seoDescription, variants, images,
  } = body;

  if (!nameVi || !categoryId) return badRequest('nameVi and categoryId are required');

  const slug = slugify(nameVi);

  const product = await prisma.product.create({
    data: {
      nameVi,
      nameEn: nameEn || null,
      slug,
      categoryId,
      sku: sku || null,
      descriptionVi: descriptionVi || null,
      descriptionEn: descriptionEn || null,
      material: material || null,
      origin: origin || null,
      warrantyYears: warrantyYears || null,
      displayOrder: displayOrder || 0,
      isFeatured: isFeatured || false,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      ...(variants?.length && {
        variants: {
          create: variants.map((v: any) => ({
            nameVi: v.nameVi,
            nameEn: v.nameEn || null,
            unit: v.unit || 'Cái',
            priceVnd: BigInt(v.priceVnd || 0),
            priceNote: v.priceNote || null,
          })),
        },
      }),
      ...(images?.length && {
        images: {
          create: images.map((img: any, idx: number) => ({
            imageUrl: img.imageUrl,
            altTextVi: img.altTextVi || null,
            displayOrder: idx,
            isPrimary: idx === 0,
          })),
        },
      }),
    },
    include: {
      category: { select: { id: true, nameVi: true } },
      variants: true,
      images: true,
    },
  });

  // Serialize BigInt to string
  const serialized = JSON.parse(
    JSON.stringify(product, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );

  return NextResponse.json(serialized, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';

function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const { nameVi, nameEn, unit, priceVnd, priceNote } = body;

  if (!nameVi || !unit) return badRequest('nameVi and unit are required');

  const variant = await prisma.productVariant.create({
    data: {
      productId: id,
      nameVi,
      nameEn: nameEn || null,
      unit,
      priceVnd: BigInt(priceVnd || 0),
      priceNote: priceNote || null,
    },
  });

  return NextResponse.json(serializeBigInt(variant), { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const { variantId, nameVi, nameEn, unit, priceVnd, priceNote, isActive } = body;

  if (!variantId) return badRequest('variantId is required');

  const updated = await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      ...(nameVi !== undefined && { nameVi }),
      ...(nameEn !== undefined && { nameEn }),
      ...(unit !== undefined && { unit }),
      ...(priceVnd !== undefined && { priceVnd: BigInt(priceVnd) }),
      ...(priceNote !== undefined && { priceNote }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(serializeBigInt(updated));
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const variantId = searchParams.get('variantId');
  if (!variantId) return badRequest('variantId query param required');

  await prisma.productVariant.delete({ where: { id: variantId } });
  return NextResponse.json({ success: true });
}

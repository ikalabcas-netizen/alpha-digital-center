import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { warrantyCode: { contains: search, mode: 'insensitive' } },
      { patientName: { contains: search, mode: 'insensitive' } },
      { dentistName: { contains: search, mode: 'insensitive' } },
      { labName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const warranties = await prisma.warrantyRecord.findMany({
    where,
    include: {
      product: { select: { id: true, nameVi: true } },
      variant: { select: { id: true, nameVi: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(warranties);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const {
    warrantyCode, patientName, dentistName, labName,
    productId, variantId, teethPositions, shade,
    productionDate, warrantyExpiry, notes,
  } = body;

  if (!warrantyCode || !productionDate || !warrantyExpiry) {
    return badRequest('warrantyCode, productionDate, and warrantyExpiry are required');
  }

  const warranty = await prisma.warrantyRecord.create({
    data: {
      warrantyCode,
      patientName: patientName || null,
      dentistName: dentistName || null,
      labName: labName || null,
      productId: productId || null,
      variantId: variantId || null,
      teethPositions: teethPositions || null,
      shade: shade || null,
      productionDate: new Date(productionDate),
      warrantyExpiry: new Date(warrantyExpiry),
      notes: notes || null,
    },
    include: {
      product: { select: { id: true, nameVi: true } },
      variant: { select: { id: true, nameVi: true } },
    },
  });

  return NextResponse.json(warranty, { status: 201 });
}

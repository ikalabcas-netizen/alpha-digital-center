import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound } from '@/lib/api-auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const warranty = await prisma.warrantyRecord.findUnique({
    where: { id },
    include: {
      product: { select: { id: true, nameVi: true } },
      variant: { select: { id: true, nameVi: true } },
    },
  });

  if (!warranty) return notFound('WarrantyRecord');
  return NextResponse.json(warranty);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const {
    patientName, dentistName, labName, productId, variantId,
    teethPositions, shade, productionDate, warrantyExpiry,
    status, notes,
  } = body;

  const data: any = {};
  if (patientName !== undefined) data.patientName = patientName;
  if (dentistName !== undefined) data.dentistName = dentistName;
  if (labName !== undefined) data.labName = labName;
  if (productId !== undefined) data.productId = productId;
  if (variantId !== undefined) data.variantId = variantId;
  if (teethPositions !== undefined) data.teethPositions = teethPositions;
  if (shade !== undefined) data.shade = shade;
  if (productionDate !== undefined) data.productionDate = new Date(productionDate);
  if (warrantyExpiry !== undefined) data.warrantyExpiry = new Date(warrantyExpiry);
  if (status !== undefined) data.status = status;
  if (notes !== undefined) data.notes = notes;

  const updated = await prisma.warrantyRecord.update({
    where: { id },
    data,
    include: {
      product: { select: { id: true, nameVi: true } },
      variant: { select: { id: true, nameVi: true } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.warrantyRecord.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

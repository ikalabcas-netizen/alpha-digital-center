import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound } from '@/lib/api-auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const { labName, contactPerson, contentVi, rating, imageUrl, isFeatured, isApproved, displayOrder } = body;

  const data: any = {};
  if (labName !== undefined) data.labName = labName;
  if (contactPerson !== undefined) data.contactPerson = contactPerson;
  if (contentVi !== undefined) data.contentVi = contentVi;
  if (rating !== undefined) data.rating = rating;
  if (imageUrl !== undefined) data.imageUrl = imageUrl;
  if (isFeatured !== undefined) data.isFeatured = isFeatured;
  if (isApproved !== undefined) data.isApproved = isApproved;
  if (displayOrder !== undefined) data.displayOrder = displayOrder;

  const updated = await prisma.testimonial.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

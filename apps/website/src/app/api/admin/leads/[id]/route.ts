import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound } from '@/lib/api-auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return notFound('Lead');
  return NextResponse.json(lead);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const {
    source, labName, contactName, phone, email,
    city, message, productInterest, status, assignedTo,
  } = body;

  const data: any = {};
  if (source !== undefined) data.source = source;
  if (labName !== undefined) data.labName = labName;
  if (contactName !== undefined) data.contactName = contactName;
  if (phone !== undefined) data.phone = phone;
  if (email !== undefined) data.email = email;
  if (city !== undefined) data.city = city;
  if (message !== undefined) data.message = message;
  if (productInterest !== undefined) data.productInterest = productInterest;
  if (status !== undefined) data.status = status;
  if (assignedTo !== undefined) data.assignedTo = assignedTo;

  const updated = await prisma.lead.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

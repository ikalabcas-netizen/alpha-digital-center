import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const source = searchParams.get('source');
  const search = searchParams.get('search');

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (source && source !== 'all') where.source = source;
  if (search) {
    where.OR = [
      { contactName: { contains: search, mode: 'insensitive' } },
      { labName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const {
    source, labName, contactName, phone, email,
    city, message, productInterest, assignedTo,
  } = body;

  if (!contactName || !source) return badRequest('contactName and source are required');

  const lead = await prisma.lead.create({
    data: {
      source,
      labName: labName || null,
      contactName,
      phone: phone || null,
      email: email || null,
      city: city || null,
      message: message || null,
      productInterest: productInterest || null,
      assignedTo: assignedTo || null,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}

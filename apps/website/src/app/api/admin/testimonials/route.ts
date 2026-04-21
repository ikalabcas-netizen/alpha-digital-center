import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const approved = searchParams.get('approved');
  const featured = searchParams.get('featured');

  const where: any = {};
  if (approved !== null && approved !== '') where.isApproved = approved === 'true';
  if (featured !== null && featured !== '') where.isFeatured = featured === 'true';

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const { labName, contactPerson, contentVi, rating, imageUrl, isFeatured, displayOrder } = body;

  if (!labName || !contentVi) return badRequest('labName and contentVi are required');

  const testimonial = await prisma.testimonial.create({
    data: {
      labName,
      contactPerson: contactPerson || null,
      contentVi,
      rating: rating || null,
      imageUrl: imageUrl || null,
      isFeatured: isFeatured || false,
      isApproved: true,
      displayOrder: displayOrder || 0,
    },
  });

  return NextResponse.json(testimonial, { status: 201 });
}

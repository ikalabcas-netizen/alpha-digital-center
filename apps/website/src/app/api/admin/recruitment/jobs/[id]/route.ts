import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound, slugify } from '@/lib/api-auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: { applications: { orderBy: { createdAt: 'desc' } } },
  });

  if (!job) return notFound('JobPosting');
  return NextResponse.json(job);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const {
    titleVi, department, location, employmentType,
    descriptionVi, requirementsVi, benefitsVi,
    salaryRange, isActive,
  } = body;

  const data: any = {};
  if (titleVi !== undefined) { data.titleVi = titleVi; data.slug = slugify(titleVi); }
  if (department !== undefined) data.department = department;
  if (location !== undefined) data.location = location;
  if (employmentType !== undefined) data.employmentType = employmentType;
  if (descriptionVi !== undefined) data.descriptionVi = descriptionVi;
  if (requirementsVi !== undefined) data.requirementsVi = requirementsVi;
  if (benefitsVi !== undefined) data.benefitsVi = benefitsVi;
  if (salaryRange !== undefined) data.salaryRange = salaryRange;
  if (isActive !== undefined) data.isActive = isActive;

  const updated = await prisma.jobPosting.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.jobPosting.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

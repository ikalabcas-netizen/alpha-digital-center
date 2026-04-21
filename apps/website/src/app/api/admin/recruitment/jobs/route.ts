import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest, slugify } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const active = searchParams.get('active');

  const where: any = {};
  if (active !== null && active !== '') where.isActive = active === 'true';

  const jobs = await prisma.jobPosting.findMany({
    where,
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const {
    titleVi, department, location, employmentType,
    descriptionVi, requirementsVi, benefitsVi, salaryRange,
  } = body;

  if (!titleVi || !descriptionVi) return badRequest('titleVi and descriptionVi are required');

  const slug = slugify(titleVi);

  const job = await prisma.jobPosting.create({
    data: {
      titleVi,
      slug,
      department: department || null,
      location: location || 'TP.HCM',
      employmentType: employmentType || 'full-time',
      descriptionVi,
      requirementsVi: requirementsVi || null,
      benefitsVi: benefitsVi || null,
      salaryRange: salaryRange || null,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json(job, { status: 201 });
}

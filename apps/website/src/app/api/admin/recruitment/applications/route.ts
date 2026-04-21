import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');
  const status = searchParams.get('status');

  const where: any = {};
  if (jobId) where.jobId = jobId;
  if (status && status !== 'all') where.status = status;

  const applications = await prisma.jobApplication.findMany({
    where,
    include: { job: { select: { id: true, titleVi: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(applications);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const { jobId, applicantName, phone, email, cvUrl, coverLetter } = body;

  if (!applicantName || !phone) return badRequest('applicantName and phone are required');

  const application = await prisma.jobApplication.create({
    data: {
      jobId: jobId || null,
      applicantName,
      phone,
      email: email || null,
      cvUrl: cvUrl || null,
      coverLetter: coverLetter || null,
    },
  });

  return NextResponse.json(application, { status: 201 });
}

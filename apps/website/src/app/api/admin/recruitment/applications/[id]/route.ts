import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound } from '@/lib/api-auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const application = await prisma.jobApplication.findUnique({
    where: { id },
    include: { job: { select: { id: true, titleVi: true } } },
  });

  if (!application) return notFound('JobApplication');
  return NextResponse.json(application);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const { status, cvUrl, coverLetter } = body;

  const data: any = {};
  if (status !== undefined) data.status = status;
  if (cvUrl !== undefined) data.cvUrl = cvUrl;
  if (coverLetter !== undefined) data.coverLetter = coverLetter;

  const updated = await prisma.jobApplication.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

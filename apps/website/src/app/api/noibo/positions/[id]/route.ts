import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, notFound } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const { id } = await params;
  const position = await prisma.hrmPosition.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, code: true, name: true } },
      employees: {
        select: { id: true, employeeCode: true, fullName: true, workEmail: true, employmentStatus: true },
        orderBy: { fullName: 'asc' },
      },
    },
  });

  if (!position) return notFound('Chức vụ');
  return NextResponse.json(position);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;
  const body = await req.json();
  const { code, title, description, departmentId, level, isActive } = body;

  const updated = await prisma.hrmPosition.update({
    where: { id },
    data: {
      ...(code !== undefined && { code }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description: description || null }),
      ...(departmentId !== undefined && { departmentId }),
      ...(level !== undefined && { level }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;
  const counts = await prisma.hrmPosition.findUnique({
    where: { id },
    select: { _count: { select: { employees: true } } },
  });
  if (!counts) return notFound('Chức vụ');
  if (counts._count.employees > 0)
    return badRequest(`Không thể xóa — còn ${counts._count.employees} nhân viên giữ chức vụ`);

  await prisma.hrmPosition.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

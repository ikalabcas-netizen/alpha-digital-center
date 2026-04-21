import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, notFound } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const { id } = await params;
  const dept = await prisma.hrmDepartment.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, code: true, name: true } },
      children: { orderBy: { displayOrder: 'asc' } },
      positions: { orderBy: { level: 'desc' } },
      employees: {
        select: { id: true, employeeCode: true, fullName: true, workEmail: true, position: { select: { title: true } } },
        orderBy: { fullName: 'asc' },
      },
    },
  });

  if (!dept) return notFound('Phòng ban');
  return NextResponse.json(dept);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;
  const body = await req.json();
  const { code, name, description, parentId, managerId, displayOrder, isActive } = body;

  if (parentId === id) return badRequest('Phòng ban không thể là cha của chính nó');

  const updated = await prisma.hrmDepartment.update({
    where: { id },
    data: {
      ...(code !== undefined && { code }),
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description: description || null }),
      ...(parentId !== undefined && { parentId: parentId || null }),
      ...(managerId !== undefined && { managerId: managerId || null }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;

  const counts = await prisma.hrmDepartment.findUnique({
    where: { id },
    select: { _count: { select: { employees: true, children: true, positions: true } } },
  });
  if (!counts) return notFound('Phòng ban');
  if (counts._count.employees > 0)
    return badRequest(`Không thể xóa — còn ${counts._count.employees} nhân viên trong phòng ban`);
  if (counts._count.children > 0)
    return badRequest(`Không thể xóa — còn ${counts._count.children} phòng ban con`);
  if (counts._count.positions > 0)
    return badRequest(`Không thể xóa — còn ${counts._count.positions} chức vụ thuộc phòng ban`);

  await prisma.hrmDepartment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

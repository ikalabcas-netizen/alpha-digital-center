import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

export async function GET(req: NextRequest) {
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const departmentId = req.nextUrl.searchParams.get('departmentId') || undefined;

  const positions = await prisma.hrmPosition.findMany({
    where: { ...(departmentId && { departmentId }) },
    include: {
      department: { select: { id: true, code: true, name: true } },
      _count: { select: { employees: true } },
    },
    orderBy: [{ departmentId: 'asc' }, { level: 'desc' }, { title: 'asc' }],
  });

  return NextResponse.json(positions);
}

export async function POST(req: NextRequest) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const body = await req.json();
  const { code, title, description, departmentId, level, isActive } = body;

  if (!code || !title || !departmentId) return badRequest('code, title, departmentId là bắt buộc');

  const exists = await prisma.hrmPosition.findUnique({ where: { code } });
  if (exists) return badRequest('Mã chức vụ đã tồn tại');

  const dept = await prisma.hrmDepartment.findUnique({ where: { id: departmentId } });
  if (!dept) return badRequest('Phòng ban không tồn tại');

  const created = await prisma.hrmPosition.create({
    data: {
      code,
      title,
      description: description || null,
      departmentId,
      level: level ?? 1,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

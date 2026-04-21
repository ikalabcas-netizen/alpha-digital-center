import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

export async function GET() {
  // Mọi NV đã đăng nhập đều xem được danh sách phòng ban (cho org chart)
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const departments = await prisma.hrmDepartment.findMany({
    include: {
      _count: { select: { employees: true, positions: true, children: true } },
      parent: { select: { id: true, code: true, name: true } },
    },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });

  return NextResponse.json(departments);
}

export async function POST(req: NextRequest) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const body = await req.json();
  const { code, name, description, parentId, managerId, displayOrder, isActive } = body;

  if (!code || !name) return badRequest('code và name là bắt buộc');

  const exists = await prisma.hrmDepartment.findUnique({ where: { code } });
  if (exists) return badRequest('Mã phòng ban đã tồn tại');

  const created = await prisma.hrmDepartment.create({
    data: {
      code,
      name,
      description: description || null,
      parentId: parentId || null,
      managerId: managerId || null,
      displayOrder: displayOrder ?? 0,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

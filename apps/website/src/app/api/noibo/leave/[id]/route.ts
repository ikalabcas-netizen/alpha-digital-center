import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, notFound } from '@/lib/api-auth';
import { requireEmployee, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireEmployee();
  if (!ctx) return noiboUnauthorized();
  const me = ctx.employee!;

  const { id } = await params;
  const item = await prisma.hrmLeaveRequest.findUnique({
    where: { id },
    include: {
      employee: {
        select: { id: true, fullName: true, managerId: true, department: { select: { name: true } } },
      },
      approver: { select: { id: true, fullName: true } },
    },
  });
  if (!item) return notFound('Đơn nghỉ');

  // Quyền xem: chính chủ, manager trực tiếp, hr_admin, hr_manager
  const canView =
    item.employeeId === me.id ||
    item.employee.managerId === me.id ||
    ['hr_admin', 'hr_manager'].includes(me.hrRole);
  if (!canView) return noiboForbidden('Không có quyền xem đơn này');

  return NextResponse.json(item);
}

/**
 * NV chỉ được hủy đơn của chính mình khi còn pending.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireEmployee();
  if (!ctx) return noiboUnauthorized();
  const me = ctx.employee!;

  const { id } = await params;
  const item = await prisma.hrmLeaveRequest.findUnique({ where: { id } });
  if (!item) return notFound('Đơn nghỉ');

  const canCancel =
    (item.employeeId === me.id && item.status === 'pending') ||
    ['hr_admin', 'hr_manager'].includes(me.hrRole);
  if (!canCancel) return noiboForbidden('Không thể hủy đơn này');

  await prisma.hrmLeaveRequest.update({
    where: { id },
    data: { status: 'cancelled' },
  });

  return NextResponse.json({ success: true });
}

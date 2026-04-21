import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, notFound } from '@/lib/api-auth';
import { requireEmployee, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

/**
 * POST /api/noibo/leave/[id]/approve
 * Body: { decision: "approved" | "rejected", rejectReason?: string }
 *
 * Quyền: manager trực tiếp của NV, hoặc hr_admin/hr_manager.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireEmployee();
  if (!ctx) return noiboUnauthorized();
  const me = ctx.employee!;

  const { id } = await params;
  const body = await req.json();
  const { decision, rejectReason } = body;

  if (!['approved', 'rejected'].includes(decision)) return badRequest('decision phải là approved hoặc rejected');

  const leave = await prisma.hrmLeaveRequest.findUnique({
    where: { id },
    include: { employee: { select: { managerId: true } } },
  });
  if (!leave) return notFound('Đơn nghỉ');

  if (leave.status !== 'pending') {
    return badRequest(`Đơn đã ${leave.status}, không thể duyệt lại`);
  }

  const isApprover =
    leave.employee.managerId === me.id || ['hr_admin', 'hr_manager'].includes(me.hrRole);
  if (!isApprover) return noiboForbidden('Bạn không có quyền duyệt đơn này');

  if (decision === 'rejected' && !rejectReason?.trim()) {
    return badRequest('Cần lý do từ chối');
  }

  const updated = await prisma.hrmLeaveRequest.update({
    where: { id },
    data: {
      status: decision,
      approverId: me.id,
      approvedAt: new Date(),
      rejectReason: decision === 'rejected' ? rejectReason.trim() : null,
    },
  });

  return NextResponse.json(updated);
}

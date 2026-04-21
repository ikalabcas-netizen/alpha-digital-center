import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest } from '@/lib/api-auth';
import { requireEmployee, requireHrApprover, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';
import { inclusiveDayCount } from '@/lib/noibo/shifts';

const LEAVE_TYPES = ['annual', 'sick', 'unpaid', 'maternity', 'wedding', 'bereavement', 'other'];

/**
 * GET /api/noibo/leave?scope=mine|team|all&status=pending&from=...&to=...
 *  - mine: của user hiện tại
 *  - team: NV trực tiếp báo cáo cho user (yêu cầu quyền approver)
 *  - all: toàn bộ (yêu cầu hr_admin)
 */
export async function GET(req: NextRequest) {
  const ctx = await requireEmployee();
  if (!ctx) return noiboUnauthorized();
  const me = ctx.employee!;

  const sp = req.nextUrl.searchParams;
  const scope = sp.get('scope') ?? 'mine';
  const status = sp.get('status') || undefined;
  const from = sp.get('from') ? new Date(sp.get('from')!) : undefined;
  const to = sp.get('to') ? new Date(sp.get('to')!) : undefined;

  let where: any = {};
  if (scope === 'mine') {
    where.employeeId = me.id;
  } else if (scope === 'team') {
    if (!['hr_admin', 'hr_manager', 'manager'].includes(me.hrRole)) {
      return noiboForbidden('Cần quyền duyệt nghỉ');
    }
    // NV báo cáo trực tiếp + chính mình (để xem lịch sử)
    where.OR = [{ employee: { managerId: me.id } }, { employeeId: me.id }];
  } else if (scope === 'all') {
    if (!['hr_admin', 'hr_manager'].includes(me.hrRole)) {
      return noiboForbidden('Cần quyền HR Admin');
    }
  }

  if (status) where.status = status;
  if (from || to) {
    where.AND = [];
    if (from) where.AND.push({ endDate: { gte: from } });
    if (to) where.AND.push({ startDate: { lte: to } });
  }

  const items = await prisma.hrmLeaveRequest.findMany({
    where,
    include: {
      employee: {
        select: {
          id: true,
          fullName: true,
          employeeCode: true,
          department: { select: { name: true } },
          position: { select: { title: true } },
        },
      },
      approver: { select: { id: true, fullName: true } },
    },
    orderBy: [{ status: 'asc' }, { startDate: 'desc' }],
  });

  return NextResponse.json(items);
}

/**
 * POST /api/noibo/leave
 * NV submit đơn nghỉ phép cho chính mình.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireEmployee();
  if (!ctx) return noiboUnauthorized();
  const me = ctx.employee!;

  const body = await req.json();
  const { leaveType, startDate, endDate, totalDays, reason, attachmentUrl } = body;

  if (!leaveType || !LEAVE_TYPES.includes(leaveType)) return badRequest('leaveType không hợp lệ');
  if (!startDate || !endDate) return badRequest('Cần startDate và endDate');

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return badRequest('Ngày không hợp lệ');
  if (end < start) return badRequest('endDate phải >= startDate');

  // Auto tính totalDays nếu không gửi (cho phép user override để xin nửa ngày)
  const computedDays = inclusiveDayCount(start, end);
  const finalDays = typeof totalDays === 'number' && totalDays > 0 ? totalDays : computedDays;

  const created = await prisma.hrmLeaveRequest.create({
    data: {
      employeeId: me.id,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays: finalDays,
      reason: reason || null,
      attachmentUrl: attachmentUrl || null,
      status: 'pending',
    },
  });

  return NextResponse.json(created, { status: 201 });
}

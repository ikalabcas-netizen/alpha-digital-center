import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireEmployee, noiboUnauthorized } from '@/lib/noibo/auth';
import { vnDateOnly } from '@/lib/noibo/shifts';

/**
 * GET /api/noibo/attendance/me?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Mặc định: 30 ngày gần nhất.
 */
export async function GET(req: NextRequest) {
  const ctx = await requireEmployee();
  if (!ctx) return noiboUnauthorized();
  const employee = ctx.employee!;

  const sp = req.nextUrl.searchParams;
  const today = vnDateOnly(new Date());
  const defaultFrom = new Date(today);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);

  const from = sp.get('from') ? new Date(sp.get('from')!) : defaultFrom;
  const to = sp.get('to') ? new Date(sp.get('to')!) : today;

  const [attendances, assignments, todayRow] = await Promise.all([
    prisma.hrmAttendance.findMany({
      where: { employeeId: employee.id, workDate: { gte: from, lte: to } },
      orderBy: { workDate: 'desc' },
    }),
    prisma.hrmShiftAssignment.findMany({
      where: { employeeId: employee.id, workDate: { gte: from, lte: to } },
      include: { template: { select: { code: true, name: true, startTime: true, endTime: true } } },
    }),
    prisma.hrmAttendance.findUnique({
      where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
    }),
  ]);

  const todayShift = await prisma.hrmShiftAssignment.findUnique({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
    include: { template: true },
  });

  return NextResponse.json({
    employee: {
      id: employee.id,
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
    },
    today: {
      attendance: todayRow,
      shift: todayShift?.template ?? null,
    },
    attendances,
    assignments,
  });
}

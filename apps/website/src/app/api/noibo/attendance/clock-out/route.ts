import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest } from '@/lib/api-auth';
import { requireEmployee, noiboUnauthorized } from '@/lib/noibo/auth';
import { checkInsideAnyOffice } from '@/lib/noibo/geo';
import { checkIpWhitelist } from '@/lib/noibo/ip-whitelist';
import { computeAttendanceStatus, vnDateOnly } from '@/lib/noibo/shifts';

export async function POST(req: NextRequest) {
  const ctx = await requireEmployee();
  if (!ctx) return noiboUnauthorized();
  const employee = ctx.employee!;

  const body = await req.json().catch(() => ({}));
  const lat = typeof body.lat === 'number' ? body.lat : null;
  const lng = typeof body.lng === 'number' ? body.lng : null;

  if (lat === null || lng === null) return badRequest('Cần truyền lat và lng');

  const geoCheck = checkInsideAnyOffice(lat, lng);
  if (!geoCheck.ok) {
    return NextResponse.json(
      { error: 'OUT_OF_OFFICE', message: geoCheck.message, distanceM: geoCheck.distanceM },
      { status: 403 }
    );
  }

  const ipCheck = checkIpWhitelist(req);
  if (!ipCheck.ok) {
    return NextResponse.json(
      { error: 'IP_NOT_ALLOWED', message: ipCheck.message, ip: ipCheck.ip },
      { status: 403 }
    );
  }

  const now = new Date();
  const today = vnDateOnly(now);

  const existing = await prisma.hrmAttendance.findUnique({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
  });
  if (!existing?.clockInAt) {
    return NextResponse.json(
      { error: 'NOT_CLOCKED_IN', message: 'Bạn chưa chấm công vào ca hôm nay' },
      { status: 400 }
    );
  }
  if (existing.clockOutAt) {
    return NextResponse.json(
      { error: 'ALREADY_CLOCKED_OUT', message: 'Đã chấm công ra ca rồi', clockOutAt: existing.clockOutAt },
      { status: 409 }
    );
  }

  // Re-compute status với clockOutAt để có workMinutes
  const assignment = await prisma.hrmShiftAssignment.findUnique({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
    include: { template: true },
  });

  let status = existing.status;
  let workMinutes: number | null = null;
  if (assignment?.template) {
    const result = computeAttendanceStatus({
      shiftStart: assignment.template.startTime,
      shiftEnd: assignment.template.endTime,
      lateAfterMin: assignment.template.lateAfterMin,
      clockInAt: existing.clockInAt,
      clockOutAt: now,
    });
    status = result.status;
    workMinutes = result.workMinutes;
  } else {
    // Fallback: tính workMinutes thô = (now - clockIn) / 60_000
    workMinutes = Math.round((now.getTime() - existing.clockInAt.getTime()) / 60_000);
  }

  const row = await prisma.hrmAttendance.update({
    where: { id: existing.id },
    data: {
      clockOutAt: now,
      clockOutLat: lat,
      clockOutLng: lng,
      clockOutIp: ipCheck.ip,
      status,
      workMinutes,
    },
  });

  return NextResponse.json({ ok: true, attendance: row, workMinutes });
}

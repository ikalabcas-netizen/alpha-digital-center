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

  if (lat === null || lng === null) {
    return badRequest('Cần truyền lat và lng (yêu cầu quyền truy cập vị trí trên trình duyệt)');
  }

  // 1. Check geofence
  const geoCheck = checkInsideAnyOffice(lat, lng);
  if (!geoCheck.ok) {
    return NextResponse.json(
      { error: 'OUT_OF_OFFICE', message: geoCheck.message, distanceM: geoCheck.distanceM },
      { status: 403 }
    );
  }

  // 2. Check IP
  const ipCheck = checkIpWhitelist(req);
  if (!ipCheck.ok) {
    return NextResponse.json(
      { error: 'IP_NOT_ALLOWED', message: ipCheck.message, ip: ipCheck.ip },
      { status: 403 }
    );
  }

  const now = new Date();
  const today = vnDateOnly(now);

  // 3. Check existing attendance
  const existing = await prisma.hrmAttendance.findUnique({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
  });
  if (existing?.clockInAt) {
    return NextResponse.json(
      {
        error: 'ALREADY_CLOCKED_IN',
        message: 'Bạn đã chấm công vào ca hôm nay',
        clockInAt: existing.clockInAt,
      },
      { status: 409 }
    );
  }

  // 4. Resolve shift template (assigned ngày này, fallback default ca 8-17)
  const assignment = await prisma.hrmShiftAssignment.findUnique({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
    include: { template: true },
  });

  let status: string = 'present';
  let lateMinutes = 0;
  if (assignment?.template) {
    const result = computeAttendanceStatus({
      shiftStart: assignment.template.startTime,
      shiftEnd: assignment.template.endTime,
      lateAfterMin: assignment.template.lateAfterMin,
      clockInAt: now,
    });
    status = result.status;
    lateMinutes = result.lateMinutes;
  }

  // 5. Upsert attendance row
  const row = await prisma.hrmAttendance.upsert({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
    update: {
      clockInAt: now,
      clockInLat: lat,
      clockInLng: lng,
      clockInIp: ipCheck.ip,
      status,
    },
    create: {
      employeeId: employee.id,
      workDate: today,
      clockInAt: now,
      clockInLat: lat,
      clockInLng: lng,
      clockInIp: ipCheck.ip,
      status,
    },
  });

  return NextResponse.json({
    ok: true,
    attendance: row,
    geo: { matchedOffice: geoCheck.matchedOffice?.name, distanceM: geoCheck.distanceM },
    ip: ipCheck.ip,
    lateMinutes,
  });
}

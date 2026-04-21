import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireEmployee } from '@/lib/noibo/auth';
import { redirect } from 'next/navigation';
import { ClockInButton } from '@/components/noibo/ClockInButton';
import { NoiboCenterMessage } from '@/components/noibo/NoiboShell';
import { vnDateOnly } from '@/lib/noibo/shifts';
import { colors, fonts, cardStyle, pageTitle, pageSubtitle } from '@/lib/styles';

export default async function AttendancePage() {
  const ctx = await requireEmployee();
  if (!ctx) {
    return (
      <NoiboCenterMessage
        title="Chưa có hồ sơ"
        description="Tài khoản chưa được liên kết với hồ sơ nhân viên — chưa thể chấm công. Liên hệ HR để được tạo hồ sơ."
      />
    );
  }
  const employee = ctx.employee!;
  const today = vnDateOnly(new Date());

  const [todayAttendance, todayShift, weekAttendances] = await Promise.all([
    prisma.hrmAttendance.findUnique({
      where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
    }),
    prisma.hrmShiftAssignment.findUnique({
      where: { employeeId_workDate: { employeeId: employee.id, workDate: today } },
      include: { template: true },
    }),
    prisma.hrmAttendance.findMany({
      where: {
        employeeId: employee.id,
        workDate: { gte: addDays(today, -6), lte: today },
      },
      orderBy: { workDate: 'desc' },
    }),
  ]);

  const shiftLabel = todayShift?.template
    ? `${todayShift.template.name} (${todayShift.template.startTime} – ${todayShift.template.endTime})`
    : 'Chưa được xếp ca cho hôm nay';

  // Map ngày → attendance
  const map = new Map(weekAttendances.map((a) => [vnDateOnly(a.workDate).toISOString(), a]));

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={pageTitle}>Chấm công</h1>
          <div style={pageSubtitle}>
            Hôm nay: <strong>{today.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
          </div>
        </div>
        <Link href="/attendance/history" style={{ fontSize: 13, color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>
          Lịch sử chấm công →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 480px) 1fr', gap: 24, alignItems: 'flex-start' }}>
        <ClockInButton
          initialAttendance={
            todayAttendance
              ? {
                  id: todayAttendance.id,
                  clockInAt: todayAttendance.clockInAt?.toISOString() ?? null,
                  clockOutAt: todayAttendance.clockOutAt?.toISOString() ?? null,
                  status: todayAttendance.status,
                  workMinutes: todayAttendance.workMinutes,
                }
              : null
          }
          shiftLabel={shiftLabel}
        />

        <div style={{ ...cardStyle, padding: 20 }}>
          <div style={{ fontSize: 12, color: colors.textLight, fontFamily: fonts.mono, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>
            7 ngày gần nhất
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: 7 }, (_, i) => {
              const d = addDays(today, -i);
              const a = map.get(d.toISOString());
              return <DayRow key={i} date={d} attendance={a ?? null} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayRow({ date, attendance }: { date: Date; attendance: any }) {
  const today = vnDateOnly(new Date());
  const isToday = date.getTime() === today.getTime();
  const status = attendance?.status;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 80px 80px 1fr',
        gap: 10,
        alignItems: 'center',
        padding: '8px 4px',
        borderBottom: `1px dashed ${colors.borderSoft}`,
        fontSize: 13,
        fontFamily: fonts.body,
      }}
    >
      <div style={{ color: isToday ? colors.accent : colors.textPrimary, fontWeight: isToday ? 700 : 400 }}>
        {date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
      </div>
      <div style={{ color: attendance?.clockInAt ? colors.textPrimary : colors.textMuted, fontFamily: fonts.mono }}>
        {attendance?.clockInAt ? formatTime(attendance.clockInAt) : '—'}
      </div>
      <div style={{ color: attendance?.clockOutAt ? colors.textPrimary : colors.textMuted, fontFamily: fonts.mono }}>
        {attendance?.clockOutAt ? formatTime(attendance.clockOutAt) : '—'}
      </div>
      <div>
        {status && <StatusBadge status={status} />}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    present: { label: 'Đúng giờ', bg: `${colors.success}15`, color: colors.success },
    late: { label: 'Đi trễ', bg: `${colors.warning}18`, color: colors.warning },
    absent: { label: 'Vắng', bg: `${colors.danger}15`, color: colors.danger },
    half_day: { label: 'Nửa ngày', bg: `${colors.info}15`, color: colors.info },
    remote: { label: 'Remote', bg: `${colors.accent}15`, color: colors.accent },
  };
  const cfg = map[status] ?? { label: status, bg: colors.borderSoft, color: colors.textSecondary };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
}

function formatTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
}
function addDays(d: Date, days: number) {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}

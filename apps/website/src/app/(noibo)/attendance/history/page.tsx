import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireEmployee } from '@/lib/noibo/auth';
import { vnDateOnly } from '@/lib/noibo/shifts';
import { NoiboCenterMessage } from '@/components/noibo/NoiboShell';
import { StatusBadge } from '@/app/(noibo)/attendance/page';
import { colors, fonts, cardStyle, pageTitle, pageSubtitle } from '@/lib/styles';

export default async function AttendanceHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const ctx = await requireEmployee();
  if (!ctx) {
    return <NoiboCenterMessage title="Chưa có hồ sơ" description="Liên hệ HR để tạo hồ sơ." />;
  }
  const employee = ctx.employee!;
  const sp = await searchParams;

  const today = vnDateOnly(new Date());
  const defaultFrom = new Date(today);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);

  const from = sp.from ? new Date(sp.from) : defaultFrom;
  const to = sp.to ? new Date(sp.to) : today;

  const [attendances, assignments] = await Promise.all([
    prisma.hrmAttendance.findMany({
      where: { employeeId: employee.id, workDate: { gte: from, lte: to } },
      orderBy: { workDate: 'desc' },
    }),
    prisma.hrmShiftAssignment.findMany({
      where: { employeeId: employee.id, workDate: { gte: from, lte: to } },
      include: { template: { select: { name: true, startTime: true, endTime: true } } },
    }),
  ]);

  const shiftMap = new Map(assignments.map((a) => [vnDateOnly(a.workDate).toISOString(), a]));
  const totalDays = attendances.length;
  const lateDays = attendances.filter((a) => a.status === 'late').length;
  const totalMinutes = attendances.reduce((sum, a) => sum + (a.workMinutes ?? 0), 0);

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={pageTitle}>Lịch sử chấm công</h1>
          <div style={pageSubtitle}>
            Từ <strong>{from.toLocaleDateString('vi-VN')}</strong> đến <strong>{to.toLocaleDateString('vi-VN')}</strong>
          </div>
        </div>
        <Link href="/attendance" style={{ fontSize: 13, color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>
          ← Về chấm công
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        <Stat label="Số ngày có chấm" value={totalDays.toString()} />
        <Stat label="Số ngày đi trễ" value={lateDays.toString()} accent={lateDays > 0 ? colors.warning : undefined} />
        <Stat label="Tổng giờ làm" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} />
      </div>

      {attendances.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          Chưa có dữ liệu chấm công trong khoảng này.
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: fonts.body }}>
            <thead>
              <tr style={{ background: colors.borderSoft, color: colors.textSecondary, textAlign: 'left' }}>
                <Th>Ngày</Th>
                <Th>Ca</Th>
                <Th>Vào</Th>
                <Th>Ra</Th>
                <Th>Tổng giờ</Th>
                <Th>Trạng thái</Th>
                <Th>Ghi chú</Th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a) => {
                const shift = shiftMap.get(vnDateOnly(a.workDate).toISOString());
                return (
                  <tr key={a.id} style={{ borderTop: `1px solid ${colors.borderSoft}` }}>
                    <Td>
                      {a.workDate.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </Td>
                    <Td>{shift?.template ? `${shift.template.name} (${shift.template.startTime}–${shift.template.endTime})` : '—'}</Td>
                    <Td style={{ fontFamily: fonts.mono }}>{a.clockInAt ? formatTime(a.clockInAt) : '—'}</Td>
                    <Td style={{ fontFamily: fonts.mono }}>{a.clockOutAt ? formatTime(a.clockOutAt) : '—'}</Td>
                    <Td>{a.workMinutes ? `${Math.floor(a.workMinutes / 60)}h ${a.workMinutes % 60}m` : '—'}</Td>
                    <Td><StatusBadge status={a.status} /></Td>
                    <Td style={{ color: colors.textLight }}>{a.note ?? ''}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: '10px 14px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, fontFamily: fonts.mono }}>
      {children}
    </th>
  );
}
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: '10px 14px', ...style }}>{children}</td>;
}
function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ ...cardStyle, padding: 14 }}>
      <div style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 18, fontWeight: 700, color: accent ?? colors.textPrimary, fontFamily: fonts.heading }}>
        {value}
      </div>
    </div>
  );
}
function formatTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
}

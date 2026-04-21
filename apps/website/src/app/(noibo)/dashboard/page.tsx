import Link from 'next/link';
import { requireNoibo } from '@/lib/noibo/auth';
import { colors, fonts, cardStyle, pageTitle, pageSubtitle, primaryButton } from '@/lib/styles';

export default async function NoiboDashboardPage() {
  const ctx = await requireNoibo();
  const employee = ctx?.employee;

  if (!employee) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={pageTitle}>Chào bạn 👋</h1>
          <div style={pageSubtitle}>
            Tài khoản <strong>{ctx?.email}</strong> chưa được liên kết với hồ sơ nhân viên.
          </div>
        </div>
        <div style={{ ...cardStyle, padding: 24, maxWidth: 560 }}>
          <div style={{ fontSize: 14, color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 12 }}>
            Vui lòng liên hệ phòng Nhân sự để được tạo hồ sơ và gán quyền truy cập hệ thống nội bộ.
          </div>
          <div style={{ fontSize: 12, color: colors.textLight }}>
            Sau khi HR cập nhật, bạn cần <strong>đăng xuất và đăng nhập lại</strong> để áp dụng quyền mới.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Chào, {employee.fullName.split(' ').slice(-1)[0]} 👋</h1>
        <div style={pageSubtitle}>
          {employee.position.title} · {employee.department.name} · Mã NV: <code>{employee.employeeCode}</code>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatCard label="Trạng thái" value={statusLabel(employee.employmentStatus)} accent={statusColor(employee.employmentStatus)} />
        <StatCard label="Loại HĐ" value={typeLabel(employee.employmentType)} />
        <StatCard label="Ngày vào" value={formatDate(employee.hireDate)} />
        <StatCard label="Quản lý trực tiếp" value={employee.manager?.fullName ?? '—'} />
      </div>

      <div style={{ ...cardStyle, padding: 20, maxWidth: 720 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, fontFamily: fonts.heading }}>
          Phân hệ đang triển khai
        </div>
        <div style={{ fontSize: 13, color: colors.textLight, lineHeight: 1.6 }}>
          Phase 1 (hiện tại): Hồ sơ nhân viên · Phòng ban · Chức vụ · Sơ đồ tổ chức.
          <br />
          Sắp tới: Chấm công GPS+IP · Xếp ca · Nghỉ phép · Giao việc · KPI.
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <Link href="/profile">
            <button style={primaryButton}>Xem hồ sơ</button>
          </Link>
          <Link href="/org">
            <button style={{ ...primaryButton, background: colors.navy900, boxShadow: 'none' }}>Sơ đồ tổ chức</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ ...cardStyle, padding: 16 }}>
      <div style={{ fontSize: 11, color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: fonts.mono }}>
        {label}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 16,
          fontWeight: 700,
          color: accent ?? colors.textPrimary,
          fontFamily: fonts.heading,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function statusLabel(s: string) {
  return (
    {
      probation: 'Thử việc',
      active: 'Chính thức',
      on_leave: 'Tạm nghỉ',
      terminated: 'Đã nghỉ',
    }[s] ?? s
  );
}
function statusColor(s: string) {
  return (
    {
      probation: colors.warning,
      active: colors.success,
      on_leave: colors.info,
      terminated: colors.danger,
    } as Record<string, string>
  )[s];
}
function typeLabel(t: string) {
  return (
    {
      full_time: 'Toàn thời gian',
      part_time: 'Bán thời gian',
      contractor: 'Cộng tác viên',
      intern: 'Thực tập',
    }[t] ?? t
  );
}
function formatDate(d: Date | string | null | undefined) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('vi-VN');
}

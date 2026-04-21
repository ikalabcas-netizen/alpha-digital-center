import { requireNoibo } from '@/lib/noibo/auth';
import { NoiboCenterMessage } from '@/components/noibo/NoiboShell';
import { colors, fonts, cardStyle, pageTitle, pageSubtitle } from '@/lib/styles';

export default async function NoiboProfilePage() {
  const ctx = await requireNoibo();
  const employee = ctx?.employee;

  if (!employee) {
    return (
      <NoiboCenterMessage
        title="Chưa có hồ sơ"
        description="Tài khoản của bạn chưa được liên kết với hồ sơ nhân viên. Vui lòng liên hệ phòng Nhân sự."
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Hồ sơ của tôi</h1>
        <div style={pageSubtitle}>Thông tin do phòng Nhân sự quản lý — liên hệ HR để cập nhật.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20, maxWidth: 980 }}>
        <Section title="Thông tin cơ bản">
          <Field label="Họ và tên" value={employee.fullName} />
          <Field label="Mã nhân viên" value={employee.employeeCode} />
          <Field label="Email công việc" value={employee.workEmail} />
          <Field label="Email cá nhân" value={employee.personalEmail} />
          <Field label="Điện thoại" value={employee.phone} />
          <Field label="Giới tính" value={genderLabel(employee.gender)} />
          <Field label="Ngày sinh" value={formatDate(employee.dob)} />
          <Field label="CCCD/CMND" value={employee.nationalId} />
          <Field label="Địa chỉ" value={employee.address} />
        </Section>

        <Section title="Vị trí công việc">
          <Field label="Phòng ban" value={employee.department.name} />
          <Field label="Chức vụ" value={employee.position.title} />
          <Field label="Quản lý trực tiếp" value={employee.manager?.fullName} />
          <Field label="Loại hợp đồng" value={typeLabel(employee.employmentType)} />
          <Field label="Trạng thái" value={statusLabel(employee.employmentStatus)} />
          <Field label="Ngày vào làm" value={formatDate(employee.hireDate)} />
          <Field label="Hết thử việc" value={formatDate(employee.probationEndDate)} />
          {employee.terminationDate && <Field label="Ngày nghỉ" value={formatDate(employee.terminationDate)} />}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...cardStyle, padding: '20px 22px' }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: colors.textPrimary,
          fontFamily: fonts.heading,
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: `1px solid ${colors.borderSoft}`,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, fontSize: 13, fontFamily: fonts.body }}>
      <div style={{ color: colors.textLight }}>{label}</div>
      <div style={{ color: colors.textPrimary, fontWeight: 500 }}>{value || '—'}</div>
    </div>
  );
}

function genderLabel(g?: string | null) {
  if (!g) return '—';
  return ({ male: 'Nam', female: 'Nữ', other: 'Khác' } as Record<string, string>)[g] ?? g;
}
function statusLabel(s: string) {
  return ({ probation: 'Thử việc', active: 'Chính thức', on_leave: 'Tạm nghỉ', terminated: 'Đã nghỉ' } as Record<string, string>)[s] ?? s;
}
function typeLabel(t: string) {
  return (
    { full_time: 'Toàn thời gian', part_time: 'Bán thời gian', contractor: 'Cộng tác viên', intern: 'Thực tập' } as Record<string, string>
  )[t] ?? t;
}
function formatDate(d: Date | string | null | undefined) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('vi-VN');
}

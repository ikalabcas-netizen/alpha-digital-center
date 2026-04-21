'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Edit2, Trash2, Search, UserPlus } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import {
  colors,
  fonts,
  cardStyle,
  pageTitle,
  pageSubtitle,
  primaryButton,
  secondaryButton,
  inputStyle,
} from '@/lib/styles';

type Department = { id: string; code: string; name: string };
type Position = { id: string; code: string; title: string; departmentId: string };

type Employee = {
  id: string;
  employeeCode: string;
  fullName: string;
  workEmail: string;
  personalEmail: string | null;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  nationalId: string | null;
  address: string | null;
  avatarUrl: string | null;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  hireDate: string;
  probationEndDate: string | null;
  terminationDate: string | null;
  employmentStatus: string;
  employmentType: string;
  hrRole: string;
  note: string | null;
  department?: Department;
  position?: Position;
  manager?: { id: string; fullName: string } | null;
  user?: { id: string; email: string; image: string | null } | null;
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textSecondary,
  marginBottom: 4,
  display: 'block',
};

const STATUS_OPTIONS: Array<{ value: string; label: string; color: string }> = [
  { value: 'probation', label: 'Thử việc', color: colors.warning },
  { value: 'active', label: 'Chính thức', color: colors.success },
  { value: 'on_leave', label: 'Tạm nghỉ', color: colors.info },
  { value: 'terminated', label: 'Đã nghỉ', color: colors.danger },
];

const TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'full_time', label: 'Toàn thời gian' },
  { value: 'part_time', label: 'Bán thời gian' },
  { value: 'contractor', label: 'Cộng tác viên' },
  { value: 'intern', label: 'Thực tập' },
];

const ROLE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'employee', label: 'Nhân viên' },
  { value: 'manager', label: 'Quản lý' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'hr_admin', label: 'HR Admin' },
];

export default function EmployeesAdminPage() {
  const [items, setItems] = useState<Employee[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<Employee> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterDept) params.set('departmentId', filterDept);
    if (filterStatus) params.set('status', filterStatus);
    if (search.trim()) params.set('q', search.trim());

    const [emps, ds, ps] = await Promise.all([
      apiGet<Employee[]>(`/api/noibo/employees?${params.toString()}`),
      apiGet<Department[]>('/api/noibo/departments'),
      apiGet<Position[]>('/api/noibo/positions'),
    ]);
    setItems(emps);
    setDepts(ds);
    setPositions(ps);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDept, filterStatus]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filteredPositions = useMemo(
    () => (editing?.departmentId ? positions.filter((p) => p.departmentId === editing.departmentId) : positions),
    [positions, editing?.departmentId]
  );

  async function save() {
    if (!editing) return;
    try {
      const payload: any = {
        employeeCode: editing.employeeCode?.trim(),
        fullName: editing.fullName?.trim(),
        workEmail: editing.workEmail?.trim().toLowerCase(),
        personalEmail: editing.personalEmail || null,
        phone: editing.phone || null,
        dob: editing.dob || null,
        gender: editing.gender || null,
        nationalId: editing.nationalId || null,
        address: editing.address || null,
        avatarUrl: editing.avatarUrl || null,
        departmentId: editing.departmentId,
        positionId: editing.positionId,
        managerId: editing.managerId || null,
        hireDate: editing.hireDate,
        probationEndDate: editing.probationEndDate || null,
        terminationDate: editing.terminationDate || null,
        employmentStatus: editing.employmentStatus || 'probation',
        employmentType: editing.employmentType || 'full_time',
        hrRole: editing.hrRole || 'employee',
        note: editing.note || null,
      };
      if (!payload.employeeCode || !payload.fullName || !payload.workEmail || !payload.departmentId || !payload.positionId || !payload.hireDate) {
        alert('Mã NV, họ tên, email công việc, phòng ban, chức vụ, ngày vào làm là bắt buộc');
        return;
      }
      if (editing.id) await apiPut(`/api/noibo/employees/${editing.id}`, payload);
      else await apiPost('/api/noibo/employees', payload);
      setEditing(null);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function remove(it: Employee) {
    if (!confirm(`Xóa hồ sơ "${it.fullName}"? (Khuyến nghị: chuyển trạng thái sang "Đã nghỉ" thay vì xóa)`)) return;
    try {
      await apiDelete(`/api/noibo/employees/${it.id}`);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={pageTitle}>Nhân viên</h1>
          <div style={pageSubtitle}>Hồ sơ nhân sự — link tự động với Google account khi email trùng</div>
        </div>
        <button
          style={primaryButton}
          onClick={() =>
            setEditing({
              employeeCode: '',
              hireDate: new Date().toISOString().slice(0, 10),
              employmentStatus: 'probation',
              employmentType: 'full_time',
              hrRole: 'employee',
            })
          }
        >
          <UserPlus size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
          Thêm nhân viên
        </button>
      </div>

      {/* Filters */}
      <div style={{ ...cardStyle, padding: 12, marginBottom: 14, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: 13, color: colors.textLight }} />
          <input
            placeholder="Tìm theo tên, mã NV, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 32 }}
          />
        </div>
        <select style={inputStyle as any} value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">Tất cả phòng ban</option>
          {depts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select style={inputStyle as any} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ color: colors.textLight, fontSize: 14 }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          Không có nhân viên nào khớp bộ lọc.
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: fonts.body }}>
            <thead>
              <tr style={{ background: colors.borderSoft, color: colors.textSecondary, textAlign: 'left' }}>
                <Th>Nhân viên</Th>
                <Th>Phòng ban / Chức vụ</Th>
                <Th>Quản lý</Th>
                <Th>Trạng thái</Th>
                <Th>Quyền HR</Th>
                <Th>Liên kết</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => {
                const status = STATUS_OPTIONS.find((s) => s.value === e.employmentStatus);
                const role = ROLE_OPTIONS.find((r) => r.value === e.hrRole);
                return (
                  <tr key={e.id} style={{ borderTop: `1px solid ${colors.borderSoft}` }}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {e.avatarUrl || e.user?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={e.avatarUrl || e.user?.image || ''}
                            alt=""
                            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: `${colors.accent}22`,
                              color: colors.accent,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontFamily: fonts.heading,
                              fontSize: 13,
                            }}
                          >
                            {e.fullName[0]?.toUpperCase()}
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: colors.textPrimary }}>{e.fullName}</div>
                          <div style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>
                            {e.employeeCode} · {e.workEmail}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div>{e.department?.name}</div>
                      <div style={{ fontSize: 12, color: colors.textLight }}>{e.position?.title}</div>
                    </Td>
                    <Td>{e.manager?.fullName ?? '—'}</Td>
                    <Td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: `${status?.color}18`,
                          color: status?.color,
                        }}
                      >
                        {status?.label ?? e.employmentStatus}
                      </span>
                    </Td>
                    <Td>{role?.label ?? e.hrRole}</Td>
                    <Td>
                      {e.user ? (
                        <span style={{ color: colors.success, fontSize: 12 }}>✓ Đã liên kết</span>
                      ) : (
                        <span style={{ color: colors.warning, fontSize: 12 }}>Chưa có Google</span>
                      )}
                    </Td>
                    <Td style={{ whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => setEditing(e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight, padding: 6 }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => remove(e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.danger, padding: 6 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal
          isOpen
          onClose={() => setEditing(null)}
          title={editing.id ? `Sửa: ${editing.fullName}` : 'Thêm nhân viên'}
          maxWidth={680}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionTitle>Thông tin cơ bản</SectionTitle>
            <Grid cols="160px 1fr">
              <Field label="Mã NV *">
                <input
                  style={{ ...inputStyle, fontFamily: fonts.mono }}
                  value={editing.employeeCode || ''}
                  onChange={(ev) => setEditing({ ...editing, employeeCode: ev.target.value })}
                  placeholder="ADC-0001"
                />
              </Field>
              <Field label="Họ và tên *">
                <input
                  style={inputStyle}
                  value={editing.fullName || ''}
                  onChange={(ev) => setEditing({ ...editing, fullName: ev.target.value })}
                />
              </Field>
            </Grid>
            <Grid cols="1fr 1fr">
              <Field label="Email công việc * (dùng để login Google)">
                <input
                  style={inputStyle}
                  type="email"
                  value={editing.workEmail || ''}
                  onChange={(ev) => setEditing({ ...editing, workEmail: ev.target.value })}
                />
              </Field>
              <Field label="Email cá nhân">
                <input
                  style={inputStyle}
                  type="email"
                  value={editing.personalEmail || ''}
                  onChange={(ev) => setEditing({ ...editing, personalEmail: ev.target.value })}
                />
              </Field>
            </Grid>
            <Grid cols="1fr 1fr 1fr">
              <Field label="Điện thoại">
                <input style={inputStyle} value={editing.phone || ''} onChange={(ev) => setEditing({ ...editing, phone: ev.target.value })} />
              </Field>
              <Field label="Ngày sinh">
                <input
                  style={inputStyle}
                  type="date"
                  value={editing.dob ? String(editing.dob).slice(0, 10) : ''}
                  onChange={(ev) => setEditing({ ...editing, dob: ev.target.value })}
                />
              </Field>
              <Field label="Giới tính">
                <select
                  style={inputStyle as any}
                  value={editing.gender || ''}
                  onChange={(ev) => setEditing({ ...editing, gender: ev.target.value })}
                >
                  <option value="">—</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </Field>
            </Grid>
            <Grid cols="1fr 1fr">
              <Field label="CCCD/CMND">
                <input
                  style={inputStyle}
                  value={editing.nationalId || ''}
                  onChange={(ev) => setEditing({ ...editing, nationalId: ev.target.value })}
                />
              </Field>
              <Field label="Avatar URL">
                <input
                  style={inputStyle}
                  value={editing.avatarUrl || ''}
                  onChange={(ev) => setEditing({ ...editing, avatarUrl: ev.target.value })}
                />
              </Field>
            </Grid>
            <Field label="Địa chỉ">
              <input style={inputStyle} value={editing.address || ''} onChange={(ev) => setEditing({ ...editing, address: ev.target.value })} />
            </Field>

            <SectionTitle>Vị trí công việc</SectionTitle>
            <Grid cols="1fr 1fr">
              <Field label="Phòng ban *">
                <select
                  style={inputStyle as any}
                  value={editing.departmentId || ''}
                  onChange={(ev) => setEditing({ ...editing, departmentId: ev.target.value, positionId: undefined })}
                >
                  <option value="">— Chọn —</option>
                  {depts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Chức vụ *">
                <select
                  style={inputStyle as any}
                  value={editing.positionId || ''}
                  onChange={(ev) => setEditing({ ...editing, positionId: ev.target.value })}
                  disabled={!editing.departmentId}
                >
                  <option value="">— Chọn —</option>
                  {filteredPositions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.code})
                    </option>
                  ))}
                </select>
              </Field>
            </Grid>
            <Grid cols="1fr 1fr">
              <Field label="Quản lý trực tiếp">
                <select
                  style={inputStyle as any}
                  value={editing.managerId || ''}
                  onChange={(ev) => setEditing({ ...editing, managerId: ev.target.value })}
                >
                  <option value="">— Không có —</option>
                  {items
                    .filter((it) => it.id !== editing.id)
                    .map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.fullName} ({it.position?.title})
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Quyền HR">
                <select
                  style={inputStyle as any}
                  value={editing.hrRole || 'employee'}
                  onChange={(ev) => setEditing({ ...editing, hrRole: ev.target.value })}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
            </Grid>

            <SectionTitle>Hợp đồng</SectionTitle>
            <Grid cols="1fr 1fr 1fr">
              <Field label="Loại HĐ">
                <select
                  style={inputStyle as any}
                  value={editing.employmentType || 'full_time'}
                  onChange={(ev) => setEditing({ ...editing, employmentType: ev.target.value })}
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Trạng thái">
                <select
                  style={inputStyle as any}
                  value={editing.employmentStatus || 'probation'}
                  onChange={(ev) => setEditing({ ...editing, employmentStatus: ev.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ngày vào làm *">
                <input
                  style={inputStyle}
                  type="date"
                  value={editing.hireDate ? String(editing.hireDate).slice(0, 10) : ''}
                  onChange={(ev) => setEditing({ ...editing, hireDate: ev.target.value })}
                />
              </Field>
            </Grid>
            <Grid cols="1fr 1fr">
              <Field label="Hết thử việc">
                <input
                  style={inputStyle}
                  type="date"
                  value={editing.probationEndDate ? String(editing.probationEndDate).slice(0, 10) : ''}
                  onChange={(ev) => setEditing({ ...editing, probationEndDate: ev.target.value })}
                />
              </Field>
              <Field label="Ngày nghỉ">
                <input
                  style={inputStyle}
                  type="date"
                  value={editing.terminationDate ? String(editing.terminationDate).slice(0, 10) : ''}
                  onChange={(ev) => setEditing({ ...editing, terminationDate: ev.target.value })}
                />
              </Field>
            </Grid>
            <Field label="Ghi chú">
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: fonts.body }}
                value={editing.note || ''}
                onChange={(ev) => setEditing({ ...editing, note: ev.target.value })}
              />
            </Field>

            <div style={{ display: 'flex', gap: 10, marginTop: 6, justifyContent: 'flex-end' }}>
              <button style={secondaryButton} onClick={() => setEditing(null)}>
                Hủy
              </button>
              <button style={primaryButton} onClick={save}>
                Lưu
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      style={{
        padding: '12px 14px',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 600,
        fontFamily: fonts.mono,
      }}
    >
      {children}
    </th>
  );
}
function Td({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return <td style={{ padding: '12px 14px', verticalAlign: 'middle', ...style }}>{children}</td>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: colors.textLight,
        fontFamily: fonts.mono,
        marginTop: 4,
        paddingBottom: 4,
        borderBottom: `1px solid ${colors.borderSoft}`,
      }}
    >
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}
function Grid({ cols, children }: { cols: string; children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10 }}>{children}</div>;
}

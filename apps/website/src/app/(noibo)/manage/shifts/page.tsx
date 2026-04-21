'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Clock, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  getBadgeStyle,
} from '@/lib/styles';

type ShiftTemplate = {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  shiftType: string;
  lateAfterMin: number;
  isActive: boolean;
};

type Department = { id: string; name: string };
type Employee = { id: string; fullName: string; employeeCode: string; departmentId: string };

type Assignment = {
  id: string;
  employeeId: string;
  workDate: string;
  templateId: string;
  template: { id: string; code: string; name: string; startTime: string; endTime: string };
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textSecondary,
  marginBottom: 4,
  display: 'block',
};

export default function ShiftsAdminPage() {
  const [tab, setTab] = useState<'templates' | 'assign'>('templates');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Ca làm việc</h1>
        <div style={pageSubtitle}>Mẫu ca + xếp lịch theo tuần</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, borderBottom: `1px solid ${colors.borderSoft}` }}>
        <TabBtn active={tab === 'templates'} onClick={() => setTab('templates')}>
          Mẫu ca
        </TabBtn>
        <TabBtn active={tab === 'assign'} onClick={() => setTab('assign')}>
          Xếp lịch tuần
        </TabBtn>
      </div>

      {tab === 'templates' ? <TemplatesPanel /> : <AssignmentPanel />}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 600,
        color: active ? colors.accent : colors.textLight,
        borderBottom: `2px solid ${active ? colors.accent : 'transparent'}`,
        cursor: 'pointer',
        fontFamily: fonts.body,
        marginBottom: -1,
      }}
    >
      {children}
    </button>
  );
}

// ───────────────────────── TEMPLATES ─────────────────────────

function TemplatesPanel() {
  const [items, setItems] = useState<ShiftTemplate[]>([]);
  const [editing, setEditing] = useState<Partial<ShiftTemplate> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setItems(await apiGet<ShiftTemplate[]>('/api/noibo/shifts'));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    try {
      const payload = {
        code: editing.code?.trim().toUpperCase(),
        name: editing.name?.trim(),
        startTime: editing.startTime,
        endTime: editing.endTime,
        breakMinutes: editing.breakMinutes ?? 60,
        shiftType: editing.shiftType ?? 'day',
        lateAfterMin: editing.lateAfterMin ?? 15,
        isActive: editing.isActive ?? true,
      };
      if (!payload.code || !payload.name || !payload.startTime || !payload.endTime) {
        alert('Mã, tên, giờ vào, giờ ra là bắt buộc');
        return;
      }
      if (editing.id) await apiPut(`/api/noibo/shifts/${editing.id}`, payload);
      else await apiPost('/api/noibo/shifts', payload);
      setEditing(null);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function remove(it: ShiftTemplate) {
    if (!confirm(`Xóa mẫu ca "${it.name}"?`)) return;
    try {
      await apiDelete(`/api/noibo/shifts/${it.id}`);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          style={primaryButton}
          onClick={() => setEditing({ startTime: '08:00', endTime: '17:00', breakMinutes: 60, lateAfterMin: 15, isActive: true, shiftType: 'day' })}
        >
          + Thêm mẫu ca
        </button>
      </div>

      {loading ? (
        <div style={{ color: colors.textLight }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          Chưa có mẫu ca nào.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it) => (
            <div key={it.id} style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `${colors.accent}15`,
                  color: colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                    {it.name}
                  </span>
                  <code style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>{it.code}</code>
                  {!it.isActive && <span style={getBadgeStyle('inactive')}>Ngừng</span>}
                </div>
                <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2, fontFamily: fonts.mono }}>
                  {it.startTime} – {it.endTime} · nghỉ {it.breakMinutes}p · trễ sau {it.lateAfterMin}p
                </div>
              </div>
              <button onClick={() => setEditing(it)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight, padding: 6 }}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => remove(it)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.danger, padding: 6 }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal isOpen onClose={() => setEditing(null)} title={editing.id ? 'Sửa mẫu ca' : 'Thêm mẫu ca'} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Mã *</span>
                <input
                  style={{ ...inputStyle, fontFamily: fonts.mono, textTransform: 'uppercase' }}
                  value={editing.code ?? ''}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  placeholder="SHIFT_A"
                />
              </div>
              <div>
                <span style={labelStyle}>Tên ca *</span>
                <input
                  style={inputStyle}
                  value={editing.name ?? ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Ca hành chính"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Giờ vào (HH:mm) *</span>
                <input style={inputStyle} type="time" value={editing.startTime ?? ''} onChange={(e) => setEditing({ ...editing, startTime: e.target.value })} />
              </div>
              <div>
                <span style={labelStyle}>Giờ ra (HH:mm) *</span>
                <input style={inputStyle} type="time" value={editing.endTime ?? ''} onChange={(e) => setEditing({ ...editing, endTime: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Nghỉ trưa (phút)</span>
                <input
                  style={inputStyle}
                  type="number"
                  value={editing.breakMinutes ?? 60}
                  onChange={(e) => setEditing({ ...editing, breakMinutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span style={labelStyle}>Trễ sau (phút)</span>
                <input
                  style={inputStyle}
                  type="number"
                  value={editing.lateAfterMin ?? 15}
                  onChange={(e) => setEditing({ ...editing, lateAfterMin: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span style={labelStyle}>Loại</span>
                <select style={inputStyle as any} value={editing.shiftType ?? 'day'} onChange={(e) => setEditing({ ...editing, shiftType: e.target.value })}>
                  <option value="day">Ban ngày</option>
                  <option value="night">Đêm</option>
                  <option value="flexible">Linh hoạt</option>
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.textSecondary }}>
              <input
                type="checkbox"
                checked={editing.isActive ?? true}
                onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
              />
              Đang hoạt động
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
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

// ───────────────────────── ASSIGNMENT GRID ─────────────────────────

function AssignmentPanel() {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<ShiftTemplate[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [saving, setSaving] = useState(false);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const weekEnd = days[6]!;

  async function loadStatic() {
    const [ds, ts] = await Promise.all([
      apiGet<Department[]>('/api/noibo/departments'),
      apiGet<ShiftTemplate[]>('/api/noibo/shifts'),
    ]);
    setDepartments(ds);
    setTemplates(ts.filter((t) => t.isActive));
  }

  async function loadDynamic() {
    const empUrl = departmentId ? `/api/noibo/employees?departmentId=${departmentId}` : '/api/noibo/employees';
    const assignUrl = `/api/noibo/shifts/assign?from=${ymd(weekStart)}&to=${ymd(weekEnd)}${departmentId ? `&departmentId=${departmentId}` : ''}`;
    const [emps, asg] = await Promise.all([apiGet<Employee[]>(empUrl), apiGet<Assignment[]>(assignUrl)]);
    setEmployees(emps.filter((e: any) => e.employmentStatus !== 'terminated'));
    setAssignments(asg);
  }

  useEffect(() => {
    loadStatic();
  }, []);

  useEffect(() => {
    loadDynamic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, departmentId]);

  // Map: employeeId|workDate → assignment
  const cellMap = useMemo(() => {
    const m = new Map<string, Assignment>();
    for (const a of assignments) {
      m.set(`${a.employeeId}|${ymd(new Date(a.workDate))}`, a);
    }
    return m;
  }, [assignments]);

  async function setCell(employeeId: string, workDate: Date, templateId: string) {
    setSaving(true);
    try {
      if (!templateId) {
        await apiDelete(`/api/noibo/shifts/assign?employeeId=${employeeId}&workDate=${ymd(workDate)}`);
      } else {
        await apiPost('/api/noibo/shifts/assign', {
          items: [{ employeeId, templateId, workDate: ymd(workDate) }],
        });
      }
      await loadDynamic();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <button onClick={() => setWeekStart(addDays(weekStart, -7))} style={navBtn}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.heading }}>
          Tuần {ymd(weekStart)} → {ymd(weekEnd)}
        </div>
        <button onClick={() => setWeekStart(addDays(weekStart, 7))} style={navBtn}>
          <ChevronRight size={16} />
        </button>
        <button onClick={() => setWeekStart(startOfWeek(new Date()))} style={{ ...secondaryButton, padding: '6px 14px' }}>
          Tuần này
        </button>
        <select style={{ ...inputStyle, width: 'auto', marginLeft: 'auto' } as any} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">Tất cả phòng ban</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {employees.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          Không có nhân viên nào.
        </div>
      ) : templates.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          Chưa có mẫu ca nào — sang tab "Mẫu ca" để tạo trước.
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: fonts.body }}>
            <thead>
              <tr style={{ background: colors.borderSoft }}>
                <th style={{ ...thStyle, minWidth: 200, position: 'sticky', left: 0, background: colors.borderSoft, zIndex: 1 }}>Nhân viên</th>
                {days.map((d) => (
                  <th key={d.toISOString()} style={{ ...thStyle, minWidth: 130 }}>
                    <div>{d.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
                    <div style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>
                      {d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={{ borderTop: `1px solid ${colors.borderSoft}` }}>
                  <td style={{ ...tdStyle, position: 'sticky', left: 0, background: colors.cardBg, fontWeight: 600 }}>
                    {emp.fullName}
                    <div style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>{emp.employeeCode}</div>
                  </td>
                  {days.map((d) => {
                    const cell = cellMap.get(`${emp.id}|${ymd(d)}`);
                    return (
                      <td key={d.toISOString()} style={tdStyle}>
                        <select
                          value={cell?.templateId ?? ''}
                          onChange={(e) => setCell(emp.id, d, e.target.value)}
                          disabled={saving}
                          style={{
                            ...inputStyle,
                            padding: '6px 8px',
                            fontSize: 12,
                            background: cell ? `${colors.accent}10` : colors.white,
                            color: cell ? colors.accent : colors.textLight,
                            fontWeight: cell ? 600 : 400,
                            border: `1px solid ${cell ? colors.borderCyan : colors.border}`,
                          }}
                        >
                          <option value="">— Trống —</option>
                          {templates.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.code} {t.startTime}–{t.endTime}
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: CSSProperties = {
  padding: '10px 12px',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 600,
  fontFamily: fonts.mono,
  color: colors.textSecondary,
  textAlign: 'left',
};

const tdStyle: CSSProperties = {
  padding: '8px 10px',
  verticalAlign: 'middle',
};

const navBtn: CSSProperties = {
  background: colors.cardBg,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: 6,
  cursor: 'pointer',
  color: colors.textSecondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function startOfWeek(d: Date): Date {
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day; // tuần bắt đầu Thứ 2
  return addDays(stripTime(d), diff);
}
function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}
function stripTime(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

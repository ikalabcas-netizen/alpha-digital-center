'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Briefcase, Edit2, Trash2 } from 'lucide-react';
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

type Department = { id: string; code: string; name: string };

type Position = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  level: number;
  isActive: boolean;
  departmentId: string;
  department?: Department;
  _count?: { employees: number };
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textSecondary,
  marginBottom: 4,
  display: 'block',
};

export default function PositionsAdminPage() {
  const [items, setItems] = useState<Position[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [filterDept, setFilterDept] = useState<string>('');
  const [editing, setEditing] = useState<Partial<Position> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const url = filterDept ? `/api/noibo/positions?departmentId=${filterDept}` : '/api/noibo/positions';
    const [pos, ds] = await Promise.all([apiGet<Position[]>(url), apiGet<Department[]>('/api/noibo/departments')]);
    setItems(pos);
    setDepts(ds);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filterDept]);

  async function save() {
    if (!editing) return;
    try {
      const payload = {
        code: editing.code?.trim().toUpperCase(),
        title: editing.title?.trim(),
        description: editing.description || null,
        departmentId: editing.departmentId,
        level: editing.level ?? 1,
        isActive: editing.isActive ?? true,
      };
      if (!payload.code || !payload.title || !payload.departmentId) {
        alert('Mã, chức danh và phòng ban là bắt buộc');
        return;
      }
      if (editing.id) await apiPut(`/api/noibo/positions/${editing.id}`, payload);
      else await apiPost('/api/noibo/positions', payload);
      setEditing(null);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function remove(it: Position) {
    if (!confirm(`Xóa chức vụ "${it.title}"?`)) return;
    try {
      await apiDelete(`/api/noibo/positions/${it.id}`);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  // Group by department
  const grouped = items.reduce<Record<string, Position[]>>((acc, p) => {
    const key = p.department?.name ?? 'Chưa phân loại';
    (acc[key] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={pageTitle}>Chức vụ</h1>
          <div style={pageSubtitle}>Vị trí công việc theo phòng ban — gắn với nhân viên và mẫu KPI</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select style={inputStyle as any} value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="">Tất cả phòng ban</option>
            {depts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <button
            style={primaryButton}
            onClick={() => setEditing({ isActive: true, level: 1, departmentId: filterDept || depts[0]?.id })}
          >
            + Thêm chức vụ
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: colors.textLight, fontSize: 14 }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          Chưa có chức vụ nào.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {Object.entries(grouped).map(([deptName, list]) => (
            <div key={deptName}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  color: colors.textLight,
                  fontFamily: fonts.mono,
                  marginBottom: 8,
                  paddingLeft: 4,
                }}
              >
                {deptName}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {list.map((p) => (
                  <div key={p.id} style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Briefcase size={16} color={colors.accent} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: colors.textPrimary }}>{p.title}</span>
                        <code style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>{p.code}</code>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: colors.borderSoft,
                            color: colors.textSecondary,
                            fontFamily: fonts.mono,
                          }}
                        >
                          L{p.level}
                        </span>
                        {!p.isActive && <span style={getBadgeStyle('inactive')}>Ngừng</span>}
                      </div>
                      <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                        {p._count?.employees ?? 0} nhân viên
                      </div>
                    </div>
                    <button
                      onClick={() => setEditing(p)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight, padding: 6 }}
                      title="Sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => remove(p)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.danger, padding: 6 }}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal isOpen onClose={() => setEditing(null)} title={editing.id ? 'Sửa chức vụ' : 'Thêm chức vụ'} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Mã *</span>
                <input
                  style={{ ...inputStyle, fontFamily: fonts.mono, textTransform: 'uppercase' }}
                  value={editing.code || ''}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  placeholder="KTV_SR"
                />
              </div>
              <div>
                <span style={labelStyle}>Chức danh *</span>
                <input
                  style={inputStyle}
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Kỹ thuật viên Senior"
                />
              </div>
            </div>
            <div>
              <span style={labelStyle}>Phòng ban *</span>
              <select
                style={inputStyle as any}
                value={editing.departmentId || ''}
                onChange={(e) => setEditing({ ...editing, departmentId: e.target.value })}
              >
                <option value="">— Chọn phòng ban —</option>
                {depts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Cấp bậc (1–5)</span>
                <input
                  style={inputStyle}
                  type="number"
                  min={1}
                  max={5}
                  value={editing.level ?? 1}
                  onChange={(e) => setEditing({ ...editing, level: parseInt(e.target.value) || 1 })}
                />
              </div>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.textSecondary, marginTop: 22 }}
              >
                <input
                  type="checkbox"
                  checked={editing.isActive ?? true}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                />
                Đang hoạt động
              </label>
            </div>
            <div>
              <span style={labelStyle}>Mô tả</span>
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: fonts.body }}
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button style={primaryButton} onClick={save}>
                Lưu
              </button>
              <button style={secondaryButton} onClick={() => setEditing(null)}>
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

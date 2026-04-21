'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Building2, Edit2, Trash2 } from 'lucide-react';
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

type Department = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  parentId: string | null;
  parent?: { id: string; code: string; name: string } | null;
  managerId: string | null;
  isActive: boolean;
  displayOrder: number;
  _count?: { employees: number; positions: number; children: number };
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textSecondary,
  marginBottom: 4,
  display: 'block',
};

export default function DepartmentsAdminPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Department> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await apiGet<Department[]>('/api/noibo/departments'));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
        description: editing.description || null,
        parentId: editing.parentId || null,
        displayOrder: editing.displayOrder ?? 0,
        isActive: editing.isActive ?? true,
      };
      if (!payload.code || !payload.name) {
        alert('Mã và tên phòng ban là bắt buộc');
        return;
      }
      if (editing.id) await apiPut(`/api/noibo/departments/${editing.id}`, payload);
      else await apiPost('/api/noibo/departments', payload);
      setEditing(null);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function remove(it: Department) {
    if (!confirm(`Xóa phòng ban "${it.name}"?`)) return;
    try {
      await apiDelete(`/api/noibo/departments/${it.id}`);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={pageTitle}>Phòng ban</h1>
          <div style={pageSubtitle}>Cấu trúc tổ chức nội bộ Alpha Digital Center</div>
        </div>
        <button style={primaryButton} onClick={() => setEditing({ isActive: true, displayOrder: items.length + 1 })}>
          + Thêm phòng ban
        </button>
      </div>

      {error && (
        <div style={{ ...cardStyle, padding: 14, color: colors.danger, marginBottom: 14 }}>{error}</div>
      )}

      {loading ? (
        <div style={{ color: colors.textLight, fontSize: 14 }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          Chưa có phòng ban nào. Bấm + Thêm phòng ban để tạo.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it) => (
            <div key={it.id} style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: `${colors.accent}18`,
                  color: colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                    {it.name}
                  </span>
                  <code style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>{it.code}</code>
                  {!it.isActive && <span style={getBadgeStyle('inactive')}>Ngừng</span>}
                </div>
                <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                  {it.parent && <>Trực thuộc: {it.parent.name} · </>}
                  {it._count?.employees ?? 0} nhân viên · {it._count?.positions ?? 0} chức vụ
                  {(it._count?.children ?? 0) > 0 && ` · ${it._count?.children} phòng con`}
                </div>
              </div>
              <button
                onClick={() => setEditing(it)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight, padding: 6 }}
                title="Sửa"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => remove(it)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.danger, padding: 6 }}
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          title={editing.id ? 'Sửa phòng ban' : 'Thêm phòng ban'}
          maxWidth={520}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Mã *</span>
                <input
                  style={{ ...inputStyle, fontFamily: fonts.mono, textTransform: 'uppercase' }}
                  value={editing.code || ''}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  placeholder="LAB"
                />
              </div>
              <div>
                <span style={labelStyle}>Tên phòng ban *</span>
                <input
                  style={inputStyle}
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Sản xuất Lab"
                />
              </div>
            </div>
            <div>
              <span style={labelStyle}>Mô tả</span>
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: fonts.body }}
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div>
              <span style={labelStyle}>Phòng ban cha (tùy chọn)</span>
              <select
                style={inputStyle as any}
                value={editing.parentId || ''}
                onChange={(e) => setEditing({ ...editing, parentId: e.target.value || null })}
              >
                <option value="">— Không có —</option>
                {items
                  .filter((d) => d.id !== editing.id)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Thứ tự hiển thị</span>
                <input
                  style={inputStyle}
                  type="number"
                  value={editing.displayOrder ?? 0}
                  onChange={(e) => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })}
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

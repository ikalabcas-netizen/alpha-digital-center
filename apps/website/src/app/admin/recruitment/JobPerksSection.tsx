'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import { colors, fonts, inputStyle, primaryButton, secondaryButton } from '@/lib/styles';
import OrderableList from '@/components/admin/OrderableList';
import { Modal } from '@/components/ui/Modal';

type Perk = { id: string; title: string; description: string; iconKey: string | null; displayOrder: number };

const label: CSSProperties = { fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' };

export function JobPerksSection() {
  const [items, setItems] = useState<Perk[]>([]);
  const [editing, setEditing] = useState<Partial<Perk> | null>(null);

  async function load() {
    setItems(await apiGet<Perk[]>('/api/admin/job-perks'));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      title: editing.title || '',
      description: editing.description || '',
      iconKey: editing.iconKey || null,
      displayOrder: editing.displayOrder ?? items.length + 1,
    };
    if (editing.id) await apiPut(`/api/admin/job-perks/${editing.id}`, payload);
    else await apiPost('/api/admin/job-perks', payload);
    setEditing(null);
    load();
  }

  async function remove(it: Perk) {
    if (!confirm(`Xóa phúc lợi "${it.title}"?`)) return;
    await apiDelete(`/api/admin/job-perks/${it.id}`);
    load();
  }

  async function reorder(next: Perk[]) {
    setItems(next);
    await apiPost('/api/admin/reorder', {
      model: 'jobPerk',
      items: next.map((it, i) => ({ id: it.id, displayOrder: i + 1 })),
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button style={primaryButton} onClick={() => setEditing({ title: '', description: '' })}>
          + Thêm phúc lợi
        </button>
      </div>

      <OrderableList
        items={items}
        onReorder={reorder}
        onEdit={(it) => setEditing(it)}
        onDelete={remove}
        renderItem={(it) => (
          <div>
            <div style={{ fontWeight: 600 }}>{it.title}</div>
            <div style={{ fontSize: 12, color: colors.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {it.description}
            </div>
          </div>
        )}
      />

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing.id ? 'Sửa phúc lợi' : 'Thêm phúc lợi'} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <span style={label}>Tiêu đề</span>
              <input style={inputStyle} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <span style={label}>Mô tả</span>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontFamily: fonts.body }}
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
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

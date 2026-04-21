'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import { colors, fonts, inputStyle, primaryButton, secondaryButton, cardStyle } from '@/lib/styles';

type PolicyItem = { id: string; groupId: string; productName: string; warrantyText: string; displayOrder: number };
type PolicyGroup = { id: string; categoryName: string; displayOrder: number; items: PolicyItem[] };

const label: CSSProperties = { fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' };
const smallBtn: CSSProperties = { ...secondaryButton, padding: '4px 8px', fontSize: 11 };

export function WarrantyPolicySection() {
  const [groups, setGroups] = useState<PolicyGroup[]>([]);
  const [newGroup, setNewGroup] = useState('');

  async function load() {
    setGroups(await apiGet<PolicyGroup[]>('/api/admin/warranty-policy/groups'));
  }
  useEffect(() => {
    load();
  }, []);

  async function addGroup() {
    if (!newGroup.trim()) return;
    await apiPost('/api/admin/warranty-policy/groups', { categoryName: newGroup, displayOrder: groups.length + 1 });
    setNewGroup('');
    load();
  }

  async function removeGroup(g: PolicyGroup) {
    if (!confirm(`Xóa nhóm "${g.categoryName}" và ${g.items.length} mục con?`)) return;
    await apiDelete(`/api/admin/warranty-policy/groups/${g.id}`);
    load();
  }

  async function renameGroup(g: PolicyGroup, name: string) {
    await apiPut(`/api/admin/warranty-policy/groups/${g.id}`, { categoryName: name });
    load();
  }

  async function addItem(g: PolicyGroup, productName: string, warrantyText: string) {
    await apiPost('/api/admin/warranty-policy/items', {
      groupId: g.id,
      productName,
      warrantyText,
      displayOrder: g.items.length + 1,
    });
    load();
  }

  async function removeItem(it: PolicyItem) {
    await apiDelete(`/api/admin/warranty-policy/items/${it.id}`);
    load();
  }

  async function editItem(it: PolicyItem, patch: Partial<PolicyItem>) {
    await apiPut(`/api/admin/warranty-policy/items/${it.id}`, patch);
    load();
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          style={{ ...inputStyle, maxWidth: 320 }}
          placeholder="Tên nhóm mới (Toàn sứ / Implant...)"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
        />
        <button style={primaryButton} onClick={addGroup}>
          + Nhóm
        </button>
      </div>

      {groups.length === 0 && (
        <div style={{ color: colors.textLight, padding: 12, fontSize: 13 }}>Chưa có nhóm nào.</div>
      )}

      {groups.map((g) => (
        <div key={g.id} style={{ ...cardStyle, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <input
              style={{ ...inputStyle, maxWidth: 280, fontWeight: 600 }}
              defaultValue={g.categoryName}
              onBlur={(e) => e.target.value !== g.categoryName && renameGroup(g, e.target.value)}
            />
            <button style={{ ...smallBtn, color: colors.danger, borderColor: 'rgba(225,29,72,0.2)' }} onClick={() => removeGroup(g)}>
              Xóa nhóm
            </button>
          </div>

          {g.items.map((it) => (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: 8, marginBottom: 6 }}>
              <input
                style={inputStyle}
                defaultValue={it.productName}
                onBlur={(e) => e.target.value !== it.productName && editItem(it, { productName: e.target.value })}
                placeholder="Tên sản phẩm"
              />
              <input
                style={inputStyle}
                defaultValue={it.warrantyText}
                onBlur={(e) => e.target.value !== it.warrantyText && editItem(it, { warrantyText: e.target.value })}
                placeholder="Thời hạn (10 năm)"
              />
              <button style={smallBtn} onClick={() => removeItem(it)}>
                Xóa
              </button>
            </div>
          ))}

          <AddItemRow onAdd={(p, w) => addItem(g, p, w)} />
        </div>
      ))}
    </div>
  );
}

function AddItemRow({ onAdd }: { onAdd: (productName: string, warrantyText: string) => void }) {
  const [p, setP] = useState('');
  const [w, setW] = useState('');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: 8, marginTop: 8 }}>
      <input style={inputStyle} placeholder="+ Tên sản phẩm" value={p} onChange={(e) => setP(e.target.value)} />
      <input style={inputStyle} placeholder="Thời hạn" value={w} onChange={(e) => setW(e.target.value)} />
      <button
        style={{ ...secondaryButton, padding: '6px 12px', fontSize: 12 }}
        onClick={() => {
          if (p && w) {
            onAdd(p, w);
            setP('');
            setW('');
          }
        }}
      >
        + Thêm
      </button>
    </div>
  );
}

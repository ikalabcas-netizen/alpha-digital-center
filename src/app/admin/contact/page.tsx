'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  pageTitle,
  pageSubtitle,
  inputStyle,
  primaryButton,
  secondaryButton,
} from '@/lib/styles';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import PageHeroEditor from '@/components/admin/PageHeroEditor';
import TabBar from '@/components/admin/TabBar';
import OrderableList from '@/components/admin/OrderableList';
import { Modal } from '@/components/ui/Modal';

type Channel = { id: string; label: string; value: string; subtitle: string; iconKey: string; displayOrder: number; isActive: boolean };

const label: CSSProperties = { fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' };
const sectionTitle: CSSProperties = { fontSize: 15, fontWeight: 700, marginBottom: 12, color: colors.textPrimary, fontFamily: fonts.heading };
const addRow: CSSProperties = { display: 'flex', gap: 10, marginBottom: 12, justifyContent: 'flex-end' };

export default function ContactAdmin() {
  const [tab, setTab] = useState('hero');
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Liên hệ</h1>
        <div style={pageSubtitle}>Quản lý nội dung trang <code>/lien-he</code></div>
      </div>

      <TabBar
        tabs={[
          { key: 'hero', label: 'Hero' },
          { key: 'channels', label: 'Kênh liên hệ' },
          { key: 'office', label: 'Văn phòng + Map' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'hero' && <PageHeroEditor pageSlug="contact" uploadPrefix="misc" hideImage />}
      {tab === 'channels' && <ChannelsCrud />}
      {tab === 'office' && <OfficeForm />}
    </div>
  );
}

function ChannelsCrud() {
  const [items, setItems] = useState<Channel[]>([]);
  const [editing, setEditing] = useState<Partial<Channel> | null>(null);

  async function load() {
    setItems(await apiGet<Channel[]>('/api/admin/contact-channels'));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      label: editing.label || '',
      value: editing.value || '',
      subtitle: editing.subtitle || '',
      iconKey: editing.iconKey || 'phone',
      displayOrder: editing.displayOrder ?? items.length + 1,
      isActive: editing.isActive ?? true,
    };
    if (editing.id) await apiPut(`/api/admin/contact-channels/${editing.id}`, payload);
    else await apiPost('/api/admin/contact-channels', payload);
    setEditing(null);
    load();
  }

  async function remove(it: Channel) {
    if (!confirm(`Xóa kênh "${it.label}"?`)) return;
    await apiDelete(`/api/admin/contact-channels/${it.id}`);
    load();
  }

  async function reorder(next: Channel[]) {
    setItems(next);
    await apiPost('/api/admin/reorder', {
      model: 'contactChannel',
      items: next.map((it, i) => ({ id: it.id, displayOrder: i + 1 })),
    });
  }

  return (
    <div>
      <div style={addRow}>
        <button style={primaryButton} onClick={() => setEditing({ label: '', value: '', subtitle: '', iconKey: 'phone', isActive: true })}>
          + Thêm kênh
        </button>
      </div>

      <OrderableList
        items={items}
        onReorder={reorder}
        onEdit={(it) => setEditing(it)}
        onDelete={remove}
        renderItem={(it) => (
          <div>
            <div style={{ fontWeight: 600 }}>
              [{it.iconKey}] {it.label}
            </div>
            <div style={{ fontSize: 13 }}>
              {it.value} <span style={{ color: colors.textLight }}>· {it.subtitle}</span>
            </div>
          </div>
        )}
      />

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing.id ? 'Sửa kênh' : 'Thêm kênh'} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <span style={label}>Nhãn (HOTLINE · 24/7)</span>
              <input style={inputStyle} value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
            </div>
            <div>
              <span style={label}>Giá trị (0378 422 496)</span>
              <input style={inputStyle} value={editing.value || ''} onChange={(e) => setEditing({ ...editing, value: e.target.value })} />
            </div>
            <div>
              <span style={label}>Phụ đề (Hỗ trợ kỹ thuật...)</span>
              <input style={inputStyle} value={editing.subtitle || ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
            </div>
            <div>
              <span style={label}>Icon key</span>
              <select
                style={{ ...inputStyle, appearance: 'auto' }}
                value={editing.iconKey || 'phone'}
                onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
              >
                <option value="phone">phone</option>
                <option value="mail">mail</option>
                <option value="zalo">zalo</option>
                <option value="clock">clock</option>
              </select>
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

function OfficeForm() {
  const [fields, setFields] = useState({
    officeAddressLine1: '',
    officeAddressLine2: '',
    mapEmbedUrl: '',
    mapButton1Url: '',
    mapButton2Url: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    apiGet<any[]>('/api/admin/settings?group=contact').then((rows) => {
      const map: any = {};
      rows.forEach((r) => (map[r.key] = r.value));
      setFields({
        officeAddressLine1: map['contact.officeAddressLine1'] || '',
        officeAddressLine2: map['contact.officeAddressLine2'] || '',
        mapEmbedUrl: map['contact.mapEmbedUrl'] || '',
        mapButton1Url: map['contact.mapButton1Url'] || '',
        mapButton2Url: map['contact.mapButton2Url'] || '',
      });
    });
  }, []);

  async function save() {
    setSaving(true);
    try {
      await apiPut('/api/admin/settings', {
        settings: Object.entries(fields).map(([k, v]) => ({ key: `contact.${k}`, value: v, group: 'contact' })),
      });
      setToast('Đã lưu');
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <div style={sectionTitle}>Văn phòng + Bản đồ</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <span style={label}>Địa chỉ dòng 1</span>
          <input style={inputStyle} value={fields.officeAddressLine1} onChange={(e) => setFields({ ...fields, officeAddressLine1: e.target.value })} />
        </div>
        <div>
          <span style={label}>Địa chỉ dòng 2</span>
          <input style={inputStyle} value={fields.officeAddressLine2} onChange={(e) => setFields({ ...fields, officeAddressLine2: e.target.value })} />
        </div>
        <div>
          <span style={label}>Link Google Maps embed (iframe src)</span>
          <input style={inputStyle} value={fields.mapEmbedUrl} onChange={(e) => setFields({ ...fields, mapEmbedUrl: e.target.value })} />
        </div>
        <div>
          <span style={label}>Button "Xem Google Maps" URL</span>
          <input style={inputStyle} value={fields.mapButton1Url} onChange={(e) => setFields({ ...fields, mapButton1Url: e.target.value })} />
        </div>
        <div>
          <span style={label}>Button "Chỉ đường" URL</span>
          <input style={inputStyle} value={fields.mapButton2Url} onChange={(e) => setFields({ ...fields, mapButton2Url: e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
          <button style={primaryButton} onClick={save} disabled={saving}>
            {saving ? 'Đang lưu…' : 'Lưu'}
          </button>
          {toast && <span style={{ fontSize: 13, color: colors.success }}>{toast}</span>}
        </div>
      </div>
    </div>
  );
}

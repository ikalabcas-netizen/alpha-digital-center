'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
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
import ImageUpload from '@/components/admin/ImageUpload';
import { Modal } from '@/components/ui/Modal';

type TechCard = {
  id: string;
  tag: string;
  meta: string;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
};
type Material = {
  id: string;
  name: string;
  country: string;
  material: string;
  sinceYear: string;
  displayOrder: number;
  isActive: boolean;
};
type Testimonial = {
  id: string;
  labName: string;
  isFeatured: boolean;
  displayOrder: number;
};

const sectionTitle: CSSProperties = { fontSize: 15, fontWeight: 700, marginBottom: 12, color: colors.textPrimary, fontFamily: fonts.heading };
const label: CSSProperties = { fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' };
const addRow: CSSProperties = { display: 'flex', gap: 10, marginBottom: 12, justifyContent: 'flex-end' };

export default function HomepageAdmin() {
  const [tab, setTab] = useState('hero');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Trang chủ</h1>
        <div style={pageSubtitle}>Quản lý nội dung hiển thị trên <code>/</code></div>
      </div>

      <TabBar
        tabs={[
          { key: 'hero', label: 'Hero + Stats' },
          { key: 'tech', label: 'Công nghệ (Tech Cards)' },
          { key: 'materials', label: 'Vật liệu đối tác' },
          { key: 'testimonials', label: 'Testimonials hiển thị' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'hero' && <HeroAndStats />}
      {tab === 'tech' && <TechCardsCrud />}
      {tab === 'materials' && <MaterialsCrud />}
      {tab === 'testimonials' && <TestimonialsPicker />}
    </div>
  );
}

function HeroAndStats() {
  const [stats, setStats] = useState({ years: '', labs: '', warrantyMax: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    apiGet<any>('/api/admin/settings?group=stats').then((rows: any[]) => {
      const map: any = {};
      rows.forEach((r) => (map[r.key] = r.value));
      setStats({
        years: map['stats.years'] || '',
        labs: map['stats.labs'] || '',
        warrantyMax: map['stats.warrantyMax'] || '',
      });
    });
  }, []);

  async function saveStats() {
    setSaving(true);
    try {
      await apiPut('/api/admin/settings', {
        settings: [
          { key: 'stats.years', value: stats.years, group: 'stats' },
          { key: 'stats.labs', value: stats.labs, group: 'stats' },
          { key: 'stats.warrantyMax', value: stats.warrantyMax, group: 'stats' },
        ],
      });
      setToast('Đã lưu 3 số liệu');
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeroEditor pageSlug="home" uploadPrefix="home" />

      <div style={{ ...cardStyle, padding: 20 }}>
        <div style={sectionTitle}>3 số liệu Hero (ví dụ: "12+ · 500+ · 19 năm")</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <span style={label}>Năm kinh nghiệm</span>
            <input style={inputStyle} value={stats.years} onChange={(e) => setStats({ ...stats, years: e.target.value })} />
          </div>
          <div>
            <span style={label}>Số labo đối tác</span>
            <input style={inputStyle} value={stats.labs} onChange={(e) => setStats({ ...stats, labs: e.target.value })} />
          </div>
          <div>
            <span style={label}>Bảo hành tối đa</span>
            <input style={inputStyle} value={stats.warrantyMax} onChange={(e) => setStats({ ...stats, warrantyMax: e.target.value })} />
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <button style={primaryButton} onClick={saveStats} disabled={saving}>
            {saving ? 'Đang lưu…' : 'Lưu số liệu'}
          </button>
          {toast && <span style={{ fontSize: 13, color: colors.success }}>{toast}</span>}
        </div>
      </div>
    </div>
  );
}

function TechCardsCrud() {
  const [items, setItems] = useState<TechCard[]>([]);
  const [editing, setEditing] = useState<Partial<TechCard> | null>(null);

  async function load() {
    setItems(await apiGet<TechCard[]>('/api/admin/tech-cards'));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      tag: editing.tag || '',
      meta: editing.meta || '',
      title: editing.title || '',
      description: editing.description || '',
      imageUrl: editing.imageUrl || '',
      displayOrder: editing.displayOrder ?? items.length + 1,
      isActive: editing.isActive ?? true,
    };
    if (editing.id) await apiPut(`/api/admin/tech-cards/${editing.id}`, payload);
    else await apiPost('/api/admin/tech-cards', payload);
    setEditing(null);
    load();
  }

  async function remove(item: TechCard) {
    if (!confirm(`Xóa tech card "${item.title}"?`)) return;
    await apiDelete(`/api/admin/tech-cards/${item.id}`);
    load();
  }

  async function reorder(next: TechCard[]) {
    setItems(next);
    await apiPost('/api/admin/reorder', {
      model: 'techCard',
      items: next.map((it, i) => ({ id: it.id, displayOrder: i + 1 })),
    });
  }

  return (
    <div>
      <div style={addRow}>
        <button style={primaryButton} onClick={() => setEditing({ tag: '', meta: '', title: '', description: '', imageUrl: '', isActive: true })}>
          + Thêm tech card
        </button>
      </div>

      <OrderableList
        items={items}
        onReorder={reorder}
        onEdit={(it) => setEditing(it)}
        onDelete={remove}
        renderItem={(it) => (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {it.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>
                {it.tag} · {it.title} <span style={{ color: colors.textLight, fontWeight: 400 }}>({it.meta})</span>
              </div>
              <div style={{ fontSize: 12, color: colors.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.description}
              </div>
            </div>
          </div>
        )}
      />

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing.id ? 'Sửa tech card' : 'Thêm tech card'} maxWidth={640}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 120px 1fr', gap: 10 }}>
              <div>
                <span style={label}>Tag (01, 02...)</span>
                <input style={inputStyle} value={editing.tag || ''} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
              </div>
              <div>
                <span style={label}>Meta (±10μm)</span>
                <input style={inputStyle} value={editing.meta || ''} onChange={(e) => setEditing({ ...editing, meta: e.target.value })} />
              </div>
              <div>
                <span style={label}>Tiêu đề</span>
                <input style={inputStyle} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
            </div>
            <div>
              <span style={label}>Mô tả</span>
              <textarea
                style={{ ...inputStyle, minHeight: 72, resize: 'vertical', fontFamily: fonts.body }}
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div>
              <span style={label}>Ảnh</span>
              <ImageUpload
                value={editing.imageUrl || null}
                onChange={(url) => setEditing({ ...editing, imageUrl: url || '' })}
                prefix="tech"
                height={180}
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

function MaterialsCrud() {
  const [items, setItems] = useState<Material[]>([]);
  const [editing, setEditing] = useState<Partial<Material> | null>(null);

  async function load() {
    setItems(await apiGet<Material[]>('/api/admin/materials'));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      name: editing.name || '',
      country: editing.country || '',
      material: editing.material || '',
      sinceYear: editing.sinceYear || '',
      displayOrder: editing.displayOrder ?? items.length + 1,
      isActive: editing.isActive ?? true,
    };
    if (editing.id) await apiPut(`/api/admin/materials/${editing.id}`, payload);
    else await apiPost('/api/admin/materials', payload);
    setEditing(null);
    load();
  }

  async function remove(it: Material) {
    if (!confirm(`Xóa vật liệu "${it.name}"?`)) return;
    await apiDelete(`/api/admin/materials/${it.id}`);
    load();
  }

  async function reorder(next: Material[]) {
    setItems(next);
    await apiPost('/api/admin/reorder', {
      model: 'material',
      items: next.map((it, i) => ({ id: it.id, displayOrder: i + 1 })),
    });
  }

  return (
    <div>
      <div style={addRow}>
        <button style={primaryButton} onClick={() => setEditing({ name: '', country: '', material: '', sinceYear: '', isActive: true })}>
          + Thêm vật liệu
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
              {it.name} <span style={{ color: colors.textLight, fontWeight: 400 }}>· {it.country}</span>
            </div>
            <div style={{ fontSize: 12, color: colors.textLight }}>
              {it.material} · {it.sinceYear}
            </div>
          </div>
        )}
      />

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing.id ? 'Sửa vật liệu' : 'Thêm vật liệu'} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <span style={label}>Tên thương hiệu</span>
              <input style={inputStyle} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <span style={label}>Xuất xứ (Germany / USA)</span>
              <input style={inputStyle} value={editing.country || ''} onChange={(e) => setEditing({ ...editing, country: e.target.value })} />
            </div>
            <div>
              <span style={label}>Vật liệu chính (Cercon HT Zirconia)</span>
              <input style={inputStyle} value={editing.material || ''} onChange={(e) => setEditing({ ...editing, material: e.target.value })} />
            </div>
            <div>
              <span style={label}>Thời gian hợp tác (Từ 2016)</span>
              <input style={inputStyle} value={editing.sinceYear || ''} onChange={(e) => setEditing({ ...editing, sinceYear: e.target.value })} />
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

function TestimonialsPicker() {
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => {
    apiGet<Testimonial[]>('/api/admin/testimonials').then(setItems);
  }, []);
  async function toggleFeatured(t: Testimonial) {
    await apiPut(`/api/admin/testimonials/${t.id}`, { isFeatured: !t.isFeatured });
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, isFeatured: !x.isFeatured } : x)));
  }
  const featured = items.filter((x) => x.isFeatured);
  return (
    <div>
      <div style={{ ...cardStyle, padding: 16, marginBottom: 16 }}>
        <div style={sectionTitle}>Testimonials hiển thị trên trang chủ</div>
        <div style={{ fontSize: 13, color: colors.textLight, marginBottom: 12 }}>
          Trang chủ hiển thị tối đa 3 testimonial gắn <code>isFeatured</code>. Hiện đang chọn: <b>{featured.length}</b>.
          Nội dung chi tiết quản lý tại{' '}
          <Link href="/admin/testimonials" style={{ color: colors.accent }}>
            /admin/testimonials
          </Link>
          .
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((t) => (
          <label
            key={t.id}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              padding: 10,
              background: t.isFeatured ? colors.accent50 : colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <input type="checkbox" checked={t.isFeatured} onChange={() => toggleFeatured(t)} />
            <span style={{ fontSize: 14 }}>{t.labName}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

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
import ImageUpload from '@/components/admin/ImageUpload';
import { Modal } from '@/components/ui/Modal';

type StoryBlock = {
  pageSlug: string;
  imageUrl1: string | null;
  imageUrl2: string | null;
  paragraph1: string;
  paragraph2: string;
  foundedYear: string;
};
type CoreValue = { id: string; number: string; title: string; description: string; displayOrder: number };
type TimelineEntry = { id: string; year: string; title: string; description: string; displayOrder: number };

const label: CSSProperties = { fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' };
const sectionTitle: CSSProperties = { fontSize: 15, fontWeight: 700, marginBottom: 12, color: colors.textPrimary, fontFamily: fonts.heading };
const addRow: CSSProperties = { display: 'flex', gap: 10, marginBottom: 12, justifyContent: 'flex-end' };

export default function AboutAdmin() {
  const [tab, setTab] = useState('hero');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Giới thiệu</h1>
        <div style={pageSubtitle}>Quản lý nội dung trang <code>/gioi-thieu</code></div>
      </div>

      <TabBar
        tabs={[
          { key: 'hero', label: 'Hero' },
          { key: 'story', label: 'Câu chuyện thương hiệu' },
          { key: 'values', label: 'Giá trị cốt lõi' },
          { key: 'timeline', label: 'Mốc thời gian' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'hero' && <PageHeroEditor pageSlug="about" uploadPrefix="about" />}
      {tab === 'story' && <StoryEditor />}
      {tab === 'values' && <ValuesCrud />}
      {tab === 'timeline' && <TimelineCrud />}
    </div>
  );
}

function StoryEditor() {
  const [story, setStory] = useState<StoryBlock | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    apiGet<StoryBlock>('/api/admin/story-block/about').then(setStory);
  }, []);

  async function save() {
    if (!story) return;
    setSaving(true);
    setToast(null);
    try {
      await apiPut('/api/admin/story-block/about', story);
      setToast('Đã lưu');
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!story) return <div style={{ color: colors.textLight }}>Đang tải…</div>;
  const update = (patch: Partial<StoryBlock>) => setStory({ ...story, ...patch });

  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <div style={sectionTitle}>Khối "Câu chuyện" (2 ảnh + 2 đoạn văn + năm thành lập)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
        <div>
          <span style={label}>Ảnh 1 (70% width trong khối)</span>
          <ImageUpload value={story.imageUrl1} onChange={(url) => update({ imageUrl1: url })} prefix="about" height={200} />
        </div>
        <div>
          <span style={label}>Ảnh 2 (65% width, đè lên ảnh 1)</span>
          <ImageUpload value={story.imageUrl2} onChange={(url) => update({ imageUrl2: url })} prefix="about" height={200} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={label}>Năm thành lập (hiển thị badge "FOUNDED 2014")</span>
        <input
          style={{ ...inputStyle, maxWidth: 160 }}
          value={story.foundedYear}
          onChange={(e) => update({ foundedYear: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={label}>Đoạn 1</span>
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: fonts.body }}
          value={story.paragraph1}
          onChange={(e) => update({ paragraph1: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={label}>Đoạn 2</span>
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: fonts.body }}
          value={story.paragraph2}
          onChange={(e) => update({ paragraph2: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button style={primaryButton} onClick={save} disabled={saving}>
          {saving ? 'Đang lưu…' : 'Lưu câu chuyện'}
        </button>
        {toast && <span style={{ fontSize: 13, color: colors.success }}>{toast}</span>}
      </div>
    </div>
  );
}

function ValuesCrud() {
  const [items, setItems] = useState<CoreValue[]>([]);
  const [editing, setEditing] = useState<Partial<CoreValue> | null>(null);

  async function load() {
    setItems(await apiGet<CoreValue[]>('/api/admin/core-values'));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      number: editing.number || '',
      title: editing.title || '',
      description: editing.description || '',
      displayOrder: editing.displayOrder ?? items.length + 1,
    };
    if (editing.id) await apiPut(`/api/admin/core-values/${editing.id}`, payload);
    else await apiPost('/api/admin/core-values', payload);
    setEditing(null);
    load();
  }

  async function remove(it: CoreValue) {
    if (!confirm(`Xóa "${it.title}"?`)) return;
    await apiDelete(`/api/admin/core-values/${it.id}`);
    load();
  }

  async function reorder(next: CoreValue[]) {
    setItems(next);
    await apiPost('/api/admin/reorder', {
      model: 'coreValue',
      items: next.map((it, i) => ({ id: it.id, displayOrder: i + 1 })),
    });
  }

  return (
    <div>
      <div style={addRow}>
        <button style={primaryButton} onClick={() => setEditing({ number: '', title: '', description: '' })}>
          + Thêm giá trị
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
              {it.number} · {it.title}
            </div>
            <div style={{ fontSize: 12, color: colors.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {it.description}
            </div>
          </div>
        )}
      />

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing.id ? 'Sửa giá trị' : 'Thêm giá trị'} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 10 }}>
              <div>
                <span style={label}>Số thứ tự (01)</span>
                <input style={inputStyle} value={editing.number || ''} onChange={(e) => setEditing({ ...editing, number: e.target.value })} />
              </div>
              <div>
                <span style={label}>Tiêu đề</span>
                <input style={inputStyle} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
            </div>
            <div>
              <span style={label}>Mô tả</span>
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: 'vertical', fontFamily: fonts.body }}
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

function TimelineCrud() {
  const [items, setItems] = useState<TimelineEntry[]>([]);
  const [editing, setEditing] = useState<Partial<TimelineEntry> | null>(null);

  async function load() {
    setItems(await apiGet<TimelineEntry[]>('/api/admin/timeline'));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      year: editing.year || '',
      title: editing.title || '',
      description: editing.description || '',
      displayOrder: editing.displayOrder ?? items.length + 1,
    };
    if (editing.id) await apiPut(`/api/admin/timeline/${editing.id}`, payload);
    else await apiPost('/api/admin/timeline', payload);
    setEditing(null);
    load();
  }

  async function remove(it: TimelineEntry) {
    if (!confirm(`Xóa mốc "${it.year} · ${it.title}"?`)) return;
    await apiDelete(`/api/admin/timeline/${it.id}`);
    load();
  }

  async function reorder(next: TimelineEntry[]) {
    setItems(next);
    await apiPost('/api/admin/reorder', {
      model: 'timelineEntry',
      items: next.map((it, i) => ({ id: it.id, displayOrder: i + 1 })),
    });
  }

  return (
    <div>
      <div style={addRow}>
        <button style={primaryButton} onClick={() => setEditing({ year: '', title: '', description: '' })}>
          + Thêm mốc thời gian
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
              <span style={{ color: colors.gold }}>{it.year}</span> · {it.title}
            </div>
            <div style={{ fontSize: 12, color: colors.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {it.description}
            </div>
          </div>
        )}
      />

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing.id ? 'Sửa mốc' : 'Thêm mốc'} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 10 }}>
              <div>
                <span style={label}>Năm</span>
                <input style={inputStyle} value={editing.year || ''} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
              </div>
              <div>
                <span style={label}>Tiêu đề</span>
                <input style={inputStyle} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
            </div>
            <div>
              <span style={label}>Mô tả</span>
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: 'vertical', fontFamily: fonts.body }}
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

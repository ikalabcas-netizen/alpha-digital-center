'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { colors, fonts, radii, primaryButton, inputStyle } from '@/lib/styles';
import ImageUpload from './ImageUpload';

export type PageHero = {
  id?: string;
  pageSlug: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string | null;
  titleTail: string | null;
  subtitle: string | null;
  imageUrl: string | null;
};

type Props = {
  pageSlug: string;
  uploadPrefix: 'home' | 'about' | 'products' | 'blog' | 'testimonials' | 'tech' | 'materials' | 'team' | 'misc';
  hideImage?: boolean;
};

const wrap: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 320px',
  gap: 20,
  padding: 20,
  background: colors.cardBg,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg,
  marginBottom: 20,
};

const label: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textSecondary,
  fontFamily: fonts.body,
  marginBottom: 4,
  display: 'block',
};

export function PageHeroEditor({ pageSlug, uploadPrefix, hideImage = false }: Props) {
  const [hero, setHero] = useState<PageHero | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/page-hero/${pageSlug}`)
      .then((r) => r.json())
      .then((d) => setHero(d));
  }, [pageSlug]);

  async function save() {
    if (!hero) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/page-hero/${pageSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Lỗi');
      setToast('Đã lưu');
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!hero) return <div style={{ padding: 16, color: colors.textLight }}>Đang tải Hero…</div>;

  const update = (patch: Partial<PageHero>) => setHero({ ...hero, ...patch });

  return (
    <div style={hideImage ? { ...wrap, gridTemplateColumns: '1fr' } : wrap}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <span style={label}>Eyebrow (chữ nhỏ trên title)</span>
          <input style={inputStyle} value={hero.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <span style={label}>Title — phần đầu</span>
            <input style={inputStyle} value={hero.titleLead} onChange={(e) => update({ titleLead: e.target.value })} />
          </div>
          <div>
            <span style={label}>Title — accent (serif vàng)</span>
            <input style={inputStyle} value={hero.titleAccent || ''} onChange={(e) => update({ titleAccent: e.target.value || null })} />
          </div>
          <div>
            <span style={label}>Title — phần đuôi</span>
            <input style={inputStyle} value={hero.titleTail || ''} onChange={(e) => update({ titleTail: e.target.value || null })} />
          </div>
        </div>
        <div>
          <span style={label}>Subtitle</span>
          <textarea
            style={{ ...inputStyle, minHeight: 72, resize: 'vertical', fontFamily: fonts.body }}
            value={hero.subtitle || ''}
            onChange={(e) => update({ subtitle: e.target.value || null })}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
          <button style={primaryButton} onClick={save} disabled={saving}>
            {saving ? 'Đang lưu…' : 'Lưu Hero'}
          </button>
          {toast && <span style={{ fontSize: 13, color: colors.success }}>{toast}</span>}
        </div>
      </div>
      {!hideImage && (
        <div>
          <span style={label}>Ảnh Hero (tùy chọn)</span>
          <ImageUpload
            value={hero.imageUrl}
            onChange={(url) => update({ imageUrl: url })}
            prefix={uploadPrefix}
            height={220}
          />
        </div>
      )}
    </div>
  );
}

export default PageHeroEditor;

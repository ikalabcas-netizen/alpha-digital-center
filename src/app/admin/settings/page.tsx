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
} from '@/lib/styles';
import { apiGet, apiPut } from '@/lib/api-client';
import TabBar from '@/components/admin/TabBar';
import ImageUpload from '@/components/admin/ImageUpload';

type SettingMap = Record<string, string>;

const label: CSSProperties = { fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' };
const sectionTitle: CSSProperties = { fontSize: 15, fontWeight: 700, marginBottom: 12, color: colors.textPrimary, fontFamily: fonts.heading };

const GENERAL_KEYS = [
  { key: 'site.companyName', label: 'Tên công ty', placeholder: 'Alpha Digital Center', group: 'general' },
  { key: 'site.tagline', label: 'Tagline', placeholder: 'Digital dental laboratory — Est. 2014', group: 'general' },
];
const SEO_KEYS = [
  { key: 'seo.defaultTitle', label: 'Title mặc định (<title>)', group: 'seo' },
  { key: 'seo.defaultDescription', label: 'Meta description mặc định', group: 'seo', textarea: true },
];
const INTEGRATION_KEYS = [
  { key: 'integrations.zaloOaUrl', label: 'Link Zalo Official Account', group: 'integrations' },
  { key: 'integrations.fbPageUrl', label: 'Link Facebook Page', group: 'integrations' },
];

export default function SettingsAdmin() {
  const [tab, setTab] = useState('general');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Cài đặt hệ thống</h1>
        <div style={pageSubtitle}>Cấu hình toàn cục — ảnh hưởng mọi trang public</div>
      </div>

      <TabBar
        tabs={[
          { key: 'general', label: 'Công ty' },
          { key: 'seo', label: 'SEO mặc định' },
          { key: 'integrations', label: 'Tích hợp (Zalo, FB)' },
          { key: 'logo', label: 'Logo + OG Image' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'general' && <KeyValueForm title="Thông tin công ty" fields={GENERAL_KEYS} />}
      {tab === 'seo' && <KeyValueForm title="SEO mặc định" fields={SEO_KEYS} />}
      {tab === 'integrations' && <KeyValueForm title="Tích hợp" fields={INTEGRATION_KEYS} />}
      {tab === 'logo' && <LogoEditor />}
    </div>
  );
}

function KeyValueForm({
  title,
  fields,
}: {
  title: string;
  fields: { key: string; label: string; group: string; placeholder?: string; textarea?: boolean }[];
}) {
  const [values, setValues] = useState<SettingMap>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const groups = Array.from(new Set(fields.map((f) => f.group)));
      const map: SettingMap = {};
      for (const g of groups) {
        const rows = await apiGet<any[]>(`/api/admin/settings?group=${g}`);
        rows.forEach((r) => (map[r.key] = r.value));
      }
      setValues(map);
    })();
  }, [fields]);

  async function save() {
    setSaving(true);
    setToast(null);
    try {
      await apiPut('/api/admin/settings', {
        settings: fields.map((f) => ({ key: f.key, value: values[f.key] || '', group: f.group })),
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
      <div style={sectionTitle}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {fields.map((f) => (
          <div key={f.key}>
            <span style={label}>{f.label}</span>
            {f.textarea ? (
              <textarea
                style={{ ...inputStyle, minHeight: 72, resize: 'vertical', fontFamily: fonts.body }}
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            ) : (
              <input
                style={inputStyle}
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
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

function LogoEditor() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const rows = await apiGet<any[]>('/api/admin/settings?group=general');
      rows.forEach((r) => {
        if (r.key === 'site.logoUrl') setLogoUrl(r.value || null);
      });
      const seoRows = await apiGet<any[]>('/api/admin/settings?group=seo');
      seoRows.forEach((r) => {
        if (r.key === 'seo.ogImage') setOgImage(r.value || null);
      });
    })();
  }, []);

  async function save() {
    setSaving(true);
    setToast(null);
    try {
      await apiPut('/api/admin/settings', {
        settings: [
          { key: 'site.logoUrl', value: logoUrl || '', group: 'general' },
          { key: 'seo.ogImage', value: ogImage || '', group: 'seo' },
        ],
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
      <div style={sectionTitle}>Logo + OG Image</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
        <div>
          <span style={label}>Logo công ty (header / footer)</span>
          <ImageUpload value={logoUrl} onChange={setLogoUrl} prefix="misc" height={140} />
        </div>
        <div>
          <span style={label}>OG Image (share Facebook / Zalo)</span>
          <ImageUpload value={ogImage} onChange={setOgImage} prefix="misc" height={140} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button style={primaryButton} onClick={save} disabled={saving}>
          {saving ? 'Đang lưu…' : 'Lưu'}
        </button>
        {toast && <span style={{ fontSize: 13, color: colors.success }}>{toast}</span>}
      </div>
    </div>
  );
}

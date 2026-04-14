'use client';

import React, { useState } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  primaryButton,
  secondaryButton,
  inputStyle,
  pageTitle,
  pageSubtitle,
  transitions,
  getBadgeStyle,
} from '@/lib/styles';
import {
  Settings,
  Building2,
  Bot,
  Share2,
  Search,
  Save,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  zaloLink: string;
}

interface AIProviderConfig {
  name: string;
  apiKey: string;
  model: string;
  models: string[];
  active: boolean;
}

interface FacebookConfig {
  pageId: string;
  appId: string;
  pageAccessToken: string;
  pixelId: string;
}

interface SeoConfig {
  defaultTitle: string;
  defaultDescription: string;
}

export default function SettingsPage() {
  const [company, setCompany] = useState<CompanyInfo>({
    name: 'Alpha Digital Center',
    phone: '0378 422 496',
    email: 'info@alphacenter.vn',
    address: '242/12 Pham Van Hai, Q. Tan Binh, TP.HCM',
    workingHours: 'T2 - T7: 8:00 - 17:30',
    zaloLink: '',
  });

  const [aiProviders, setAiProviders] = useState<AIProviderConfig[]>([
    {
      name: 'Claude',
      apiKey: '',
      model: 'claude-sonnet-4-6',
      models: ['claude-sonnet-4-6', 'claude-sonnet-4-5-20250514', 'claude-3-5-haiku-20241022'],
      active: true,
    },
    {
      name: 'Gemini',
      apiKey: '',
      model: 'gemini-2.0-flash',
      models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'],
      active: false,
    },
    {
      name: 'DeepSeek',
      apiKey: '',
      model: 'deepseek-chat',
      models: ['deepseek-chat', 'deepseek-reasoner'],
      active: false,
    },
  ]);

  const [facebook, setFacebook] = useState<FacebookConfig>({
    pageId: '',
    appId: '',
    pageAccessToken: '',
    pixelId: '',
  });

  const [seo, setSeo] = useState<SeoConfig>({
    defaultTitle: 'Alpha Digital Center - Labo Nha Khoa Ky Thuat So',
    defaultDescription:
      'Alpha Digital Center - Trung tam gia cong rang su va phuc hinh nha khoa ky thuat so hang dau tai TP.HCM. Cong nghe CAD/CAM, in 3D hien dai.',
  });

  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const handleSave = (section: string) => {
    setSavingSection(section);
    setTimeout(() => setSavingSection(null), 1000);
  };

  const updateProvider = (index: number, field: string, value: string | boolean) => {
    setAiProviders((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    margin: 0,
  };

  const sectionIconStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: colors.primaryBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Cai dat</h1>
        <p style={pageSubtitle}>Quan ly cau hinh he thong</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
        {/* Section 1: Company Info */}
        <div style={{ ...cardStyle, padding: '24px 24px 20px' }}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}>
              <Building2 size={18} color={colors.primary} />
            </div>
            <h2 style={sectionTitleStyle}>Thong tin cong ty</h2>
          </div>

          <Input
            label="Ten cong ty"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="So dien thoai"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
            />
          </div>
          <Input
            label="Dia chi"
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Gio lam viec"
              value={company.workingHours}
              onChange={(e) => setCompany({ ...company, workingHours: e.target.value })}
            />
            <Input
              label="Zalo link"
              placeholder="https://zalo.me/..."
              value={company.zaloLink}
              onChange={(e) => setCompany({ ...company, zaloLink: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button
              onClick={() => handleSave('company')}
              loading={savingSection === 'company'}
            >
              <Save size={14} />
              {savingSection === 'company' ? 'Dang luu...' : 'Luu thay doi'}
            </Button>
          </div>
        </div>

        {/* Section 2: AI Providers */}
        <div style={{ ...cardStyle, padding: '24px 24px 20px' }}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}>
              <Bot size={18} color={colors.primary} />
            </div>
            <h2 style={sectionTitleStyle}>AI Providers</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {aiProviders.map((provider, index) => (
              <div
                key={provider.name}
                style={{
                  border: `1px solid ${provider.active ? colors.borderCyan : colors.border}`,
                  borderRadius: 10,
                  padding: 16,
                  background: provider.active ? colors.primaryUltraLight : colors.cardBg,
                  transition: transitions.fast,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      fontFamily: fonts.body,
                    }}
                  >
                    {provider.name}
                  </span>
                  <button
                    onClick={() => updateProvider(index, 'active', !provider.active)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: provider.active ? colors.success : colors.textMuted,
                      padding: 0,
                    }}
                  >
                    {provider.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 500,
                      color: colors.textSecondary,
                      marginBottom: 3,
                      fontFamily: fonts.body,
                    }}
                  >
                    API Key
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showApiKeys[provider.name] ? 'text' : 'password'}
                      placeholder="sk-..."
                      value={provider.apiKey}
                      onChange={(e) =>
                        updateProvider(index, 'apiKey', e.target.value)
                      }
                      style={{
                        ...inputStyle,
                        fontSize: 12,
                        paddingRight: 32,
                      }}
                    />
                    <button
                      onClick={() =>
                        setShowApiKeys((prev) => ({
                          ...prev,
                          [provider.name]: !prev[provider.name],
                        }))
                      }
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.textMuted,
                        padding: 2,
                      }}
                    >
                      {showApiKeys[provider.name] ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 500,
                      color: colors.textSecondary,
                      marginBottom: 3,
                      fontFamily: fonts.body,
                    }}
                  >
                    Model
                  </label>
                  <select
                    value={provider.model}
                    onChange={(e) =>
                      updateProvider(index, 'model', e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      fontSize: 12,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      paddingRight: 28,
                      cursor: 'pointer',
                    }}
                  >
                    {provider.models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button
              onClick={() => handleSave('ai')}
              loading={savingSection === 'ai'}
            >
              <Save size={14} />
              {savingSection === 'ai' ? 'Dang luu...' : 'Luu thay doi'}
            </Button>
          </div>
        </div>

        {/* Section 3: Facebook */}
        <div style={{ ...cardStyle, padding: '24px 24px 20px' }}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}>
              <Share2 size={18} color={colors.primary} />
            </div>
            <h2 style={sectionTitleStyle}>Facebook</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Facebook Page ID"
              placeholder="VD: 123456789"
              value={facebook.pageId}
              onChange={(e) => setFacebook({ ...facebook, pageId: e.target.value })}
            />
            <Input
              label="Facebook App ID"
              placeholder="VD: 987654321"
              value={facebook.appId}
              onChange={(e) => setFacebook({ ...facebook, appId: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: colors.textSecondary,
                marginBottom: 4,
                fontFamily: fonts.body,
              }}
            >
              Page Access Token
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showApiKeys['facebook'] ? 'text' : 'password'}
                placeholder="EAA..."
                value={facebook.pageAccessToken}
                onChange={(e) =>
                  setFacebook({ ...facebook, pageAccessToken: e.target.value })
                }
                style={{
                  ...inputStyle,
                  paddingRight: 36,
                }}
              />
              <button
                onClick={() =>
                  setShowApiKeys((prev) => ({
                    ...prev,
                    facebook: !prev['facebook'],
                  }))
                }
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textMuted,
                  padding: 2,
                }}
              >
                {showApiKeys['facebook'] ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>
          </div>

          <Input
            label="Facebook Pixel ID"
            placeholder="VD: 111222333444"
            value={facebook.pixelId}
            onChange={(e) => setFacebook({ ...facebook, pixelId: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button
              onClick={() => handleSave('facebook')}
              loading={savingSection === 'facebook'}
            >
              <Save size={14} />
              {savingSection === 'facebook' ? 'Dang luu...' : 'Luu thay doi'}
            </Button>
          </div>
        </div>

        {/* Section 4: Default SEO */}
        <div style={{ ...cardStyle, padding: '24px 24px 20px' }}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}>
              <Search size={18} color={colors.primary} />
            </div>
            <h2 style={sectionTitleStyle}>SEO mac dinh</h2>
          </div>

          <Input
            label="Meta title mac dinh"
            placeholder="Tieu de mac dinh cho cac trang"
            value={seo.defaultTitle}
            onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
          />

          <Textarea
            label="Meta description mac dinh"
            placeholder="Mo ta mac dinh cho cac trang..."
            rows={3}
            value={seo.defaultDescription}
            onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
          />

          <div
            style={{
              background: colors.pageBg,
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 11, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 4 }}>
              Xem truoc tren Google
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#1a0dab',
                fontFamily: 'Arial, sans-serif',
                marginBottom: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {seo.defaultTitle || 'Tieu de trang'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#006621',
                fontFamily: 'Arial, sans-serif',
                marginBottom: 2,
              }}
            >
              alphacenter.vn
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#545454',
                fontFamily: 'Arial, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {seo.defaultDescription || 'Mo ta trang web...'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button
              onClick={() => handleSave('seo')}
              loading={savingSection === 'seo'}
            >
              <Save size={14} />
              {savingSection === 'seo' ? 'Dang luu...' : 'Luu thay doi'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

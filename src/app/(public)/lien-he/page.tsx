'use client';

import { useState, type FormEvent } from 'react';
import { colors, fonts, inputStyle, primaryButton } from '@/lib/styles';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';

interface FormData {
  labName: string;
  contactPerson: string;
  phone: string;
  email: string;
  productInterest: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  labName: '',
  contactPerson: '',
  phone: '',
  email: '',
  productInterest: '',
  message: '',
};

const PRODUCT_OPTIONS = [
  'Toan su (Zirconia)',
  'Su ep (E.Max)',
  'Kim loai',
  'Thao lap',
  'Implant',
  'Khac',
];

export default function LienHePage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Gui that bai');

      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch {
      setError('Co loi xay ra. Vui long thu lai hoac goi truc tiep hotline.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 6,
    fontFamily: fonts.body,
  };

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #ecfeff 0%, #f0f9ff 40%, #e0f2fe 100%)',
          padding: '60px 0 48px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              background: colors.primaryBg,
              color: colors.primaryHover,
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Lien he
          </div>
          <h1
            style={{
              fontFamily: fonts.heading,
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 800,
              color: colors.textPrimary,
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Lien He & <span style={{ color: colors.primary }}>Bao Gia</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              lineHeight: 1.7,
              maxWidth: 550,
              margin: '0 auto',
            }}
          >
            San sang ho tro ban! Gui yeu cau bao gia hoac lien he truc tiep qua
            hotline va Zalo de duoc tu van nhanh nhat.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '48px 0 64px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* Contact Info */}
          <div>
            <div
              style={{
                background: colors.cardBg,
                borderRadius: 16,
                padding: 28,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 18,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  marginBottom: 20,
                }}
              >
                Thong tin lien he
              </h2>

              {[
                {
                  icon: Phone,
                  label: 'Hotline',
                  value: '0378 422 496',
                  href: 'tel:0378422496',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'info@alphacenter.vn',
                  href: 'mailto:info@alphacenter.vn',
                },
                {
                  icon: MapPin,
                  label: 'Dia chi',
                  value: '242/12 Pham Van Hai, Q. Tan Binh, TP.HCM',
                  href: undefined,
                },
                {
                  icon: Clock,
                  label: 'Gio lam viec',
                  value: 'T2 - T7: 8:00 - 17:30',
                  href: undefined,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      gap: 14,
                      marginBottom: 18,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: colors.primaryUltraLight,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color={colors.primary} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: colors.textPrimary,
                            textDecoration: 'none',
                          }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zalo CTA */}
            <a
              href="https://zalo.me/0378422496"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #0068ff, #0055cc)',
                  borderRadius: 14,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MessageCircle size={22} color="#fff" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: 2,
                      fontFamily: fonts.heading,
                    }}
                  >
                    Chat qua Zalo
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                    Tu van nhanh, gui file tien loi
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Quote Request Form */}
          <div
            style={{
              background: colors.cardBg,
              borderRadius: 16,
              padding: 32,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 8px rgba(6,182,212,0.08)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle
                  size={48}
                  color={colors.success}
                  style={{ marginBottom: 16 }}
                />
                <h3
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: 10,
                  }}
                >
                  Gui thanh cong!
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  Cam on ban da quan tam. Doi ngu kinh doanh se lien he voi ban
                  trong vong 2 gio lam viec.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    ...primaryButton,
                    padding: '10px 24px',
                    fontSize: 14,
                  }}
                >
                  Gui yeu cau khac
                </button>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: 6,
                  }}
                >
                  Yeu cau bao gia
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    marginBottom: 24,
                  }}
                >
                  Dien thong tin ben duoi, chung toi se phan hoi trong thoi gian som nhat.
                </p>

                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 14px',
                      background: colors.dangerBg,
                      borderRadius: 8,
                      marginBottom: 16,
                      fontSize: 13,
                      color: colors.danger,
                    }}
                  >
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>
                        Ten labo / Phong kham <span style={{ color: colors.danger }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.labName}
                        onChange={(e) => handleChange('labName', e.target.value)}
                        required
                        placeholder="VD: Labo Nha Khoa ABC"
                        style={{ ...inputStyle, padding: '10px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        Nguoi lien he <span style={{ color: colors.danger }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.contactPerson}
                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                        required
                        placeholder="Ho va ten"
                        style={{ ...inputStyle, padding: '10px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        So dien thoai <span style={{ color: colors.danger }}>*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                        placeholder="0378 xxx xxx"
                        style={{ ...inputStyle, padding: '10px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@example.com"
                        style={{ ...inputStyle, padding: '10px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>San pham quan tam</label>
                    <select
                      value={form.productInterest}
                      onChange={(e) => handleChange('productInterest', e.target.value)}
                      style={{
                        ...inputStyle,
                        padding: '10px 12px',
                        appearance: 'auto',
                      }}
                    >
                      <option value="">-- Chon san pham --</option>
                      {PRODUCT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Noi dung yeu cau</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={4}
                      placeholder="Mo ta nhu cau gia cong, so luong, thoi gian mong muon..."
                      style={{
                        ...inputStyle,
                        padding: '10px 12px',
                        resize: 'vertical',
                        minHeight: 100,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      ...primaryButton,
                      width: '100%',
                      padding: '12px 24px',
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Send size={16} />
                    )}
                    {loading ? 'Dang gui...' : 'Gui yeu cau bao gia'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

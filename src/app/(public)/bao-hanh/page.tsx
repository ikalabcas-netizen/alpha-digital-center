'use client';

import { useState } from 'react';
import { colors, fonts, inputStyle, primaryButton, cardStyle } from '@/lib/styles';
import {
  Search,
  Shield,
  Calendar,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';

interface WarrantyResult {
  code: string;
  product: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  lab: string;
  notes: string;
}

export default function BaoHanhPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WarrantyResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setSearched(true);

    // Simulate API call - replace with real endpoint later
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Demo result for testing
    if (code.trim().toUpperCase().startsWith('ADC')) {
      setResult({
        code: code.trim().toUpperCase(),
        product: 'Sứ Zirconia Cercon HT',
        category: 'Toàn sứ',
        startDate: '15/03/2024',
        endDate: '15/03/2034',
        status: 'active',
        lab: 'Labo Nha Khoa ABC',
        notes: 'Bảo hành 10 năm - Sườn Zirconia Cercon HT Dentsply Sirona',
      });
    } else {
      setResult(null);
    }

    setLoading(false);
  };

  const statusConfig = {
    active: {
      label: 'Còn hiệu lực',
      bg: '#f0fdf4',
      color: '#16a34a',
      icon: CheckCircle,
    },
    expired: {
      label: 'Hết hạn',
      bg: '#fff1f2',
      color: '#e11d48',
      icon: AlertCircle,
    },
    pending: {
      label: 'Đang xử lý',
      bg: '#fffbeb',
      color: '#d97706',
      icon: Clock,
    },
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
              width: 64,
              height: 64,
              background: colors.primaryBg,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <Shield size={28} color={colors.primary} />
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
            Tra Cứu <span style={{ color: colors.primary }}>Bảo Hành</span>
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
            Nhập mã bảo hành in trên thẻ bảo hành đi kèm sản phẩm để kiểm tra
            thông tin và trạng thái bảo hành.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
          {/* Search Box */}
          <div
            style={{
              background: colors.cardBg,
              borderRadius: 16,
              padding: 28,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 8px rgba(6,182,212,0.08)',
              marginBottom: 24,
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: 8,
                fontFamily: fonts.body,
              }}
            >
              Mã bảo hành
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ví dụ: ADC-2024-00123"
                style={{
                  ...inputStyle,
                  flex: 1,
                  padding: '11px 14px',
                  fontSize: 14,
                }}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !code.trim()}
                style={{
                  ...primaryButton,
                  padding: '11px 22px',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: loading || !code.trim() ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? (
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Search size={16} />
                )}
                Tra cứu
              </button>
            </div>
            <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>
              Mã bảo hành gồm 3 phần, cách nhau bằng dấu gạch ngang. Ví dụ: ADC-2024-00123
            </p>
          </div>

          {/* Results */}
          {searched && !loading && (
            <>
              {result ? (
                <div
                  style={{
                    background: colors.cardBg,
                    borderRadius: 16,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 2px 8px rgba(6,182,212,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Status Header */}
                  <div
                    style={{
                      background: statusConfig[result.status].bg,
                      padding: '16px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    {(() => {
                      const StatusIcon = statusConfig[result.status].icon;
                      return <StatusIcon size={20} color={statusConfig[result.status].color} />;
                    })()}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: statusConfig[result.status].color,
                      }}
                    >
                      {statusConfig[result.status].label}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ padding: 24 }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 20,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Shield size={14} color={colors.textMuted} />
                          <span style={{ fontSize: 12, color: colors.textMuted }}>Mã bảo hành</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                          {result.code}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Package size={14} color={colors.textMuted} />
                          <span style={{ fontSize: 12, color: colors.textMuted }}>Sản phẩm</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                          {result.product}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Calendar size={14} color={colors.textMuted} />
                          <span style={{ fontSize: 12, color: colors.textMuted }}>Ngày bắt đầu</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                          {result.startDate}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Calendar size={14} color={colors.textMuted} />
                          <span style={{ fontSize: 12, color: colors.textMuted }}>Ngày hết hạn</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                          {result.endDate}
                        </div>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Package size={14} color={colors.textMuted} />
                          <span style={{ fontSize: 12, color: colors.textMuted }}>Labo</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                          {result.lab}
                        </div>
                      </div>
                    </div>

                    {result.notes && (
                      <div
                        style={{
                          marginTop: 18,
                          padding: '12px 14px',
                          background: colors.primaryUltraLight,
                          borderRadius: 8,
                          fontSize: 13,
                          color: colors.textSecondary,
                          lineHeight: 1.5,
                        }}
                      >
                        {result.notes}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    ...cardStyle,
                    borderRadius: 16,
                    padding: 40,
                    textAlign: 'center',
                  }}
                >
                  <AlertCircle
                    size={40}
                    color={colors.textMuted}
                    style={{ marginBottom: 12 }}
                  />
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: 8,
                    }}
                  >
                    Không tìm thấy thông tin bảo hành
                  </h3>
                  <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
                    Mã bảo hành không tồn tại hoặc chưa được kích hoạt.
                    Vui lòng kiểm tra lại mã hoặc liên hệ hotline{' '}
                    <a href="tel:0378422496" style={{ color: colors.primary, fontWeight: 600 }}>
                      0378 422 496
                    </a>{' '}
                    để được hỗ trợ.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Info */}
          <div
            style={{
              marginTop: 32,
              padding: '20px 24px',
              background: colors.primaryUltraLight,
              borderRadius: 12,
              border: `1px solid ${colors.borderCyan}`,
            }}
          >
            <h3
              style={{
                fontFamily: fonts.heading,
                fontSize: 14,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 10,
              }}
            >
              Chính sách bảo hành
            </h3>
            <ul
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                lineHeight: 1.7,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>Bảo hành từ 3 - 19 năm tùy dòng sản phẩm</li>
              <li>Bảo hành miễn phí lỗi kỹ thuật do Alpha Digital Center</li>
              <li>Hỗ trợ bảo hành nhanh chóng trong 24-48h</li>
              <li>Liên hệ hotline 0378 422 496 để bảo hành trực tiếp</li>
            </ul>
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

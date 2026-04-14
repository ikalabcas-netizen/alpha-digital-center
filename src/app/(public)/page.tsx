import { colors, fonts } from '@/lib/styles';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Award,
  ArrowRight,
  Clock,
  Users,
  Package,
  Star,
} from 'lucide-react';

const FEATURED_PRODUCTS = [
  {
    name: 'Sứ Zirconia Cercon HT',
    category: 'Toàn sứ',
    warranty: '10 năm',
    slug: 'su-zirconia-cercon-ht',
    description: 'Sườn Zirconia Cercon HT của Dentsply Sirona, độ bền vượt trội, thẩm mỹ cao.',
  },
  {
    name: 'Sứ ép E.Max',
    category: 'Sứ ép',
    warranty: '7 năm',
    slug: 'su-ep-emax',
    description: 'Lithium Disilicate cao cấp từ Ivoclar, thẩm mỹ tối ưu cho vùng răng trước.',
  },
  {
    name: 'Sứ Zolid',
    category: 'Toàn sứ',
    warranty: '15 năm',
    slug: 'su-zolid',
    description: 'Zirconia thế hệ mới từ Amann Girrbach, độ trong suốt và bền bỉ vượt trội.',
  },
  {
    name: 'Custom Abutment Implant',
    category: 'Implant',
    warranty: '10 năm',
    slug: 'custom-abutment-implant',
    description: 'Abutment cá nhân hóa bằng Titanium/Zirconia, tương thích mọi hệ implant.',
  },
];

const STATS = [
  { icon: Clock, value: '10+', label: 'Năm kinh nghiệm' },
  { icon: Users, value: '500+', label: 'Labo đối tác' },
  { icon: Package, value: '50,000+', label: 'Sản phẩm/năm' },
  { icon: Star, value: '99%', label: 'Hài lòng' },
];

const STRENGTHS = [
  {
    icon: Zap,
    title: 'Công nghệ CAD/CAM',
    desc: 'Máy phay CNC 5 trục, scanner 3D chính xác cao, in 3D kim loại và nhựa.',
  },
  {
    icon: Shield,
    title: 'Bảo hành lên đến 19 năm',
    desc: 'Cam kết bảo hành dài hạn cho mọi sản phẩm. Quy trình kiểm soát chất lượng nghiêm ngặt.',
  },
  {
    icon: Award,
    title: 'Vật liệu chính hãng',
    desc: 'Sử dụng phôi Zirconia, sứ ép từ các hãng hàng đầu: Dentsply, Ivoclar, Amann Girrbach.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #ecfeff 0%, #f0f9ff 40%, #e0f2fe 100%)',
          padding: '80px 0 60px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: colors.primaryBg,
                color: colors.primaryHover,
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Digital Service For Lab
            </div>
            <h1
              style={{
                fontFamily: fonts.heading,
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 800,
                color: colors.textPrimary,
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              Gia Công Nha Khoa{' '}
              <span style={{ color: colors.primary }}>Chuyên Nghiệp</span>
            </h1>
            <p
              style={{
                fontSize: 16,
                color: colors.textSecondary,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Alpha Digital Center - Đối tác gia công bán thành phẩm hàng đầu cho labo nha khoa.
              Ứng dụng công nghệ CAD/CAM và in 3D, vật liệu chính hãng, bảo hành lên đến 19 năm.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/san-pham">
                <button
                  style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: fonts.body,
                    boxShadow: '0 4px 16px rgba(6,182,212,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Xem sản phẩm <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/lien-he">
                <button
                  style={{
                    padding: '12px 28px',
                    background: '#fff',
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: fonts.body,
                  }}
                >
                  Liên hệ báo giá
                </button>
              </Link>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 20,
              padding: 32,
              border: '1px solid rgba(6,182,212,0.15)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                fontFamily: fonts.heading,
                fontWeight: 900,
                color: '#fff',
              }}
            >
              A
            </div>
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: 20,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              Alpha Digital Center
            </div>
            <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
              Uy tín - Chất lượng - Chuyên nghiệp
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          background: '#0B1929',
          padding: '32px 0',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24,
          }}
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <Icon size={24} color={colors.primary} style={{ marginBottom: 8 }} />
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    fontFamily: fonts.heading,
                    color: '#fff',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Strengths */}
      <section style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: fonts.heading,
                fontSize: 28,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 8,
              }}
            >
              Tại sao chọn Alpha Digital Center?
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Đối tác gia công tin cậy cho hơn 500 labo trên toàn quốc
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {STRENGTHS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 28,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: colors.primaryUltraLight,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={22} color={colors.primary} />
                  </div>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 17,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '64px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                Sản phẩm nổi bật
              </h2>
              <p style={{ fontSize: 14, color: colors.textSecondary }}>
                Các sản phẩm gia công được ưa chuộng nhất
              </p>
            </div>
            <Link href="/san-pham">
              <span
                style={{
                  fontSize: 13,
                  color: colors.primary,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                Xem tất cả <ArrowRight size={14} />
              </span>
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {FEATURED_PRODUCTS.map((product) => (
              <Link key={product.slug} href={`/san-pham/${product.slug}`}>
                <div
                  style={{
                    background: colors.pageBg,
                    borderRadius: 14,
                    padding: 24,
                    border: `1px solid ${colors.border}`,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      background: colors.primaryBg,
                      color: colors.primaryHover,
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    {product.category}
                  </div>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: 8,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      lineHeight: 1.5,
                      marginBottom: 12,
                    }}
                  >
                    {product.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: colors.success,
                      fontWeight: 600,
                    }}
                  >
                    <Shield size={14} />
                    Bảo hành {product.warranty}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '64px 0',
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <h2
            style={{
              fontFamily: fonts.heading,
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 12,
            }}
          >
            Sẵn sàng hợp tác?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Liên hệ ngay để nhận bảng giá và tư vấn miễn phí.
            Đội ngũ kinh doanh sẵn sàng hỗ trợ bạn 24/7.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/lien-he">
              <button
                style={{
                  padding: '12px 32px',
                  background: '#fff',
                  color: colors.primary,
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                }}
              >
                Yêu cầu báo giá
              </button>
            </Link>
            <a href="tel:0378422496">
              <button
                style={{
                  padding: '12px 32px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                }}
              >
                Gọi ngay: 0378 422 496
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import { colors, fonts } from '@/lib/styles';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Crown,
  Flame,
  Cog,
  Puzzle,
  CircleDot,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sản phẩm | Alpha Digital Center',
  description:
    'Danh mục sản phẩm gia công nha khoa: Toàn sứ Zirconia, Sứ ép, Kim loại, Tháo lắp, Implant. Vật liệu chính hãng, bảo hành dài hạn.',
};

const CATEGORIES = [
  {
    slug: 'toan-su',
    name: 'Toàn sứ (Zirconia)',
    icon: Crown,
    description:
      'Phục hình toàn sứ cao cấp từ Zirconia Cercon HT, Zolid, Katana. Độ bền vượt trội, thẩm mỹ tự nhiên, bảo hành lên đến 19 năm.',
    products: ['Cercon HT', 'Zolid', 'Katana UTML', 'Prettau'],
  },
  {
    slug: 'su-ep',
    name: 'Sứ ép',
    icon: Flame,
    description:
      'Sứ ép Lithium Disilicate E.Max từ Ivoclar. Thẩm mỹ tối ưu cho vùng răng trước, độ trong suốt tự nhiên.',
    products: ['E.Max Press', 'E.Max CAD', 'Initial LiSi'],
  },
  {
    slug: 'kim-loai',
    name: 'Kim loại',
    icon: Cog,
    description:
      'Khung sườn kim loại CoCr, NiCr phay CNC chính xác. Sứ kim loại truyền thống với độ bền cao.',
    products: ['CoCr', 'NiCr', 'Titanium', 'Sứ kim loại'],
  },
  {
    slug: 'thao-lap',
    name: 'Tháo lắp',
    icon: Puzzle,
    description:
      'Hàm tháo lắp bán phần, toàn phần. Khung sườn CoCr phay CNC, răng nhựa nhập khẩu, mắt đoán chính xác.',
    products: ['Khung CoCr', 'Hàm nhựa', 'Valplast', 'Răng Ivoclar'],
  },
  {
    slug: 'implant',
    name: 'Implant',
    icon: CircleDot,
    description:
      'Custom Abutment Titanium/Zirconia, phục hình trên Implant. Tương thích mọi hệ Implant phổ biến.',
    products: ['Custom Abutment', 'Screw-retained', 'Cement-retained', 'All-on-X'],
  },
];

export default function SanPhamPage() {
  return (
    <div>
      {/* Hero Section */}
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
            Danh mục sản phẩm
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
            Sản Phẩm <span style={{ color: colors.primary }}>Gia Công Nha Khoa</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Alpha Digital Center cung cấp đầy đủ các dòng sản phẩm gia công bán thành phẩm
            cho labo nha khoa. Vật liệu chính hãng, công nghệ CAD/CAM hiện đại.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 24,
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/san-pham/${cat.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: colors.cardBg,
                      borderRadius: 16,
                      padding: 28,
                      border: `1px solid ${colors.border}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: colors.primaryUltraLight,
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 18,
                      }}
                    >
                      <Icon size={24} color={colors.primary} />
                    </div>
                    <h2
                      style={{
                        fontFamily: fonts.heading,
                        fontSize: 19,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        marginBottom: 10,
                      }}
                    >
                      {cat.name}
                    </h2>
                    <p
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                        lineHeight: 1.65,
                        marginBottom: 16,
                        flex: 1,
                      }}
                    >
                      {cat.description}
                    </p>
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: colors.textMuted,
                          marginBottom: 8,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Sản phẩm tiêu biểu
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {cat.products.map((p) => (
                          <span
                            key={p}
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              background: colors.primaryBg,
                              color: colors.primaryHover,
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        color: colors.primary,
                      }}
                    >
                      Xem chi tiết <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: '48px 0',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <h2
            style={{
              fontFamily: fonts.heading,
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 10,
            }}
          >
            Cần tư vấn sản phẩm?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Liên hệ đội ngũ kinh doanh để được tư vấn chi tiết và nhận bảng giá tốt nhất.
          </p>
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
              Liên hệ báo giá
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

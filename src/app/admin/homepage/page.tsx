'use client';

import React, { useState, useCallback } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  pageTitle,
  pageSubtitle,
  transitions,
} from '@/lib/styles';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Type,
  Star,
  Award,
  ShoppingBag,
  CheckSquare,
  Save,
  Check,
} from 'lucide-react';

// ---- Types ----

interface HeroData {
  title: string;
  subtitle: string;
  badge: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

interface StatItem {
  icon: string;
  value: string;
  label: string;
}

interface UspItem {
  title: string;
  description: string;
}

interface FeaturedProduct {
  id: string;
  name: string;
  checked: boolean;
}

// ---- Section Header Component ----

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 18,
        paddingBottom: 12,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: colors.primaryBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={16} color={colors.primary} />
      </div>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: colors.textPrimary,
          fontFamily: fonts.heading,
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// ---- Toast Component ----

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: colors.success,
        color: colors.white,
        padding: '12px 20px',
        borderRadius: 8,
        fontSize: 13,
        fontFamily: fonts.body,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <Check size={16} />
      {message}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: colors.white,
          cursor: 'pointer',
          marginLeft: 8,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ---- Default Data ----

const defaultHero: HeroData = {
  title: 'Gia Công Nha Khoa Chuyên Nghiệp',
  subtitle:
    'Alpha Digital Center - Đối tác gia công nha khoa hàng đầu với công nghệ CAD/CAM tiên tiến, đảm bảo chất lượng vượt trội cho mọi sản phẩm.',
  badge: 'Digital Service For Lab',
  cta1Text: 'Xem sản phẩm',
  cta1Link: '/products',
  cta2Text: 'Liên hệ ngay',
  cta2Link: '/contact',
};

const defaultStats: StatItem[] = [
  { icon: 'Clock', value: '10+', label: 'Năm kinh nghiệm' },
  { icon: 'Users', value: '500+', label: 'Labo đối tác' },
  { icon: 'Package', value: '50,000+', label: 'Sản phẩm/năm' },
  { icon: 'ThumbsUp', value: '99%', label: 'Hài lòng' },
];

const defaultUsps: UspItem[] = [
  {
    title: 'Công nghệ CAD/CAM',
    description:
      'Ứng dụng công nghệ CAD/CAM tiên tiến nhất trong thiết kế và gia công nha khoa, đảm bảo độ chính xác tuyệt đối.',
  },
  {
    title: 'Bảo hành lên đến 19 năm',
    description:
      'Cam kết bảo hành dài hạn cho tất cả sản phẩm, thể hiện sự tự tin vào chất lượng sản xuất.',
  },
  {
    title: 'Vật liệu chính hãng',
    description:
      'Sử dụng 100% vật liệu chính hãng từ các thương hiệu hàng đầu thế giới như Ivoclar, VITA, Kuraray.',
  },
];

const defaultProducts: FeaturedProduct[] = [
  { id: '1', name: 'Răng sứ Zirconia Multilayer', checked: true },
  { id: '2', name: 'Răng sứ E.max', checked: true },
  { id: '3', name: 'Khám hàm đợi', checked: false },
  { id: '4', name: 'Mặt dán sứ Veneer', checked: true },
  { id: '5', name: 'Inlay / Onlay', checked: false },
  { id: '6', name: 'Khung sườn CoCr', checked: false },
  { id: '7', name: 'Hàm không Titanium', checked: true },
  { id: '8', name: 'Nhiệt lực hàm', checked: false },
];

// ---- Main Component ----

export default function HomepageManager() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [usps, setUsps] = useState<UspItem[]>(defaultUsps);
  const [products, setProducts] = useState<FeaturedProduct[]>(defaultProducts);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSave = useCallback(
    async (section: string) => {
      setSaving(true);
      // Placeholder: simulate API call
      await new Promise((r) => setTimeout(r, 600));
      setSaving(false);
      showToast(`Đã lưu ${section} thành công!`);
    },
    [showToast]
  );

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    setStats((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const updateUsp = (index: number, field: keyof UspItem, value: string) => {
    setUsps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const toggleProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Quản lý Trang chủ</h1>
        <p style={pageSubtitle}>
          Chỉnh sửa nội dung hiển thị trên trang chủ của website
        </p>
      </div>

      {/* Section 1: Hero */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Type} title="Hero Banner" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              label="Tiêu đề chính"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              placeholder="Nhập tiêu đề chính..."
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Textarea
              label="Mô tả phụ"
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              placeholder="Nhập mô tả phụ..."
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              label="Badge text"
              value={hero.badge}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              placeholder="VD: Digital Service For Lab"
            />
          </div>
          <Input
            label="CTA 1 - Text"
            value={hero.cta1Text}
            onChange={(e) => setHero({ ...hero, cta1Text: e.target.value })}
          />
          <Input
            label="CTA 1 - Link"
            value={hero.cta1Link}
            onChange={(e) => setHero({ ...hero, cta1Link: e.target.value })}
          />
          <Input
            label="CTA 2 - Text"
            value={hero.cta2Text}
            onChange={(e) => setHero({ ...hero, cta2Text: e.target.value })}
          />
          <Input
            label="CTA 2 - Link"
            value={hero.cta2Link}
            onChange={(e) => setHero({ ...hero, cta2Link: e.target.value })}
          />
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button loading={saving} onClick={() => handleSave('Hero')}>
            <Save size={14} />
            Lưu Hero
          </Button>
        </div>
      </div>

      {/* Section 2: Stats */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Star} title="Thống kê" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                padding: 14,
                background: colors.pageBg,
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.textMuted,
                  marginBottom: 8,
                  fontFamily: fonts.body,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Thống kê {idx + 1}
              </div>
              <Input
                label="Icon"
                value={stat.icon}
                onChange={(e) => updateStat(idx, 'icon', e.target.value)}
                placeholder="Tên icon (Clock, Users, Package...)"
              />
              <Input
                label="Giá trị"
                value={stat.value}
                onChange={(e) => updateStat(idx, 'value', e.target.value)}
                placeholder="VD: 10+"
              />
              <Input
                label="Nhãn"
                value={stat.label}
                onChange={(e) => updateStat(idx, 'label', e.target.value)}
                placeholder="VD: Năm kinh nghiệm"
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button loading={saving} onClick={() => handleSave('Thống kê')}>
            <Save size={14} />
            Lưu Thống kê
          </Button>
        </div>
      </div>

      {/* Section 3: USPs */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Award} title="Điểm mạnh" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {usps.map((usp, idx) => (
            <div
              key={idx}
              style={{
                padding: 14,
                background: colors.pageBg,
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.textMuted,
                  marginBottom: 8,
                  fontFamily: fonts.body,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Điểm mạnh {idx + 1}
              </div>
              <Input
                label="Tiêu đề"
                value={usp.title}
                onChange={(e) => updateUsp(idx, 'title', e.target.value)}
                placeholder="Nhập tiêu đề..."
              />
              <Textarea
                label="Mô tả"
                value={usp.description}
                onChange={(e) => updateUsp(idx, 'description', e.target.value)}
                placeholder="Nhập mô tả chi tiết..."
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button loading={saving} onClick={() => handleSave('Điểm mạnh')}>
            <Save size={14} />
            Lưu Điểm mạnh
          </Button>
        </div>
      </div>

      {/* Section 4: Featured Products */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={ShoppingBag} title="Sản phẩm nổi bật" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {products.map((product) => (
            <label
              key={product.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 8px',
                borderBottom: `1px solid ${colors.border}`,
                cursor: 'pointer',
                transition: transitions.fast,
                borderRadius: 4,
              }}
            >
              <div
                onClick={(e) => {
                  e.preventDefault();
                  toggleProduct(product.id);
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: product.checked
                    ? 'none'
                    : `2px solid ${colors.border}`,
                  background: product.checked
                    ? colors.primary
                    : colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: transitions.fast,
                }}
              >
                {product.checked && (
                  <CheckSquare size={14} color={colors.white} />
                )}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: colors.textPrimary,
                  fontFamily: fonts.body,
                }}
              >
                {product.name}
              </span>
            </label>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            loading={saving}
            onClick={() => handleSave('Sản phẩm nổi bật')}
          >
            <Save size={14} />
            Lưu Sản phẩm nổi bật
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

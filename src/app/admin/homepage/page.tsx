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
        \u00d7
      </button>
    </div>
  );
}

// ---- Default Data ----

const defaultHero: HeroData = {
  title: 'Gia C\u00f4ng Nha Khoa Chuy\u00ean Nghi\u1ec7p',
  subtitle:
    'Alpha Digital Center - \u0110\u1ed1i t\u00e1c gia c\u00f4ng nha khoa h\u00e0ng \u0111\u1ea7u v\u1edbi c\u00f4ng ngh\u1ec7 CAD/CAM ti\u00ean ti\u1ebfn, \u0111\u1ea3m b\u1ea3o ch\u1ea5t l\u01b0\u1ee3ng v\u01b0\u1ee3t tr\u1ed9i cho m\u1ecdi s\u1ea3n ph\u1ea9m.',
  badge: 'Digital Service For Lab',
  cta1Text: 'Xem s\u1ea3n ph\u1ea9m',
  cta1Link: '/products',
  cta2Text: 'Li\u00ean h\u1ec7 ngay',
  cta2Link: '/contact',
};

const defaultStats: StatItem[] = [
  { icon: 'Clock', value: '10+', label: 'N\u0103m kinh nghi\u1ec7m' },
  { icon: 'Users', value: '500+', label: 'Labo \u0111\u1ed1i t\u00e1c' },
  { icon: 'Package', value: '50,000+', label: 'S\u1ea3n ph\u1ea9m/n\u0103m' },
  { icon: 'ThumbsUp', value: '99%', label: 'H\u00e0i l\u00f2ng' },
];

const defaultUsps: UspItem[] = [
  {
    title: 'C\u00f4ng ngh\u1ec7 CAD/CAM',
    description:
      '\u1ee8ng d\u1ee5ng c\u00f4ng ngh\u1ec7 CAD/CAM ti\u00ean ti\u1ebfn nh\u1ea5t trong thi\u1ebft k\u1ebf v\u00e0 gia c\u00f4ng nha khoa, \u0111\u1ea3m b\u1ea3o \u0111\u1ed9 ch\u00ednh x\u00e1c tuy\u1ec7t \u0111\u1ed1i.',
  },
  {
    title: 'B\u1ea3o h\u00e0nh l\u00ean \u0111\u1ebfn 19 n\u0103m',
    description:
      'Cam k\u1ebft b\u1ea3o h\u00e0nh d\u00e0i h\u1ea1n cho t\u1ea5t c\u1ea3 s\u1ea3n ph\u1ea9m, th\u1ec3 hi\u1ec7n s\u1ef1 t\u1ef1 tin v\u00e0o ch\u1ea5t l\u01b0\u1ee3ng s\u1ea3n xu\u1ea5t.',
  },
  {
    title: 'V\u1eadt li\u1ec7u ch\u00ednh h\u00e3ng',
    description:
      'S\u1eed d\u1ee5ng 100% v\u1eadt li\u1ec7u ch\u00ednh h\u00e3ng t\u1eeb c\u00e1c th\u01b0\u01a1ng hi\u1ec7u h\u00e0ng \u0111\u1ea7u th\u1ebf gi\u1edbi nh\u01b0 Ivoclar, VITA, Kuraray.',
  },
];

const defaultProducts: FeaturedProduct[] = [
  { id: '1', name: 'R\u0103ng s\u1ee9 Zirconia Multilayer', checked: true },
  { id: '2', name: 'R\u0103ng s\u1ee9 E.max', checked: true },
  { id: '3', name: 'Kh\u00e1m h\u00e0m \u0111\u1ee3i', checked: false },
  { id: '4', name: 'M\u1eb7t d\u00e1n s\u1ee9 Veneer', checked: true },
  { id: '5', name: 'Inlay / Onlay', checked: false },
  { id: '6', name: 'Khung s\u01b0\u1eddn CoCr', checked: false },
  { id: '7', name: 'H\u00e0m kh\u00f4ng Titanium', checked: true },
  { id: '8', name: 'Nhi\u1ec7t l\u1ef1c h\u00e0m', checked: false },
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
      showToast(`\u0110\u00e3 l\u01b0u ${section} th\u00e0nh c\u00f4ng!`);
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
        <h1 style={pageTitle}>Qu\u1ea3n l\u00fd Trang ch\u1ee7</h1>
        <p style={pageSubtitle}>
          Ch\u1ec9nh s\u1eeda n\u1ed9i dung hi\u1ec3n th\u1ecb tr\u00ean trang ch\u1ee7 c\u1ee7a website
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
              label="Ti\u00eau \u0111\u1ec1 ch\u00ednh"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              placeholder="Nh\u1eadp ti\u00eau \u0111\u1ec1 ch\u00ednh..."
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Textarea
              label="M\u00f4 t\u1ea3 ph\u1ee5"
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              placeholder="Nh\u1eadp m\u00f4 t\u1ea3 ph\u1ee5..."
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
            L\u01b0u Hero
          </Button>
        </div>
      </div>

      {/* Section 2: Stats */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Star} title="Th\u1ed1ng k\u00ea" />

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
                Th\u1ed1ng k\u00ea {idx + 1}
              </div>
              <Input
                label="Icon"
                value={stat.icon}
                onChange={(e) => updateStat(idx, 'icon', e.target.value)}
                placeholder="T\u00ean icon (Clock, Users, Package...)"
              />
              <Input
                label="Gi\u00e1 tr\u1ecb"
                value={stat.value}
                onChange={(e) => updateStat(idx, 'value', e.target.value)}
                placeholder="VD: 10+"
              />
              <Input
                label="Nh\u00e3n"
                value={stat.label}
                onChange={(e) => updateStat(idx, 'label', e.target.value)}
                placeholder="VD: N\u0103m kinh nghi\u1ec7m"
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button loading={saving} onClick={() => handleSave('Th\u1ed1ng k\u00ea')}>
            <Save size={14} />
            L\u01b0u Th\u1ed1ng k\u00ea
          </Button>
        </div>
      </div>

      {/* Section 3: USPs */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Award} title="\u0110i\u1ec3m m\u1ea1nh" />

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
                \u0110i\u1ec3m m\u1ea1nh {idx + 1}
              </div>
              <Input
                label="Ti\u00eau \u0111\u1ec1"
                value={usp.title}
                onChange={(e) => updateUsp(idx, 'title', e.target.value)}
                placeholder="Nh\u1eadp ti\u00eau \u0111\u1ec1..."
              />
              <Textarea
                label="M\u00f4 t\u1ea3"
                value={usp.description}
                onChange={(e) => updateUsp(idx, 'description', e.target.value)}
                placeholder="Nh\u1eadp m\u00f4 t\u1ea3 chi ti\u1ebft..."
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button loading={saving} onClick={() => handleSave('\u0110i\u1ec3m m\u1ea1nh')}>
            <Save size={14} />
            L\u01b0u \u0110i\u1ec3m m\u1ea1nh
          </Button>
        </div>
      </div>

      {/* Section 4: Featured Products */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={ShoppingBag} title="S\u1ea3n ph\u1ea9m n\u1ed5i b\u1eadt" />

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
            onClick={() => handleSave('S\u1ea3n ph\u1ea9m n\u1ed5i b\u1eadt')}
          >
            <Save size={14} />
            L\u01b0u S\u1ea3n ph\u1ea9m n\u1ed5i b\u1eadt
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

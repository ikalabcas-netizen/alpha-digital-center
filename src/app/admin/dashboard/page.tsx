'use client';

import React from 'react';
import Link from 'next/link';
import {
  colors,
  fonts,
  cardStyle,
  primaryButton,
  secondaryButton,
  pageTitle,
  pageSubtitle,
  transitions,
} from '@/lib/styles';
import {
  Package,
  FileText,
  Users,
  Shield,
  Home,
  Info,
  Settings,
  Briefcase,
  Clock,
  Edit3,
  UserPlus,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

interface KpiCard {
  icon: React.ElementType;
  value: string;
  label: string;
  subtitle: string;
}

const kpiCards: KpiCard[] = [
  { icon: Package, value: '12', label: 'San pham', subtitle: 'danh muc' },
  { icon: FileText, value: '6', label: 'Bai viet', subtitle: 'da xuat ban' },
  { icon: Users, value: '24', label: 'Khach hang', subtitle: 'leads moi' },
  { icon: Shield, value: '156', label: 'Bao hanh', subtitle: 'phieu active' },
];

const kpiLabels = ['San pham', 'Bai viet', 'Khach hang', 'Bao hanh'];
const kpiDisplayLabels = [
  { title: 'San ph\u1ea9m', sub: 'danh m\u1ee5c' },
  { title: 'B\u00e0i vi\u1ebft', sub: '\u0111\u00e3 xu\u1ea5t b\u1ea3n' },
  { title: 'Kh\u00e1ch h\u00e0ng', sub: 'leads m\u1edbi' },
  { title: 'B\u1ea3o h\u00e0nh', sub: 'phi\u1ebfu active' },
];

interface Activity {
  icon: React.ElementType;
  text: string;
  time: string;
}

const recentActivities: Activity[] = [
  { icon: Edit3, text: 'C\u1eadp nh\u1eadt trang ch\u1ee7 - Hero section', time: '5 ph\u00fat tr\u01b0\u1edbc' },
  { icon: UserPlus, text: 'Lead m\u1edbi t\u1eeb form li\u00ean h\u1ec7 - Nha khoa ABC', time: '15 ph\u00fat tr\u01b0\u1edbc' },
  { icon: CheckCircle, text: 'Xu\u1ea5t b\u1ea3n b\u00e0i vi\u1ebft "C\u00f4ng ngh\u1ec7 CAD/CAM"', time: '1 gi\u1edd tr\u01b0\u1edbc' },
  { icon: Package, text: 'Th\u00eam s\u1ea3n ph\u1ea9m m\u1edbi - R\u0103ng s\u1ee9 Zirconia', time: '2 gi\u1edd tr\u01b0\u1edbc' },
  { icon: TrendingUp, text: 'Chi\u1ebfn d\u1ecbch Facebook Ads \u0111\u1ea1t 1,200 clicks', time: '3 gi\u1edd tr\u01b0\u1edbc' },
];

interface QuickAction {
  icon: React.ElementType;
  label: string;
  href: string;
}

const quickActions: QuickAction[] = [
  { icon: Home, label: 'Qu\u1ea3n l\u00fd Trang ch\u1ee7', href: '/admin/homepage' },
  { icon: Info, label: 'Qu\u1ea3n l\u00fd Gi\u1edbi thi\u1ec7u', href: '/admin/about' },
  { icon: Package, label: 'Qu\u1ea3n l\u00fd S\u1ea3n ph\u1ea9m', href: '/admin/products' },
  { icon: FileText, label: 'Qu\u1ea3n l\u00fd B\u00e0i vi\u1ebft', href: '/admin/blog' },
];

function getTodayString(): string {
  const now = new Date();
  const days = ['Ch\u1ee7 nh\u1eadt', 'Th\u1ee9 Hai', 'Th\u1ee9 Ba', 'Th\u1ee9 T\u01b0', 'Th\u1ee9 N\u0103m', 'Th\u1ee9 S\u00e1u', 'Th\u1ee9 B\u1ea3y'];
  const day = days[now.getDay()];
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${day}, ${dd}/${mm}/${yyyy}`;
}

export default function DashboardPage() {
  return (
    <div style={{ padding: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Dashboard</h1>
        <p style={pageSubtitle}>H\u00f4m nay: {getTodayString()}</p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                ...cardStyle,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: colors.primaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={colors.primary} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    fontFamily: fonts.heading,
                    lineHeight: 1.1,
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: colors.textSecondary,
                    fontFamily: fonts.body,
                  }}
                >
                  {kpiDisplayLabels[idx].title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: colors.textMuted,
                    fontFamily: fonts.body,
                  }}
                >
                  {kpiDisplayLabels[idx].sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom section: Activities + Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Recent Activities */}
        <div style={{ ...cardStyle, padding: '20px 22px' }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: colors.textPrimary,
              fontFamily: fonts.heading,
              margin: '0 0 16px 0',
            }}
          >
            Ho\u1ea1t \u0111\u1ed9ng g\u1ea7n \u0111\u00e2y
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom:
                      idx < recentActivities.length - 1
                        ? `1px solid ${colors.border}`
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: colors.primaryUltraLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} color={colors.primary} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: colors.textPrimary,
                        fontFamily: fonts.body,
                      }}
                    >
                      {activity.text}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      fontFamily: fonts.body,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ ...cardStyle, padding: '20px 22px' }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: colors.textPrimary,
              fontFamily: fonts.heading,
              margin: '0 0 16px 0',
            }}
          >
            Thao t\u00e1c nhanh
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.href}
                  style={{
                    ...secondaryButton,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 14px',
                    textDecoration: 'none',
                    borderRadius: 8,
                    transition: transitions.fast,
                    justifyContent: 'flex-start',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.textSecondary,
                  }}
                >
                  <Icon size={16} color={colors.primary} />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  { icon: Package, value: '12', label: 'Sản phẩm', subtitle: 'danh mục' },
  { icon: FileText, value: '6', label: 'Bài viết', subtitle: 'đã xuất bản' },
  { icon: Users, value: '24', label: 'Khách hàng', subtitle: 'leads mới' },
  { icon: Shield, value: '156', label: 'Bảo hành', subtitle: 'phiếu active' },
];

const kpiLabels = ['Sản phẩm', 'Bài viết', 'Khách hàng', 'Bảo hành'];
const kpiDisplayLabels = [
  { title: 'Sản phẩm', sub: 'danh mục' },
  { title: 'Bài viết', sub: 'đã xuất bản' },
  { title: 'Khách hàng', sub: 'leads mới' },
  { title: 'Bảo hành', sub: 'phiếu active' },
];

interface Activity {
  icon: React.ElementType;
  text: string;
  time: string;
}

const recentActivities: Activity[] = [
  { icon: Edit3, text: 'Cập nhật trang chủ - Hero section', time: '5 phút trước' },
  { icon: UserPlus, text: 'Lead mới từ form liên hệ - Nha khoa ABC', time: '15 phút trước' },
  { icon: CheckCircle, text: 'Xuất bản bài viết "Công nghệ CAD/CAM"', time: '1 giờ trước' },
  { icon: Package, text: 'Thêm sản phẩm mới - Răng sứ Zirconia', time: '2 giờ trước' },
  { icon: TrendingUp, text: 'Chiến dịch Facebook Ads đạt 1,200 clicks', time: '3 giờ trước' },
];

interface QuickAction {
  icon: React.ElementType;
  label: string;
  href: string;
}

const quickActions: QuickAction[] = [
  { icon: Home, label: 'Quản lý Trang chủ', href: '/admin/homepage' },
  { icon: Info, label: 'Quản lý Giới thiệu', href: '/admin/about' },
  { icon: Package, label: 'Quản lý Sản phẩm', href: '/admin/products' },
  { icon: FileText, label: 'Quản lý Bài viết', href: '/admin/blog' },
];

function getTodayString(): string {
  const now = new Date();
  const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
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
        <p style={pageSubtitle}>Hôm nay: {getTodayString()}</p>
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
            Hoạt động gần đây
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
            Thao tác nhanh
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

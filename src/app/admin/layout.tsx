'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ResponsiveShell, NavItem } from '@/components/layout/ResponsiveShell';
import {
  LayoutDashboard,
  Home,
  Package,
  FileText,
  Info,
  Shield,
  Users,
  Briefcase,
  Settings,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { colors, fonts } from '@/lib/styles';

const ADMIN_NAV: NavItem[] = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/homepage', icon: Home, label: 'Trang chủ' },
  { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { to: '/admin/blog', icon: FileText, label: 'Bài viết' },
  { to: '/admin/about', icon: Info, label: 'Giới thiệu' },
  { to: '/admin/warranties', icon: Shield, label: 'Bảo hành' },
  { to: '/admin/leads', icon: Users, label: 'Khách hàng' },
  { to: '/admin/recruitment', icon: Briefcase, label: 'Tuyển dụng' },
  { to: '/admin/settings', icon: Settings, label: 'Cài đặt' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Login page doesn't need the shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: fonts.body,
          color: colors.textMuted,
        }}
      >
        Đang tải...
      </div>
    );
  }

  // Not authenticated — redirect to login
  if (!session) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  return (
    <ResponsiveShell
      navItems={ADMIN_NAV}
      accentColor="#06b6d4"
      roleLabel={(session.user as any)?.role === 'super_admin' ? 'Super Admin' : 'Quản trị viên'}
    >
      {/* User info bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {session.user?.image && (
          <img
            src={session.user.image}
            alt=""
            style={{ width: 28, height: 28, borderRadius: '50%' }}
          />
        )}
        <span style={{ fontSize: 13, color: colors.textSecondary }}>
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            background: 'none',
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            fontSize: 12,
            color: colors.textMuted,
            cursor: 'pointer',
            fontFamily: fonts.body,
          }}
        >
          <LogOut size={12} /> Đăng xuất
        </button>
      </div>
      {children}
    </ResponsiveShell>
  );
}

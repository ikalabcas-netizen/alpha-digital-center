'use client';

import { useSession, signOut } from 'next-auth/react';
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
  UserCog,
  MessageSquareQuote,
} from 'lucide-react';
import { colors, fonts } from '@/lib/styles';

const ADMIN_NAV: NavItem[] = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/homepage', icon: Home, label: 'Trang chủ' },
  { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { to: '/admin/blog', icon: FileText, label: 'Bài viết' },
  { to: '/admin/about', icon: Info, label: 'Giới thiệu' },
  { to: '/admin/warranties', icon: Shield, label: 'Bảo hành' },
  { to: '/admin/leads', icon: Users, label: 'Khách hàng' },
  { to: '/admin/testimonials', icon: MessageSquareQuote, label: 'Ý kiến khách hàng' },
  { to: '/admin/recruitment', icon: Briefcase, label: 'Tuyển dụng' },
  { to: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  { to: '/admin/users', icon: UserCog, label: 'Hệ thống' },
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
      userName={session.user?.name || undefined}
      userEmail={session.user?.email || undefined}
      userImage={session.user?.image || undefined}
      onSignOut={() => signOut({ callbackUrl: '/admin/login' })}
    >
      {children}
    </ResponsiveShell>
  );
}

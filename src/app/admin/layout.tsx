'use client';

import { useEffect } from 'react';
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

const APPROVED_ROLES = ['super_admin', 'admin', 'editor'];
const AWAITING_ROLES = ['pending', 'viewer']; // viewer is deprecated — treat as pending
const EDITOR_BLOCKED_PREFIXES = ['/admin/settings', '/admin/users'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  const isLoginPage = pathname === '/admin/login';
  const isPendingPage = pathname === '/admin/pending';
  const editorBlocked = role === 'editor' && EDITOR_BLOCKED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (status !== 'authenticated' || !role) return;
    if (role === 'rejected') {
      signOut({ callbackUrl: '/admin/login?rejected=1' });
      return;
    }
    if (AWAITING_ROLES.includes(role) && !isPendingPage) {
      window.location.href = '/admin/pending';
      return;
    }
    if (APPROVED_ROLES.includes(role) && isPendingPage) {
      window.location.href = '/admin/dashboard';
      return;
    }
    if (editorBlocked) {
      window.location.href = '/admin/dashboard';
    }
  }, [status, role, isPendingPage, editorBlocked]);

  if (isLoginPage) {
    return <>{children}</>;
  }

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

  if (!session) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  if (AWAITING_ROLES.includes(role || '') || role === 'rejected') {
    if (isPendingPage) {
      return <>{children}</>;
    }
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
        Đang chuyển hướng...
      </div>
    );
  }

  if (editorBlocked) {
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
        Đang chuyển hướng...
      </div>
    );
  }

  const visibleNav =
    role === 'editor'
      ? ADMIN_NAV.filter((item) => !EDITOR_BLOCKED_PREFIXES.some((p) => item.to.startsWith(p)))
      : ADMIN_NAV;

  const roleLabel =
    role === 'super_admin' ? 'Super Admin' : role === 'editor' ? 'Biên tập viên' : 'Quản trị viên';

  return (
    <ResponsiveShell
      navItems={visibleNav}
      accentColor="#06b6d4"
      roleLabel={roleLabel}
      userName={session.user?.name || undefined}
      userEmail={session.user?.email || undefined}
      userImage={session.user?.image || undefined}
      onSignOut={() => signOut({ callbackUrl: '/admin/login' })}
    >
      {children}
    </ResponsiveShell>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ResponsiveShell, NavItem } from '@/components/layout/ResponsiveShell';
import { apiGet } from '@/lib/api-client';
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
  Tag,
  Phone,
} from 'lucide-react';
import { colors, fonts } from '@/lib/styles';

const ADMIN_NAV: NavItem[] = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/homepage', icon: Home, label: 'Trang chủ' },
  { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { to: '/admin/categories', icon: Tag, label: 'Danh mục SP' },
  { to: '/admin/blog', icon: FileText, label: 'Bài viết' },
  { to: '/admin/about', icon: Info, label: 'Giới thiệu' },
  { to: '/admin/warranties', icon: Shield, label: 'Bảo hành' },
  { to: '/admin/leads', icon: Users, label: 'Khách hàng' },
  { to: '/admin/testimonials', icon: MessageSquareQuote, label: 'Ý kiến khách hàng' },
  { to: '/admin/recruitment', icon: Briefcase, label: 'Tuyển dụng' },
  { to: '/admin/contact', icon: Phone, label: 'Liên hệ' },
  { to: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  { to: '/admin/users', icon: UserCog, label: 'Hệ thống' },
];

const APPROVED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;
const EDITOR_BLOCKED_PREFIXES = ['/admin/settings', '/admin/users'];

const ID_URL =
  (typeof window !== 'undefined' && (window as any).__ADC_ID_URL__) ||
  process.env.NEXT_PUBLIC_ID_URL ||
  '';

function redirectToId(path: string = '/') {
  if (typeof window === 'undefined') return;
  const target = ID_URL ? `${ID_URL.replace(/\/$/, '')}${path}` : path;
  window.location.href = target;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role as string | undefined;
  const isActive = Boolean((session?.user as any)?.isActive);

  const editorBlocked =
    role === 'EDITOR' && EDITOR_BLOCKED_PREFIXES.some((p) => pathname.startsWith(p));

  const [logoSrc, setLogoSrc] = useState<string | undefined>();

  useEffect(() => {
    if (status !== 'authenticated' || !role) return;
    if (role === 'REJECTED') {
      signOut({ callbackUrl: ID_URL ? `${ID_URL}/?rejected=1` : '/' });
      return;
    }
    // User exists but not yet approved → send to id.'s pending page.
    if (!isActive) {
      redirectToId('/pending');
      return;
    }
    if (editorBlocked) {
      window.location.href = '/admin/dashboard';
    }
  }, [status, role, isActive, editorBlocked]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    apiGet<any[]>('/api/admin/settings?group=general')
      .then((rows) => {
        const logo = rows.find((r: any) => r.key === 'site.logoUrl')?.value;
        if (logo) setLogoSrc(logo);
      })
      .catch(() => {});
  }, [status]);

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

  // No session → send to id.alphacenter.vn for login.
  if (!session) {
    if (typeof window !== 'undefined') {
      const callbackUrl = window.location.href;
      const target = ID_URL
        ? `${ID_URL.replace(/\/$/, '')}/?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : '/';
      window.location.href = target;
    }
    return null;
  }

  // Inactive or pending/rejected → holding screen while effect redirects.
  if (!isActive || !APPROVED_ROLES.includes(role as any)) {
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
    role === 'EDITOR'
      ? ADMIN_NAV.filter((item) => !EDITOR_BLOCKED_PREFIXES.some((p) => item.to.startsWith(p)))
      : ADMIN_NAV;

  const roleLabel =
    role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'EDITOR' ? 'Biên tập viên' : 'Quản trị viên';

  return (
    <ResponsiveShell
      navItems={visibleNav}
      accentColor="#06b6d4"
      roleLabel={roleLabel}
      logoSrc={logoSrc}
      userName={session.user?.name || undefined}
      userEmail={session.user?.email || undefined}
      userImage={session.user?.image || undefined}
      onSignOut={() =>
        signOut({ callbackUrl: ID_URL ? `${ID_URL}/?signedOut=1` : '/' })
      }
    >
      {children}
    </ResponsiveShell>
  );
}

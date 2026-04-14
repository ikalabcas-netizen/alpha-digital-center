'use client';

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
} from 'lucide-react';

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
  return (
    <ResponsiveShell
      navItems={ADMIN_NAV}
      accentColor="#06b6d4"
      roleLabel="Quản trị viên"
    >
      {children}
    </ResponsiveShell>
  );
}

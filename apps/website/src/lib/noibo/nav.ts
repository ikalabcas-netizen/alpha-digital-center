import {
  LayoutDashboard,
  User,
  Network,
  Clock,
  CalendarOff,
  ListChecks,
  Target,
  Users,
  Building2,
  Briefcase,
  CheckSquare,
  ClipboardList,
} from 'lucide-react';
import type { NavItem } from '@/components/layout/ResponsiveShell';
import type { HrRole } from '@/lib/noibo/auth';

// Nav cho NV thường (mọi role)
const EMPLOYEE_NAV: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { to: '/attendance', icon: Clock, label: 'Chấm công' },
  { to: '/leave', icon: CalendarOff, label: 'Nghỉ phép' },
  { to: '/profile', icon: User, label: 'Hồ sơ của tôi' },
  { to: '/org', icon: Network, label: 'Sơ đồ tổ chức' },
  // Phase sau:
  // { to: '/tasks', icon: ListChecks, label: 'Công việc' },
  // { to: '/kpi', icon: Target, label: 'KPI' },
];

// Nav thêm cho manager (duyệt nghỉ team)
const MANAGER_NAV: NavItem[] = [
  { to: '/manage/leave-approvals', icon: CheckSquare, label: 'Duyệt nghỉ phép' },
];

// Nav cho hr_admin / hr_manager — quản trị HR (URL /manage/* để tránh trùng /admin marketing)
const HR_ADMIN_NAV: NavItem[] = [
  { to: '/manage/employees', icon: Users, label: 'Nhân viên' },
  { to: '/manage/departments', icon: Building2, label: 'Phòng ban' },
  { to: '/manage/positions', icon: Briefcase, label: 'Chức vụ' },
  { to: '/manage/shifts', icon: Clock, label: 'Ca làm việc' },
  // Phase sau:
  // { to: '/manage/kpi-templates', icon: ClipboardList, label: 'Mẫu KPI' },
];

export function getNoiboNav(hrRole: HrRole | null): NavItem[] {
  const items = [...EMPLOYEE_NAV];
  if (hrRole === 'manager') {
    items.push(...MANAGER_NAV);
  }
  if (hrRole === 'hr_admin' || hrRole === 'hr_manager') {
    items.push(...MANAGER_NAV, ...HR_ADMIN_NAV);
  }
  return items;
}

export function getRoleLabel(hrRole: HrRole | null): string {
  switch (hrRole) {
    case 'hr_admin':
      return 'HR Admin';
    case 'hr_manager':
      return 'HR Manager';
    case 'manager':
      return 'Quản lý';
    case 'employee':
      return 'Nhân viên';
    default:
      return 'Chưa liên kết';
  }
}

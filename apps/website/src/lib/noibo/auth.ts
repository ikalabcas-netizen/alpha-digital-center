import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/api-auth';

// HR roles trên hrm_employees.hr_role
export const HR_ROLES = ['hr_admin', 'hr_manager', 'manager', 'employee'] as const;
export type HrRole = (typeof HR_ROLES)[number];

// Roles được coi là admin nội bộ (full quyền cấu hình HRM)
export const HR_ADMIN_ROLES: HrRole[] = ['hr_admin', 'hr_manager'];

// Roles có quyền duyệt task / nghỉ phép / KPI cho cấp dưới
export const HR_APPROVER_ROLES: HrRole[] = ['hr_admin', 'hr_manager', 'manager'];

export interface NoiboContext {
  session: any;
  userId: string;
  email: string;
  // Employee có thể null nếu user chưa được link với hrm_employees
  employee:
    | (Awaited<ReturnType<typeof loadEmployeeByUserId>>)
    | null;
}

async function loadEmployeeByUserId(userId: string) {
  return prisma.hrmEmployee.findUnique({
    where: { userId },
    include: {
      department: true,
      position: true,
      manager: { select: { id: true, fullName: true, workEmail: true } },
    },
  });
}

/**
 * Cho phép vào noibo. Tạm thời reuse session NextAuth hiện tại của /admin.
 * Khi id.alphacenter.vn xong → đổi cookie domain + redirect target,
 * helper này không cần đổi logic.
 *
 * Trả null nếu chưa đăng nhập. Trả NoiboContext kể cả khi chưa link Employee
 * (UI tự xử trạng thái "chưa liên kết — liên hệ HR").
 */
export async function requireNoibo(): Promise<NoiboContext | null> {
  const session = await getSession();
  if (!session?.user) return null;
  const userId = (session.user as any).id as string | undefined;
  const email = session.user.email as string | undefined;
  if (!userId || !email) return null;

  const employee = await loadEmployeeByUserId(userId);

  return { session, userId, email, employee };
}

/**
 * Yêu cầu user đã link Employee active. Dùng cho route cần employee context.
 */
export async function requireEmployee(): Promise<NoiboContext | null> {
  const ctx = await requireNoibo();
  if (!ctx?.employee) return null;
  if (ctx.employee.employmentStatus === 'terminated') return null;
  return ctx;
}

/**
 * Yêu cầu hr_role nằm trong allowedRoles. Dùng cho admin HR endpoints.
 */
export async function requireHrRole(
  allowedRoles: HrRole[]
): Promise<NoiboContext | null> {
  const ctx = await requireEmployee();
  if (!ctx) return null;
  const role = ctx.employee!.hrRole as HrRole;
  if (!allowedRoles.includes(role)) return null;
  return ctx;
}

export const requireHrAdmin = () => requireHrRole(HR_ADMIN_ROLES);
export const requireHrApprover = () => requireHrRole(HR_APPROVER_ROLES);

// Response helpers (alias để noibo routes khỏi import từ api-auth riêng)
export function noiboUnauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function noiboForbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 });
}

import { redirect } from 'next/navigation';
import { requireNoibo } from '@/lib/noibo/auth';
import { NoiboShell } from '@/components/noibo/NoiboShell';
import type { HrRole } from '@/lib/noibo/auth';

export default async function NoiboLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireNoibo();

  // Chưa đăng nhập → quay về login admin (tạm; sẽ đổi sang id.alphacenter.vn ở Phase cuối)
  if (!ctx) {
    redirect('/admin/login');
  }

  const employee = ctx.employee;
  const hrRole = (employee?.hrRole as HrRole | undefined) ?? null;

  return (
    <NoiboShell
      hrRole={hrRole}
      fullName={employee?.fullName}
      workEmail={employee?.workEmail}
      avatarUrl={employee?.avatarUrl ?? undefined}
    >
      {children}
    </NoiboShell>
  );
}

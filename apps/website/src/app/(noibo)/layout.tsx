import { redirect } from 'next/navigation';
import { requireNoibo } from '@/lib/noibo/auth';
import { NoiboShell } from '@/components/noibo/NoiboShell';
import type { HrRole } from '@/lib/noibo/auth';

export default async function NoiboLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireNoibo();

  // Middleware đã bảo vệ noibo routes (matcher + redirect về id.alphacenter.vn).
  // Đây là fallback nếu user có cookie hết hạn/không hợp lệ nhưng middleware
  // vẫn cho qua — đẩy về id để login lại.
  if (!ctx) {
    const idUrl = process.env.NEXT_PUBLIC_ID_URL;
    redirect(idUrl || '/');
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

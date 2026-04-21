import { auth } from "@adc/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { safeCallback } from "@/lib/redirect";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  const session = await auth();

  if (session?.user) {
    // Đã đăng nhập → vào dashboard. Nếu có callbackUrl, truyền qua ?from= để hiện banner.
    const from = callbackUrl ? safeCallback(callbackUrl) : null;
    const dashboardUrl = from
      ? `/dashboard?from=${encodeURIComponent(from)}`
      : "/dashboard";
    redirect(dashboardUrl);
  }

  // Chưa đăng nhập → hiện form login.
  // callbackUrl truyền cho LoginForm để sau Google OAuth redirect về đây rồi vào dashboard.
  return <LoginForm callbackUrl="/dashboard" error={error ?? null} />;
}

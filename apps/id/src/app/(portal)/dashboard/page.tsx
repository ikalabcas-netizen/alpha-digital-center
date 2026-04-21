import { auth } from "@adc/auth";
import { safeCallback } from "@/lib/redirect";
import { CallbackBanner } from "@/components/callback-banner";
import { AppLauncher } from "@/components/app-launcher";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const validatedFrom = safeCallback(from);

  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B1220]">
        Xin chào, {session.user.name}
      </h1>
      <CallbackBanner from={validatedFrom} />
      <AppLauncher role={session.user.role ?? ""} />
    </div>
  );
}

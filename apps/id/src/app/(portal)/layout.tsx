import { redirect } from "next/navigation";
import { auth } from "@adc/auth";
import { prisma } from "@adc/database";
import { DashboardShell } from "@/components/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, isActive: true, name: true, image: true },
  });

  if (!dbUser) redirect("/?error=AccessDenied");
  if (!dbUser.isActive) redirect("/pending");

  return (
    <DashboardShell
      user={{
        name: dbUser.name ?? session.user.email,
        email: session.user.email,
        image: dbUser.image,
        role: dbUser.role,
      }}
    >
      {children}
    </DashboardShell>
  );
}

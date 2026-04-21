import { auth } from "@adc/auth";
import { prisma } from "@adc/database";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/");
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;
  if (!session?.user || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    redirect("/");
  }
  return session;
}

export async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/");
  return user;
}

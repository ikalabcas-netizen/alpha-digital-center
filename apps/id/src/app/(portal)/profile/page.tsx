import { redirect } from "next/navigation";
import { auth } from "@adc/auth";
import { prisma } from "@adc/database";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user || !user.email) redirect("/");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B1220]">Hồ sơ cá nhân</h1>
      <ProfileForm user={{ ...user, email: user.email }} />
    </div>
  );
}

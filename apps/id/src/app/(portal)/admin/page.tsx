import { auth } from "@adc/auth";
import { prisma } from "@adc/database";
import { UsersTable } from "./users-table";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) return null;

  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  // Users without an email slip through the NextAuth flow; exclude them from the
  // admin table (they can't sign in anyway) and narrow the type for the client.
  const users = rows
    .filter((u): u is typeof u & { email: string } => u.email !== null)
    .map((u) => ({ ...u, email: u.email }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1220]">Quản lý người dùng</h1>
        <p className="text-sm text-[#475569] mt-1">{users.length} tài khoản</p>
      </div>
      <UsersTable
        users={users}
        currentUserId={session.user.id ?? ""}
        currentUserRole={session.user.role ?? ""}
      />
    </div>
  );
}

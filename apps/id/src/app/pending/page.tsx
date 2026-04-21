import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@adc/auth";
import { prisma } from "@adc/database";

export const dynamic = "force-dynamic";

export default async function PendingPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, image: true, role: true, isActive: true, createdAt: true },
  });
  if (!dbUser) redirect("/");

  // User đã active → không phải đất của /pending, chuyển về dashboard.
  if (dbUser.isActive) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-white to-[#FFF8E7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_10px_40px_-15px_rgba(11,18,32,0.15)] p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo.png"
              alt="Alpha Digital Center"
              width={72}
              height={72}
              className="rounded-xl"
              priority
            />
            <div className="text-center space-y-1.5">
              <h1 className="text-[22px] font-bold tracking-tight text-[#0B1220] leading-tight font-[family-name:var(--font-space-grotesk)]">
                Tài khoản đang chờ duyệt
              </h1>
              <p className="text-sm text-[#475569]">
                Super Admin sẽ xem xét và cấp quyền sớm nhất có thể.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#FFF8E7] border border-[#C9A961]/30 p-4 space-y-2">
            <div className="flex items-center gap-3">
              {dbUser.image ? (
                <img
                  src={dbUser.image}
                  alt={dbUser.name ?? ""}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#C9A961] text-white flex items-center justify-center text-sm font-bold">
                  {(dbUser.name ?? dbUser.email ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0B1220] truncate">
                  {dbUser.name ?? "Chưa đặt tên"}
                </p>
                <p className="text-xs text-[#475569] truncate">{dbUser.email}</p>
              </div>
            </div>
            <p className="text-xs text-[#475569]">
              Gửi lúc: {new Date(dbUser.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Nếu cần gấp, liên hệ trực tiếp Super Admin để được xử lý nhanh.
            </p>
            <Link
              href="/signout"
              className="inline-block mt-2 text-sm text-[#475569] hover:text-[#0B1220] underline-offset-4 hover:underline"
            >
              Đăng xuất
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

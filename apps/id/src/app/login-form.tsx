"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface LoginFormProps {
  callbackUrl: string;
  error: string | null;
}

export function LoginForm({ callbackUrl, error }: LoginFormProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    setLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-white to-[#FFF8E7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_10px_40px_-15px_rgba(11,18,32,0.15)] p-8 space-y-7">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo.png"
              alt="Alpha Digital Center"
              width={80}
              height={80}
              className="rounded-xl"
              priority
            />
            <div className="text-center space-y-1.5">
              <h1 className="text-[26px] font-bold tracking-tight text-[#0B1220] leading-tight font-[family-name:var(--font-space-grotesk)]">
                Alpha Digital Center ID
              </h1>
              <p className="text-sm text-[#475569]">
                Đăng nhập một lần, dùng cho toàn hệ thống
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errorMessage(error)}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-[#0B1220] shadow-sm transition-all hover:border-[#C9A961]/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A961]/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? "Đang chuyển hướng..." : "Đăng nhập với Google"}
          </button>

          <div className="pt-5 border-t border-gray-100 space-y-2 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              Tài khoản mới cần quản trị viên phê duyệt trước khi truy cập.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Alpha Digital Center — Premium Dental Lab
        </p>
      </div>
    </div>
  );
}

function errorMessage(code: string): string {
  switch (code) {
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return "Đăng nhập Google gặp sự cố. Vui lòng thử lại.";
    case "AccessDenied":
      return "Tài khoản chưa được cấp quyền truy cập.";
    case "Configuration":
      return "Cấu hình đăng nhập đang có lỗi. Liên hệ quản trị viên.";
    default:
      return "Đăng nhập không thành công. Vui lòng thử lại.";
  }
}

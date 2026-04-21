"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export function SignoutClient({ callbackUrl }: { callbackUrl: string }) {
  useEffect(() => {
    signOut({ callbackUrl, redirect: true });
  }, [callbackUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#C9A961]/30 border-t-[#C9A961] animate-spin" />
        <p className="text-sm text-[#475569]">Đang đăng xuất...</p>
      </div>
    </div>
  );
}

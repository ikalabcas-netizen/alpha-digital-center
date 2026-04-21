"use client";

import { useState } from "react";
import Image from "next/image";
import { ROLE_LABELS, ROLE_BADGE_COLORS } from "@/lib/constants";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
    createdAt: Date;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const initials = (user.name ?? user.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const roleBadge = ROLE_BADGE_COLORS[user.role] ?? "bg-gray-400 text-white";

  const joinedAt = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(user.createdAt));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Lưu thất bại");
      }
      setStatus("success");
      setMessage("Đã lưu thành công.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
      {/* Avatar section */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-[#FFF8E7] flex items-center justify-center ring-2 ring-[#C9A961]/20">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ""} fill className="object-cover" />
          ) : (
            <span className="text-2xl font-bold text-[#C9A961]">{initials}</span>
          )}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadge}`}>
          {roleLabel}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#0B1220]">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[#0B1220]">
            Họ và tên
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0B1220] outline-none focus:ring-2 focus:ring-[#C9A961]/30 focus:border-[#C9A961]/50 transition"
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#0B1220]">Vai trò</label>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadge}`}>
              {roleLabel}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#0B1220]">Ngày tham gia</label>
          <input
            type="text"
            value={joinedAt}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              status === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full rounded-full bg-[#C9A961] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e0002f] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}

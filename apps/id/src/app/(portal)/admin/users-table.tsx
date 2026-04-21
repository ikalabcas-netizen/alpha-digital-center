"use client";

import { useState } from "react";
import Image from "next/image";
import { ROLE_LABELS, ROLE_BADGE_COLORS } from "@/lib/constants";

const ALL_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "HR_MANAGER",
  "EMPLOYEE",
  "ACCOUNTANT",
  "SALES",
  "CUSTOMER",
  "PENDING",
  "REJECTED",
] as const;

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

interface UsersTableProps {
  users: User[];
  currentUserId: string;
  currentUserRole: string;
}

export function UsersTable({ users: initial, currentUserId, currentUserRole }: UsersTableProps) {
  const [users, setUsers] = useState(initial);

  const isAdmin = currentUserRole === "ADMIN";
  const availableRoles = isAdmin
    ? ALL_ROLES.filter((r) => r !== "SUPER_ADMIN")
    : ALL_ROLES;

  function isRowDisabled(user: User) {
    if (user.id === currentUserId) return true;
    if (isAdmin && user.role === "SUPER_ADMIN") return true;
    return false;
  }

  async function patchUser(userId: string, patch: { role?: string; isActive?: boolean }) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return;
    const updated: User = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updated } : u)));
  }

  const fmt = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-[#475569]">
              <th className="text-left px-4 py-3 font-medium">Người dùng</th>
              <th className="text-left px-4 py-3 font-medium">Vai trò</th>
              <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
              <th className="text-left px-4 py-3 font-medium">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const disabled = isRowDisabled(user);
              const initials = (user.name ?? user.email)
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Avatar + Name + Email */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#FFF8E7] flex items-center justify-center flex-shrink-0">
                        {user.image ? (
                          <Image src={user.image} alt={user.name ?? ""} fill className="object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-[#C9A961]">{initials}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#0B1220] leading-none">
                          {user.name ?? "(Chưa đặt tên)"}
                        </p>
                        <p className="text-xs text-[#475569] mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role select */}
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={disabled}
                      onChange={(e) => patchUser(user.id, { role: e.target.value })}
                      className={`rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-[#C9A961]/30 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        ROLE_BADGE_COLORS[user.role] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {availableRoles.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r] ?? r}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Active toggle */}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => patchUser(user.id, { isActive: !user.isActive })}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        user.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {user.isActive ? "Hoạt động" : "Vô hiệu"}
                    </button>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3 text-[#475569]">
                    {fmt.format(new Date(user.createdAt))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RoleBadge } from "./role-badge";

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
  };
  children: React.ReactNode;
}

const SIGNOUT_URL = `${process.env.NEXT_PUBLIC_ID_URL || ""}/signout`;

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Hồ sơ" },
    ...(isAdmin ? [{ href: "/admin", label: "Quản trị" }] : []),
  ];

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="Alpha Digital Center" width={32} height={32} />
            <span className="font-semibold text-ink font-[family-name:var(--font-space-grotesk)]">Alpha Center ID</span>
          </div>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6 flex-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "text-[#C9A961] font-medium text-sm"
                      : "text-gray-500 hover:text-gray-900 text-sm"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#C9A961] text-white flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-ink hidden sm:block">{user.name}</span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="mt-1.5">
                      <RoleBadge role={user.role} size="sm" />
                    </div>
                  </div>
                  <a
                    href={SIGNOUT_URL}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 mt-1"
                  >
                    Đăng xuất
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware edge-safe: chỉ check cookie, không import @adc/auth (Prisma không edge-compatible).
// Verify JWT + role thật sự ở (portal)/layout.tsx server component.

const SESSION_COOKIES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
];

export function middleware(req: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));

  if (!hasSession) {
    // Chưa đăng nhập → redirect về trang login
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/pending"],
};

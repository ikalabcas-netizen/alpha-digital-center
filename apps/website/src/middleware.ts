import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIES = [
  '__Secure-authjs.session-token',
  'authjs.session-token',
];

export function middleware(req: NextRequest) {
  // Admin surface requires an active session on id.alphacenter.vn — otherwise
  // redirect users there to log in, preserving where they wanted to go.
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
  if (hasSession) {
    return NextResponse.next();
  }

  const idUrl = process.env.NEXT_PUBLIC_ID_URL;
  if (idUrl) {
    // Reconstruct the public URL from forwarded headers — req.nextUrl reflects
    // the container's internal host (0.0.0.0:3000) behind Coolify's proxy.
    const host =
      req.headers.get('x-forwarded-host') ||
      req.headers.get('host') ||
      req.nextUrl.host;
    const proto =
      req.headers.get('x-forwarded-proto') ||
      (host.startsWith('localhost') ? 'http' : 'https');
    const publicCallback = `${proto}://${host}${req.nextUrl.pathname}${req.nextUrl.search}`;

    const target = new URL(idUrl);
    target.searchParams.set('callbackUrl', publicCallback);
    return NextResponse.redirect(target);
  }

  // Dev fallback: if no ID service is configured, deny with 401 rather than
  // looping back to a login page that no longer exists on this app.
  return new NextResponse('Authentication required — id.alphacenter.vn not configured', { status: 401 });
}

export const config = {
  // Bảo vệ cả admin marketing và surface nội bộ (noibo) — cả 2 đều redirect
  // về id.alphacenter.vn nếu chưa đăng nhập.
  matcher: [
    '/admin/:path*',
    '/dashboard',
    '/profile',
    '/org',
    '/attendance/:path*',
    '/leave',
    '/manage/:path*',
  ],
};

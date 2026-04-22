import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIES = [
  '__Secure-authjs.session-token',
  'authjs.session-token',
];

// Đường dẫn marketing công khai — KHÔNG yêu cầu session. Áp dụng trên apex/www.
// Trên noibo.*, các path này vẫn hoạt động nhưng middleware sẽ rewrite → /dashboard ở root.
const PUBLIC_PATHS_PREFIXES = ['/api/health', '/api/auth', '/api/log', '/_next', '/favicon', '/public'];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(req: NextRequest) {
  const host =
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host') ||
    req.nextUrl.host;
  const isNoibo = host.startsWith('noibo.');
  const { pathname } = req.nextUrl;

  // ─── Noibo subdomain routing ─────────────────────────────────────────
  if (isNoibo) {
    // noibo.alphacenter.vn/ → /dashboard (redirect để URL bar sạch)
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Chặn /admin trên subdomain nội bộ (admin marketing ở www)
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Các path nội bộ (dashboard, profile, attendance, leave, org, manage, api/noibo)
    // tiếp tục xử lý qua auth guard bên dưới.
  } else {
    // Trên www / apex: nếu request path là "/" thì serve marketing home (public),
    // không cần session → cho qua luôn.
    if (pathname === '/') {
      return NextResponse.next();
    }
  }

  // Public paths (health, api/auth callback, static) → bypass auth
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ─── Auth guard ──────────────────────────────────────────────────────
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
  if (hasSession) {
    return NextResponse.next();
  }

  const idUrl = process.env.NEXT_PUBLIC_ID_URL;
  if (idUrl) {
    // Reconstruct the public URL from forwarded headers — req.nextUrl reflects
    // the container's internal host (0.0.0.0:3000) behind Coolify's proxy.
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
  // Matcher rộng để bắt host=noibo.* trên mọi path. Exclude _next/static và public
  // assets để tránh overhead. Các path cần auth/redirect xử lý trong body theo host.
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|woff2?)$).*)',
  ],
};

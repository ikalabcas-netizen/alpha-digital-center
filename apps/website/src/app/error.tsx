'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Public pages error boundary (Next.js App Router convention).
 * Hiển thị khi server component / page throw uncaught error trong render.
 * Next.js tự gọi đây — KHÔNG cần post về /api/log vì server error đã log
 * từ withErrorLog hoặc Next.js default stderr.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[public error boundary]', error);
    try {
      const body = JSON.stringify({
        type: 'error',
        message: `[public error boundary] ${error.message || 'unknown'}`,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        stack: error.stack,
        extra: { digest: error.digest, boundary: 'public' },
      });
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        navigator.sendBeacon('/api/log', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
      }
    } catch {}
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div
        className="eyebrow"
        style={{ color: 'var(--gold-dark)', marginBottom: 12 }}
      >
        Lỗi · Something went wrong
      </div>
      <h1
        className="display"
        style={{ fontSize: 'clamp(28px, 3vw, 40px)', margin: '0 0 16px' }}
      >
        Có lỗi xảy ra.
      </h1>
      <p
        style={{
          fontSize: 15,
          color: 'var(--ink-500)',
          maxWidth: 520,
          lineHeight: 1.7,
          margin: '0 0 28px',
        }}
      >
        Chúng tôi đã ghi nhận sự cố. Vui lòng thử lại, hoặc quay về trang chủ.
        {error.digest && (
          <span
            className="mono"
            style={{ display: 'block', fontSize: 11, color: 'var(--ink-400)', marginTop: 12 }}
          >
            ID: {error.digest}
          </span>
        )}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 22px',
            borderRadius: 999,
            background: 'var(--gold)',
            color: '#fff',
            border: 'none',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Thử lại
        </button>
        <Link
          href="/"
          style={{
            padding: '12px 22px',
            borderRadius: 999,
            border: '1px solid var(--line)',
            color: 'var(--ink-900)',
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

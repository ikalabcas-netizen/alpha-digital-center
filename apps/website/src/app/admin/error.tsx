'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Admin pages error boundary. Giống public nhưng tông quản trị gọn gàng,
 * không cần layout phức tạp.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[admin error boundary]', error);
    try {
      const body = JSON.stringify({
        type: 'error',
        message: `[admin error boundary] ${error.message || 'unknown'}`,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        stack: error.stack,
        extra: { digest: error.digest, boundary: 'admin' },
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
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
        maxWidth: 600,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#9B7F3E',
        }}
      >
        Admin · Error
      </div>
      <h1 style={{ fontSize: 24, margin: 0, color: '#0E1726' }}>
        Trang admin gặp lỗi
      </h1>
      <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
        Lỗi đã được ghi vào log. Thử lại hoặc quay về dashboard.
        {error.digest && (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 11,
              color: '#94A3B8',
              marginTop: 8,
            }}
          >
            ID: {error.digest}
          </span>
        )}
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button
          onClick={reset}
          style={{
            padding: '9px 20px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #C9A961, #9B7F3E)',
            color: '#fff',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Thử lại
        </button>
        <Link
          href="/admin/dashboard"
          style={{
            padding: '9px 16px',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#334155',
            border: '1px solid #E5E9F0',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Về Dashboard
        </Link>
      </div>
    </div>
  );
}

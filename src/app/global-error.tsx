'use client';

import { useEffect } from 'react';

/**
 * Root-level error boundary. Catches crashes bên ngoài cả root layout
 * (ví dụ fonts load fail, Providers crash). Next.js convention:
 * global-error.tsx PHẢI render <html><body>.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[global error boundary]', error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          background: '#FAFBFC',
          color: '#0E1726',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <h1 style={{ fontSize: 32, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Hệ thống đang gặp sự cố.
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, margin: '0 0 24px' }}>
            Vui lòng tải lại trang. Nếu lỗi tiếp tục, liên hệ 0378 422 496.
          </p>
          <button
            onClick={() => (typeof window !== 'undefined' ? window.location.reload() : null)}
            style={{
              padding: '12px 22px',
              borderRadius: 999,
              background: '#C9A961',
              color: '#fff',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Tải lại trang
          </button>
          {error.digest && (
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: '#94A3B8',
                marginTop: 20,
              }}
            >
              ID: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}

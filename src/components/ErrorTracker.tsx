'use client';

import { useEffect } from 'react';

/**
 * Gắn global listeners cho:
 *  - window.onerror (uncaught JS errors)
 *  - window.onunhandledrejection (unhandled Promise rejections)
 *
 * POST tới /api/log bằng sendBeacon (nếu có) để không block page navigation.
 * Throttle đơn giản: tối đa 10 event trong 60s / tab.
 */

const THROTTLE_WINDOW_MS = 60_000;
const THROTTLE_MAX = 10;

type ClientPayload = {
  type: 'error' | 'unhandledrejection';
  message: string;
  source?: string;
  url?: string;
  userAgent?: string;
  stack?: string;
};

let sent = 0;
let windowStart = 0;

function send(payload: ClientPayload) {
  const now = Date.now();
  if (now - windowStart > THROTTLE_WINDOW_MS) {
    windowStart = now;
    sent = 0;
  }
  if (sent >= THROTTLE_MAX) return;
  sent++;

  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/log', blob);
      return;
    }
  } catch {
    // fall through to fetch
  }
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    /* swallow — avoid error loop */
  });
}

export function ErrorTracker() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      send({
        type: 'error',
        message: e.message,
        source: e.filename,
        url: window.location.href,
        userAgent: navigator.userAgent,
        stack: e.error?.stack,
      });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
            ? reason
            : JSON.stringify(reason);
      send({
        type: 'unhandledrejection',
        message,
        url: window.location.href,
        userAgent: navigator.userAgent,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}

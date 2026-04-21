"use client";

import { useState } from "react";

interface CallbackBannerProps {
  from: string | null;
}

export function CallbackBanner({ from }: CallbackBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!from || dismissed) return null;

  let hostname = from;
  try {
    hostname = new URL(from).hostname;
  } catch {
    // keep raw value if not a valid URL
  }

  return (
    <div className="flex items-center justify-between bg-brand/5 border border-brand/20 rounded-xl px-4 py-3 text-sm">
      <span className="text-ink-soft">
        Bạn được chuyển hướng từ <span className="font-medium text-ink">{hostname}</span>
      </span>
      <div className="flex items-center gap-3">
        <a href={from} className="text-[#C9A961] font-medium hover:underline">
          Tiếp tục →
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-ink-soft hover:text-ink leading-none"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

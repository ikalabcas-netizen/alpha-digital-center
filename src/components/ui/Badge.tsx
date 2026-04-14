'use client';

import React from 'react';
import { getBadgeStyle, statusMap, type StatusKey } from '@/lib/styles';

interface BadgeProps {
  status: StatusKey;
  style?: React.CSSProperties;
}

export function Badge({ status, style }: BadgeProps) {
  const config = statusMap[status];
  return (
    <span style={{ ...getBadgeStyle(status), ...style }}>
      {config.label}
    </span>
  );
}

interface CustomBadgeProps {
  label: string;
  bg: string;
  color: string;
  style?: React.CSSProperties;
}

export function CustomBadge({ label, bg, color, style }: CustomBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
        ...style,
      }}
    >
      {label}
    </span>
  );
}

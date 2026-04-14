'use client';

import React from 'react';
import { primaryButton, secondaryButton, dangerButton, transitions } from '@/lib/styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 12 },
  md: {},
  lg: { padding: '12px 28px', fontSize: 15 },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    variant === 'primary'
      ? primaryButton
      : variant === 'danger'
        ? dangerButton
        : secondaryButton;

  return (
    <button
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: transitions.fast,
        ...style,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
}

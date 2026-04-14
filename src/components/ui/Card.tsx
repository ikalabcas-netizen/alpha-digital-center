'use client';

import React from 'react';
import { cardStyle, glassmorphismCard } from '@/lib/styles';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, variant = 'default', style, onClick }: CardProps) {
  const base = variant === 'glass' ? glassmorphismCard : cardStyle;
  return (
    <div
      style={{ ...base, ...style }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
}

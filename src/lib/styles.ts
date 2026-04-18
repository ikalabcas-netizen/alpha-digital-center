// ADC Design System - Navy + Gold + Cyan accent
// Fonts are loaded via next/font (src/app/layout.tsx) and exposed as CSS vars.

import type { CSSProperties } from 'react';

export const colors = {
  // --- Brand: Navy + Gold ---
  navy950: '#050B15',
  navy900: '#0B1220',
  navy800: '#122033',
  navy700: '#1A2D47',
  navy: '#0B1220',
  navyDark: '#050B15',

  gold: '#C9A961',
  goldLight: '#E3CC8F',
  goldDark: '#9B7F3E',

  // --- Ink (text) ---
  textPrimary: '#0E1726',
  textSecondary: '#334155',
  textLight: '#64748B',
  textMuted: '#94A3B8',
  textSubtle: '#CBD5E1',
  ink900: '#0E1726',
  ink700: '#334155',
  ink500: '#64748B',
  ink400: '#94A3B8',
  ink300: '#CBD5E1',

  // --- Surfaces ---
  pageBg: '#FAFBFC',
  bgWarm: '#F6F4EE',
  cardBg: '#ffffff',
  border: '#E5E9F0',
  borderSoft: '#F1F4F8',
  borderCyan: 'rgba(6,182,212,0.2)',

  // Sidebar (admin) — keep navy gradient
  sidebarGradient: 'linear-gradient(180deg, #0B1220 0%, #122033 100%)',

  // --- Cyan accent (informational) — also kept as LEGACY "primary" keys ---
  primary: '#06B6D4',
  primaryHover: '#0891B2',
  primaryLight: '#67E8F9',
  primaryBg: '#CFFAFE',
  primaryUltraLight: '#ECFEFF',
  accent: '#06B6D4',
  accent600: '#0891B2',
  accent300: '#67E8F9',
  accent50: '#ECFEFF',

  white: '#ffffff',

  // --- Semantic ---
  success: '#16a34a',
  successBg: '#f0fdf4',
  warning: '#d97706',
  warningBg: '#fffbeb',
  danger: '#e11d48',
  dangerBg: '#fff1f2',
  info: '#2563eb',
  infoBg: '#eff6ff',

  // --- Role accents (admin) ---
  coordinator: '#06b6d4',
  sales: '#f59e0b',
  delivery: '#10b981',
  admin: '#8b5cf6',
  accounting: '#4f46e5',
} as const;

export const fonts = {
  body: 'var(--font-body), "Inter", sans-serif',
  heading: 'var(--font-display), "Space Grotesk", sans-serif',
  display: 'var(--font-display), "Space Grotesk", sans-serif',
  serif: 'var(--font-serif), "Playfair Display", serif',
  mono: 'var(--font-mono), "JetBrains Mono", monospace',
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  pill: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: '0 1px 3px rgba(10,22,40,0.04)',
  md: '0 8px 24px rgba(10,22,40,0.08)',
  lg: '0 20px 60px rgba(10,22,40,0.12)',
  xl: '0 30px 80px rgba(0,0,0,0.3)',
  button: '0 4px 16px rgba(201,169,97,0.25)',
  buttonCyan: '0 4px 16px rgba(6,182,212,0.3)',
} as const;

export const transitions = {
  fast: 'all 0.18s cubic-bezier(.4,0,.2,1)',
  medium: 'all 0.3s cubic-bezier(.4,0,.2,1)',
  slow: 'all 0.4s cubic-bezier(.4,0,.2,1)',
} as const;

// ---- Shared Style Objects (admin + public share) ----

export const cardStyle: CSSProperties = {
  background: colors.cardBg,
  borderRadius: radii.lg,
  border: `1px solid ${colors.border}`,
  padding: '14px 16px',
  boxShadow: shadows.sm,
};

export const glassmorphismCard: CSSProperties = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  border: `1px solid ${colors.borderCyan}`,
  boxShadow: shadows.lg,
  padding: '40px 36px 32px',
};

// Primary action — GOLD brand
export const primaryButton: CSSProperties = {
  padding: '10px 22px',
  background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
  color: colors.white,
  border: 'none',
  borderRadius: radii.md,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: fonts.body,
  boxShadow: shadows.button,
  transition: transitions.fast,
};

// Accent CTA — cyan (informational)
export const accentButton: CSSProperties = {
  padding: '10px 22px',
  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent600})`,
  color: colors.white,
  border: 'none',
  borderRadius: radii.md,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: fonts.body,
  boxShadow: shadows.buttonCyan,
  transition: transitions.fast,
};

// Dark action — navy
export const navyButton: CSSProperties = {
  padding: '10px 22px',
  background: colors.navy900,
  color: colors.white,
  border: 'none',
  borderRadius: radii.md,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: fonts.body,
  transition: transitions.fast,
};

export const secondaryButton: CSSProperties = {
  padding: '9px 16px',
  background: '#f8fafc',
  color: colors.textSecondary,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: fonts.body,
  transition: transitions.fast,
};

export const ghostButton: CSSProperties = {
  padding: '10px 18px',
  background: 'transparent',
  color: colors.ink900,
  border: `1px solid ${colors.border}`,
  borderRadius: 999,
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: fonts.body,
  transition: transitions.fast,
};

export const dangerButton: CSSProperties = {
  background: colors.dangerBg,
  color: colors.danger,
  border: '1px solid rgba(225,29,72,0.15)',
  borderRadius: radii.md,
  padding: '9px 14px',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: fonts.body,
  transition: transitions.fast,
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  fontSize: 13.5,
  fontFamily: fonts.body,
  color: colors.textPrimary,
  background: colors.white,
  outline: 'none',
  boxSizing: 'border-box',
};

export const pageHeader: CSSProperties = { marginBottom: 24 };

export const pageTitle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: colors.textPrimary,
  margin: 0,
  fontFamily: fonts.heading,
};

export const pageSubtitle: CSSProperties = {
  fontSize: 13,
  color: colors.textLight,
  marginTop: 4,
};

export const modalBackdrop: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(14,23,38,0.55)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: 16,
};

export const modalBox: CSSProperties = {
  background: 'rgba(255,255,255,0.96)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  padding: 28,
  width: '100%',
  maxWidth: 420,
  boxShadow: shadows.xl,
  border: `1px solid ${colors.border}`,
};

// Eyebrow (small mono uppercase label) — use className="eyebrow" in globals.css
export const eyebrowStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: colors.ink500,
};

// ---- Status & Role Badges ----

export const statusMap = {
  draft: { bg: '#f8fafc', color: '#94a3b8', label: 'Nháp' },
  scheduled: { bg: '#eff6ff', color: '#2563eb', label: 'Đã lên lịch' },
  published: { bg: '#f0fdf4', color: '#16a34a', label: 'Đã xuất bản' },
  new: { bg: '#ecfeff', color: '#0891b2', label: 'Mới' },
  contacted: { bg: '#eff6ff', color: '#2563eb', label: 'Đã liên hệ' },
  qualified: { bg: '#f3f0ff', color: '#7c3aed', label: 'Đủ điều kiện' },
  converted: { bg: '#f0fdf4', color: '#16a34a', label: 'Đã chuyển đổi' },
  active: { bg: '#f0fdf4', color: '#16a34a', label: 'Đang hoạt động' },
  inactive: { bg: '#f8fafc', color: '#94a3b8', label: 'Ngừng' },
  pending: { bg: '#fffbeb', color: '#d97706', label: 'Chờ duyệt' },
  rejected: { bg: '#fff1f2', color: '#e11d48', label: 'Từ chối' },
} as const;

export type StatusKey = keyof typeof statusMap;

export function getBadgeStyle(key: StatusKey): CSSProperties {
  const config = statusMap[key];
  return {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: radii.pill,
    fontSize: 12,
    fontWeight: 600,
    background: config.bg,
    color: config.color,
    fontFamily: fonts.body,
  };
}

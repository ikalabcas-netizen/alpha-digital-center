// ADC Design System - Design Tokens & Shared Styles
// Reference: skill/skill.md

export const colors = {
  // Primary (Cyan Palette)
  primary: '#06b6d4',
  primaryHover: '#0891b2',
  primaryLight: '#67e8f9',
  primaryBg: '#cffafe',
  primaryUltraLight: '#ecfeff',

  // Neutrals
  pageBg: '#eef2f5',
  cardBg: '#ffffff',
  border: '#e2e8f0',
  borderCyan: 'rgba(6,182,212,0.2)',

  // Sidebar
  sidebarGradient: 'linear-gradient(180deg, #0B1929 0%, #0F2847 100%)',

  // Text
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textLight: '#64748b',
  white: '#ffffff',

  // Semantic
  success: '#16a34a',
  successBg: '#f0fdf4',
  warning: '#d97706',
  warningBg: '#fffbeb',
  danger: '#e11d48',
  dangerBg: '#fff1f2',
  info: '#2563eb',
  infoBg: '#eff6ff',

  // Role accents
  coordinator: '#06b6d4',
  sales: '#f59e0b',
  delivery: '#10b981',
  admin: '#8b5cf6',
  accounting: '#4f46e5',
} as const;

export const fonts = {
  body: 'Inter, sans-serif',
  heading: 'Montserrat, sans-serif',
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.04)',
  md: '0 2px 8px rgba(6,182,212,0.12)',
  lg: '0 8px 40px rgba(6,182,212,0.12), 0 2px 8px rgba(0,0,0,0.06)',
  xl: '0 20px 60px rgba(0,0,0,0.15)',
  button: '0 2px 8px rgba(6,182,212,0.3)',
} as const;

export const transitions = {
  fast: 'all 0.15s ease',
  medium: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
  slow: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
} as const;

// ---- Shared Style Objects ----

export const cardStyle: React.CSSProperties = {
  background: colors.cardBg,
  borderRadius: radii.lg,
  border: `1px solid ${colors.border}`,
  padding: '14px 16px',
  boxShadow: shadows.sm,
};

export const glassmorphismCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  border: `1px solid ${colors.borderCyan}`,
  boxShadow: shadows.lg,
  padding: '40px 36px 32px',
};

export const primaryButton: React.CSSProperties = {
  padding: '9px 20px',
  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
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

export const secondaryButton: React.CSSProperties = {
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

export const dangerButton: React.CSSProperties = {
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

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  fontSize: 13,
  fontFamily: fonts.body,
  color: colors.textPrimary,
  background: colors.white,
  outline: 'none',
  boxSizing: 'border-box',
};

export const pageHeader: React.CSSProperties = {
  marginBottom: 24,
};

export const pageTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: colors.textPrimary,
  margin: 0,
  fontFamily: fonts.heading,
};

export const pageSubtitle: React.CSSProperties = {
  fontSize: 13,
  color: colors.textLight,
  marginTop: 4,
};

export const modalBackdrop: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.5)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: 16,
};

export const modalBox: React.CSSProperties = {
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  padding: 28,
  width: '100%',
  maxWidth: 420,
  boxShadow: shadows.xl,
  border: `1px solid rgba(6,182,212,0.15)`,
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

export function getBadgeStyle(key: StatusKey): React.CSSProperties {
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

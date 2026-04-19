'use client';

import { type CSSProperties } from 'react';
import { colors, fonts, radii, transitions } from '@/lib/styles';

type Tab = { key: string; label: string; count?: number };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
};

export function TabBar({ tabs, active, onChange }: Props) {
  const wrap: CSSProperties = {
    display: 'flex',
    gap: 4,
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: 20,
  };
  return (
    <div style={wrap}>
      {tabs.map((t) => {
        const on = t.key === active;
        const btn: CSSProperties = {
          background: 'transparent',
          border: 'none',
          padding: '10px 16px',
          fontSize: 13.5,
          fontWeight: on ? 700 : 500,
          color: on ? colors.navy900 : colors.textLight,
          cursor: 'pointer',
          fontFamily: fonts.body,
          borderBottom: on ? `2px solid ${colors.gold}` : '2px solid transparent',
          borderRadius: `${radii.sm}px ${radii.sm}px 0 0`,
          transition: transitions.fast,
          marginBottom: -1,
        };
        return (
          <button key={t.key} style={btn} onClick={() => onChange(t.key)}>
            {t.label}
            {typeof t.count === 'number' && (
              <span style={{ marginLeft: 6, fontSize: 12, color: colors.textMuted }}>
                ({t.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default TabBar;

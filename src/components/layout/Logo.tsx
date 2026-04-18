import { colors, fonts } from '@/lib/styles';

type LogoProps = {
  size?: number;
  variant?: 'light' | 'dark';
};

export function Logo({ size = 40, variant = 'light' }: LogoProps) {
  const dark = variant === 'dark';
  const strokeColor = dark ? colors.gold : colors.navy900;
  const pathFill = dark ? colors.goldLight : colors.navy900;
  const wordmarkColor = dark ? colors.white : colors.ink900;
  const eyebrowColor = dark ? 'rgba(255,255,255,0.5)' : colors.ink500;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="19" stroke={strokeColor} strokeWidth="1.2" />
        <path
          d="M 20 8 L 28 30 L 24 30 L 22 24 L 18 24 L 16 30 L 12 30 Z"
          fill={pathFill}
        />
        <circle cx="20" cy="20" r="2" fill={colors.gold} />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: size * 0.48,
            fontWeight: 600,
            color: wordmarkColor,
            letterSpacing: '-0.02em',
          }}
        >
          alpha<span style={{ color: colors.gold }}>.</span>
        </span>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: size * 0.22,
            letterSpacing: '0.2em',
            color: eyebrowColor,
            marginTop: 4,
            textTransform: 'uppercase',
          }}
        >
          Digital Center
        </span>
      </div>
    </div>
  );
}

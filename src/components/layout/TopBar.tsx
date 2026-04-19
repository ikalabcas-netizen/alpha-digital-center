import { colors, fonts } from '@/lib/styles';

type Props = {
  phone: string;
  email: string;
  address: string;
};

export function TopBar({ phone, email, address }: Props) {
  return (
    <div
      style={{
        background: colors.navy950,
        color: 'rgba(255,255,255,0.58)',
        fontSize: 12,
        padding: '8px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <span>📞 {phone}</span>
          <span>✉ {email}</span>
        </div>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <span>📍 {address}</span>
          <span
            style={{
              color: colors.goldLight,
              fontFamily: fonts.mono,
              letterSpacing: '0.1em',
              fontSize: 10,
            }}
          >
            EST. 2014
          </span>
        </div>
      </div>
    </div>
  );
}

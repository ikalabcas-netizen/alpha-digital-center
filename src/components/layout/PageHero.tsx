import { colors } from '@/lib/styles';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  serif?: string;
  tail?: string;
  subtitle?: string;
  image?: string;
};

export function PageHero({ eyebrow, title, serif, tail, subtitle, image }: PageHeroProps) {
  return (
    <section
      className="grain"
      style={{
        background: `linear-gradient(180deg, ${colors.navy900}, ${colors.navy800})`,
        color: '#fff',
        padding: '88px 0 96px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: -180,
          top: -120,
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,97,0.1)',
        }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="hg"
          style={{
            display: 'grid',
            gridTemplateColumns: image ? '1.2fr 1fr' : '1fr',
            gap: 72,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ width: 28, height: 1, background: colors.gold }} />
              <span className="eyebrow" style={{ color: colors.goldLight }}>
                {eyebrow}
              </span>
            </div>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(36px, 4.5vw, 62px)',
                margin: 0,
                fontWeight: 500,
                color: '#fff',
              }}
            >
              {title}
              {serif && (
                <>
                  {' '}
                  <span className="serif" style={{ color: colors.goldLight, fontWeight: 400 }}>
                    {serif}
                  </span>
                </>
              )}
              {tail && ` ${tail}`}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.65)',
                  margin: '28px 0 0',
                  maxWidth: 560,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {image && (
            <div
              style={{
                height: 360,
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .hg { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

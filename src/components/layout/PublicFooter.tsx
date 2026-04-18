import Link from 'next/link';
import { Logo } from './Logo';
import { PUBLIC_NAV } from './publicNav';
import { colors, fonts } from '@/lib/styles';

const SERVICES = [
  'Sứ Zirconia',
  'Sứ ép E.max',
  'Implant Abutment',
  'Veneer thẩm mỹ',
  'Hàm tháo lắp',
];

export function PublicFooter() {
  return (
    <footer
      className="grain"
      style={{
        background: `linear-gradient(180deg, ${colors.navy900}, ${colors.navy950})`,
        color: 'rgba(255,255,255,0.72)',
        padding: '80px 0 32px',
      }}
    >
      <div className="container">
        <div
          className="fg"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
            gap: 56,
            paddingBottom: 56,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div>
            <Logo variant="dark" size={44} />
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.7,
                marginTop: 24,
                maxWidth: 320,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Trung tâm gia công nha khoa kỹ thuật số hàng đầu Việt Nam. Cam kết chất lượng — bảo hành đến 19 năm — công nghệ CAD/CAM hiện đại.
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ color: colors.goldLight, marginBottom: 20 }}>
              Khám phá
            </div>
            {PUBLIC_NAV.slice(0, 5).map((r) => (
              <Link
                key={r.href}
                href={r.href}
                style={{
                  display: 'block',
                  padding: '7px 0',
                  fontSize: 13.5,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {r.label}
              </Link>
            ))}
          </div>

          <div>
            <div className="eyebrow" style={{ color: colors.goldLight, marginBottom: 20 }}>
              Dịch vụ
            </div>
            {SERVICES.map((s) => (
              <Link
                key={s}
                href="/san-pham"
                style={{
                  display: 'block',
                  padding: '7px 0',
                  fontSize: 13.5,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {s}
              </Link>
            ))}
          </div>

          <div>
            <div className="eyebrow" style={{ color: colors.goldLight, marginBottom: 20 }}>
              Liên hệ
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
              <div>📍 242/12 Phạm Văn Hai,<br />P.5, Q. Tân Bình, TP.HCM</div>
              <div style={{ marginTop: 10 }}>📞 0378 422 496</div>
              <div style={{ marginTop: 10 }}>✉ info@alphacenter.vn</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 32,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: fonts.mono,
              letterSpacing: '0.05em',
            }}
          >
            © {new Date().getFullYear()} ALPHA DIGITAL CENTER · ALL RIGHTS RESERVED
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            <span>Chính sách bảo mật</span>
            <span>Điều khoản</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .fg { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 560px) {
          .fg { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

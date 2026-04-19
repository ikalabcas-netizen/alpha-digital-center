import { PageHero } from '@/components/layout/PageHero';
import { prisma } from '@/lib/prisma';
import { ContactForm } from './ContactForm';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getData() {
  const [hero, channels, settings] = await Promise.all([
    prisma.cmsPageHero.findUnique({ where: { pageSlug: 'contact' } }),
    prisma.cmsContactChannel.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    prisma.siteSetting.findMany({ where: { group: 'contact' } }),
  ]);
  const map: Record<string, string> = {};
  settings.forEach((s) => (map[s.key] = s.value));
  return {
    hero,
    channels,
    addrLine1: map['contact.officeAddressLine1'] || '242/12 Phạm Văn Hai',
    addrLine2: map['contact.officeAddressLine2'] || 'Phường 5, Quận Tân Bình, TP.HCM',
    mapButton1Url: map['contact.mapButton1Url'] || '#',
    mapButton2Url: map['contact.mapButton2Url'] || '#',
  };
}

export default async function LienHePage() {
  const { hero, channels, addrLine1, addrLine2, mapButton1Url, mapButton2Url } = await getData();

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Contact · Liên hệ'}
        title={hero?.titleLead || 'Hãy'}
        serif={hero?.titleAccent || 'trò chuyện'}
        tail={hero?.titleTail || 'với chúng tôi.'}
        subtitle={hero?.subtitle || ''}
      />

      {/* Contact + Form */}
      <section style={{ padding: '120px 0', background: 'var(--bg)' }}>
        <div className="container ct" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 80 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Kênh liên hệ</span>
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 42px)', margin: '0 0 28px' }}>
              Luôn sẵn sàng{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                hỗ trợ
              </span>{' '}
              bạn.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-500)', lineHeight: 1.75, marginBottom: 40 }}>
              Đội ngũ kinh doanh và kỹ thuật của Alpha luôn sẵn sàng tư vấn — từ câu hỏi kỹ thuật đến báo giá nhanh.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {channels.map((c) => (
                <div
                  key={c.id}
                  style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 20, padding: '16px 0', borderTop: '1px solid var(--line)', alignItems: 'center' }}
                >
                  <div className="eyebrow" style={{ fontSize: 11 }}>
                    {c.label}
                  </div>
                  <div>
                    <div className="display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>
                      {c.value}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{c.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: 48, boxShadow: 'var(--sh-md)' }}>
            <ContactForm />
          </div>
        </div>
        <style>{`@media (max-width:900px){ .ct { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
      </section>

      {/* Map */}
      <section style={{ padding: '0 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          <div
            className="mw"
            style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 420 }}
          >
            <div style={{ padding: 48, background: 'var(--navy-900)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  Văn phòng
                </span>
              </div>
              <h3 className="display" style={{ fontSize: 28, margin: '0 0 16px', color: '#fff', fontWeight: 500 }}>
                {addrLine1}
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
                {addrLine2}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                <a
                  href={mapButton1Url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ padding: '12px 20px', borderRadius: 999, background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600 }}
                >
                  Xem Google Maps
                </a>
                <a
                  href={mapButton2Url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ padding: '12px 20px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13.5, fontWeight: 600 }}
                >
                  Chỉ đường
                </a>
              </div>
            </div>
            <div style={{ position: 'relative', background: '#E6EAF0' }}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 600 420"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: 'absolute', inset: 0 }}
              >
                <rect width="600" height="420" fill="#E6EAF0" />
                <g stroke="#CCD4DE" strokeWidth="1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line key={'h' + i} x1="0" y1={i * 40} x2="600" y2={i * 40} />
                  ))}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line key={'v' + i} x1={i * 40} y1="0" x2={i * 40} y2="420" />
                  ))}
                </g>
                <path d="M 0 220 Q 200 200 400 240 T 600 220" stroke="#C9A961" strokeWidth="6" fill="none" opacity="0.5" />
                <path d="M 300 0 L 320 420" stroke="#B8C2D4" strokeWidth="4" />
                <circle cx="310" cy="210" r="32" fill="#06B6D4" opacity="0.15" />
                <circle cx="310" cy="210" r="16" fill="#06B6D4" opacity="0.3" />
                <circle cx="310" cy="210" r="8" fill="#06B6D4" />
                <circle cx="310" cy="210" r="3" fill="#fff" />
              </svg>
              <div
                style={{ position: 'absolute', top: 24, right: 24, padding: '10px 14px', background: '#fff', borderRadius: 8, boxShadow: 'var(--sh-md)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                Alpha Digital Center
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .mw { grid-template-columns: 1fr !important; } .mw > div:last-child { min-height: 280px; } }`}</style>
      </section>
    </>
  );
}

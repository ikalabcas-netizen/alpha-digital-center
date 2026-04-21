/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getData() {
  const [hero, techCards, materials, testimonials, settings] = await Promise.all([
    prisma.cmsPageHero.findUnique({ where: { pageSlug: 'home' } }),
    prisma.cmsTechCard.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' }, take: 6 }),
    prisma.cmsMaterial.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' }, take: 6 }),
    prisma.testimonial.findMany({
      where: { isFeatured: true, isApproved: true },
      orderBy: { displayOrder: 'asc' },
      take: 3,
    }),
    prisma.siteSetting.findMany({ where: { group: 'stats' } }),
  ]);
  const stats: Record<string, string> = {};
  settings.forEach((s) => {
    stats[s.key] = s.value;
  });
  return { hero, techCards, materials, testimonials, stats };
}

export default async function HomePage() {
  const { hero, techCards, materials, testimonials, stats } = await getData();

  return (
    <>
      {/* Hero */}
      <section
        className="grain"
        style={{
          background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))',
          color: '#fff',
          padding: '88px 0 120px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', right: -180, top: -120, width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(201,169,97,0.12)' }} />
        <div aria-hidden style={{ position: 'absolute', right: -80, top: -40, width: 420, height: 420, borderRadius: '50%', border: '1px solid rgba(103,232,249,0.08)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="ha" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <span style={{ width: 36, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  {hero?.eyebrow || 'Digital dental laboratory · Est. 2020'}
                </span>
              </div>
              <h1 className="display" style={{ fontSize: 'clamp(42px, 5.4vw, 72px)', margin: 0, color: '#fff', fontWeight: 500 }}>
                {hero?.titleLead || 'Nơi tinh hoa'} <br />
                <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                  {hero?.titleAccent || 'nha khoa'}
                </span>{' '}
                {hero?.titleTail || 'kỹ thuật số được kiến tạo.'}
              </h1>
              {hero?.subtitle && (
                <p style={{ fontSize: 16.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.68)', margin: '32px 0 40px', maxWidth: 520 }}>
                  {hero.subtitle}
                </p>
              )}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/san-pham"
                  style={{ padding: '15px 28px', borderRadius: 999, background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  Khám phá sản phẩm →
                </Link>
                <Link
                  href="/lien-he"
                  style={{ padding: '15px 28px', borderRadius: 999, background: 'var(--gold)', color: '#fff', fontSize: 13.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}
                >
                  Yêu cầu báo giá
                </Link>
              </div>
              <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {[
                  { n: stats['stats.years'] || '12+', l: 'Năm kinh nghiệm' },
                  { n: stats['stats.labs'] || '500+', l: 'Labo đối tác' },
                  { n: stats['stats.warrantyMax'] || '19 năm', l: 'Bảo hành tối đa' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="display" style={{ fontSize: 28, color: 'var(--gold-light)', fontWeight: 500 }}>
                      {s.n}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', height: 580 }}>
              {hero?.imageUrl && (
                <div
                  style={{ position: 'absolute', top: 0, right: 0, width: '78%', height: 380, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}
                >
                  <img src={hero.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              {techCards[0]?.imageUrl && (
                <div
                  style={{ position: 'absolute', bottom: 0, left: 0, width: '55%', height: 280, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid rgba(201,169,97,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}
                >
                  <img src={techCards[0].imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div
                style={{ position: 'absolute', right: 20, bottom: 90, padding: '18px 22px', background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,169,97,0.35)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--gold-light)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>ISO 13485</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 2 }}>Certified Medical Device</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .ha { grid-template-columns: 1fr !important; gap: 40px !important; } .ha > div:nth-child(2) { height: 420px !important; } }`}</style>
      </section>

      {/* Technology */}
      {techCards.length > 0 && (
        <section style={{ padding: '120px 0', background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ marginBottom: 56, maxWidth: 720 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
                <span className="eyebrow">Công nghệ · Technology</span>
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', margin: 0 }}>
                Máy móc hàng đầu,{' '}
                <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                  độ chính xác tuyệt đối.
                </span>
              </h2>
            </div>
            <div className="tg" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(techCards.length, 3)}, 1fr)`, gap: 24 }}>
              {techCards.map((it) => (
                <article
                  key={it.id}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-lg)',
                    boxShadow: 'var(--sh-sm)',
                    padding: 0,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                    <img src={it.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div
                      style={{ position: 'absolute', top: 16, left: 16, padding: '5px 10px', background: 'rgba(10,22,40,0.75)', backdropFilter: 'blur(10px)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', borderRadius: 4 }}
                    >
                      {it.tag} · {it.meta}
                    </div>
                  </div>
                  <div style={{ padding: 28 }}>
                    <h3 className="display" style={{ fontSize: 20, margin: '0 0 10px', fontWeight: 600 }}>
                      {it.title}
                    </h3>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.7, margin: 0 }}>
                      {it.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <style>{`@media (max-width:900px){ .tg { grid-template-columns: 1fr !important; } }`}</style>
        </section>
      )}

      {/* Materials */}
      {materials.length > 0 && (
        <section
          className="grain"
          style={{ padding: '120px 0', background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))', color: '#fff' }}
        >
          <div className="container">
            <div className="mg" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                  <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                    Materials · Vật liệu
                  </span>
                </div>
                <h2 className="display" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', margin: '0 0 24px', color: '#fff' }}>
                  Phôi chính hãng{' '}
                  <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                    từ các thương hiệu danh tiếng
                  </span>{' '}
                  thế giới.
                </h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
                  Chúng tôi không đánh đổi chất lượng để lấy giá rẻ. Tất cả phôi Zirconia, sứ ép, kim loại đều nhập khẩu chính ngạch — có Certificate of Origin và lô sản xuất truy xuất được.
                </p>
              </div>
              <div>
                {materials.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr auto',
                      gap: 24,
                      padding: '28px 0',
                      borderTop: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(201,169,97,0.7)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="display" style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                        {p.material} · {p.country}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.45)' }}>
                      {p.sinceYear}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <style>{`@media (max-width:900px){ .mg { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section style={{ padding: '120px 0', background: 'var(--bg-warm)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-dark)' }}>
                  Khách hàng nói
                </span>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', margin: 0 }}>
                Tin tưởng từ{' '}
                <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                  500+ labo
                </span>{' '}
                đối tác.
              </h2>
            </div>
            <div className="tg" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(testimonials.length, 3)}, 1fr)`, gap: 24 }}>
              {testimonials.map((t) => (
                <figure
                  key={t.id}
                  style={{
                    padding: 36,
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-lg)',
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 64, color: 'var(--gold)', lineHeight: 0.5, fontStyle: 'italic' }}>
                    &ldquo;
                  </div>
                  <blockquote style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-700)', flex: 1 }}>
                    {t.contentVi}
                  </blockquote>
                  <div style={{ paddingTop: 20, borderTop: '1px solid var(--line-soft)' }}>
                    <div className="display" style={{ fontSize: 15, fontWeight: 600 }}>
                      {t.contactPerson || t.labName}
                    </div>
                    {t.contactPerson && (
                      <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>{t.labName}</div>
                    )}
                  </div>
                </figure>
              ))}
            </div>
          </div>
          <style>{`@media (max-width:900px){ .tg { grid-template-columns: 1fr !important; } }`}</style>
        </section>
      )}
    </>
  );
}

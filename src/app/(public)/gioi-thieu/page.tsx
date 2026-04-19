/* eslint-disable @next/next/no-img-element */
import { PageHero } from '@/components/layout/PageHero';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getData() {
  const [hero, story, values, timeline] = await Promise.all([
    prisma.cmsPageHero.findUnique({ where: { pageSlug: 'about' } }),
    prisma.cmsStoryBlock.findUnique({ where: { pageSlug: 'about' } }),
    prisma.cmsCoreValue.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.cmsTimelineEntry.findMany({ orderBy: { displayOrder: 'asc' } }),
  ]);
  return { hero, story, values, timeline };
}

export default async function GioiThieuPage() {
  const { hero, story, values, timeline } = await getData();

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'About us · Về chúng tôi'}
        title={hero?.titleLead || 'Hơn một'}
        serif={hero?.titleAccent || ''}
        tail={hero?.titleTail || ''}
        subtitle={hero?.subtitle || ''}
        image={hero?.imageUrl || undefined}
      />

      {/* Story */}
      {story && (
        <section style={{ padding: '120px 0', background: 'var(--bg)' }}>
          <div className="container sg" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
            <div style={{ position: 'relative', height: 520 }}>
              {story.imageUrl1 && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: 330, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--line)' }}>
                  <img src={story.imageUrl1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              {story.imageUrl2 && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '65%', height: 290, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-lg)' }}>
                  <img src={story.imageUrl2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ position: 'absolute', top: 260, right: 20, padding: 20, background: '#fff', border: '1px solid var(--line)', borderRadius: 12, boxShadow: 'var(--sh-lg)' }}>
                <div className="display" style={{ fontSize: 36, color: 'var(--accent)', fontWeight: 500 }}>
                  {story.foundedYear || '2014'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
                  FOUNDED
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
                <span className="eyebrow">Câu chuyện</span>
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', margin: '0 0 24px' }}>
                Khởi nghiệp từ{' '}
                <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                  một phòng lab nhỏ
                </span>
                , vươn ra thị trường cả nước.
              </h2>
              <div style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--ink-700)' }}>
                <p>{story.paragraph1}</p>
                <p>{story.paragraph2}</p>
              </div>
            </div>
          </div>
          <style>{`@media (max-width:900px){ .sg { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
        </section>
      )}

      {/* Values */}
      {values.length > 0 && (
        <section
          className="grain"
          style={{ padding: '120px 0', color: '#fff', background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))' }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  Giá trị cốt lõi
                </span>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', margin: 0, color: '#fff' }}>
                Bốn chữ{' '}
                <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                  &quot;Chính&quot;
                </span>{' '}
                làm nền móng.
              </h2>
            </div>
            <div className="vg" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(values.length, 4)}, 1fr)` }}>
              {values.map((v, i) => (
                <div
                  key={v.id}
                  style={{
                    padding: '36px 32px',
                    borderRight: i < values.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold-light)', letterSpacing: '0.15em', marginBottom: 16 }}>
                    {v.number}
                  </div>
                  <h3 className="display" style={{ fontSize: 22, margin: '0 0 12px', fontWeight: 500 }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0 }}>
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <style>{`@media (max-width:900px){ .vg { grid-template-columns: 1fr 1fr !important; } .vg > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); } } @media (max-width:560px){ .vg { grid-template-columns: 1fr !important; } }`}</style>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section style={{ padding: '120px 0', background: 'var(--bg-warm)' }}>
          <div className="container">
            <div style={{ maxWidth: 720, marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
                <span className="eyebrow">Dấu mốc</span>
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', margin: 0 }}>
                Hành trình{' '}
                <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                  không ngừng
                </span>{' '}
                nâng tầm.
              </h2>
            </div>
            <div style={{ position: 'relative', paddingLeft: 40 }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 11, width: 1, background: 'var(--line)' }} />
              {timeline.map((e, i) => {
                const last = i === timeline.length - 1;
                return (
                  <div
                    key={e.id}
                    style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1.2fr', gap: 32, paddingBottom: 40, position: 'relative', alignItems: 'flex-start' }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: -35,
                        top: 6,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#fff',
                        border: `2px solid ${last ? 'var(--gold)' : 'var(--accent)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{ width: 8, height: 8, borderRadius: '50%', background: last ? 'var(--gold)' : 'var(--accent)' }}
                      />
                    </div>
                    <div className="display" style={{ fontSize: 30, fontWeight: 500 }}>
                      {e.year}
                    </div>
                    <h3 className="display" style={{ fontSize: 18, margin: 0, fontWeight: 600 }}>
                      {e.title}
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.7, margin: 0 }}>
                      {e.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

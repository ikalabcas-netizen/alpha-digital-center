import { PageHero } from '@/components/layout/PageHero';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getData() {
  const [hero, jobs, perks] = await Promise.all([
    prisma.cmsPageHero.findUnique({ where: { pageSlug: 'careers' } }),
    prisma.jobPosting.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
    prisma.cmsJobPerk.findMany({ orderBy: { displayOrder: 'asc' } }),
  ]);
  return { hero, jobs, perks };
}

export default async function TuyenDungPage() {
  const { hero, jobs, perks } = await getData();

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Careers · Tuyển dụng'}
        title={hero?.titleLead || 'Cùng xây dựng'}
        serif={hero?.titleAccent || 'tương lai'}
        tail={hero?.titleTail || 'nha khoa số.'}
        subtitle={hero?.subtitle || ''}
        image={hero?.imageUrl || undefined}
      />

      {/* Jobs */}
      <section style={{ padding: '88px 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Vị trí đang tuyển</span>
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 42px)', margin: 0 }}>
              {jobs.length} vị trí{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                chờ bạn
              </span>
              .
            </h2>
          </div>
          {jobs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>
              Hiện tại chưa có vị trí nào đang tuyển. Vui lòng quay lại sau!
            </div>
          ) : (
            <div>
              {jobs.map((j, i) => (
                <a
                  key={j.id}
                  href={`/tuyen-dung/${j.slug}`}
                  className="jr"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 180px 160px 40px',
                    gap: 24,
                    alignItems: 'center',
                    padding: '26px 0',
                    borderTop: '1px solid var(--line)',
                    borderBottom: i === jobs.length - 1 ? '1px solid var(--line)' : 'none',
                    color: 'var(--ink-900)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  <div className="eyebrow" style={{ fontSize: 11 }}>
                    {j.department || '—'}
                  </div>
                  <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>
                    {j.titleVi}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>
                    📍 {j.location} · {j.employmentType || 'Toàn thời gian'}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--accent-600)', fontWeight: 600 }}>
                    {j.salaryRange || 'Thỏa thuận'}
                  </div>
                  <div style={{ textAlign: 'right', color: 'var(--ink-400)' }}>↗</div>
                </a>
              ))}
            </div>
          )}
          <style>{`@media (max-width:900px){ .jr { grid-template-columns: 1fr !important; gap: 6px !important; } .jr > div:last-child { display: none; } }`}</style>
        </div>
      </section>

      {/* Why Alpha */}
      {perks.length > 0 && (
        <section
          className="grain"
          style={{ padding: '120px 0', background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))', color: '#fff' }}
        >
          <div className="container">
            <div className="pk" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 72, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                  <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                    Why Alpha
                  </span>
                </div>
                <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 42px)', margin: '0 0 24px', color: '#fff' }}>
                  Đầu tư vào{' '}
                  <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                    con người
                  </span>
                  , không chỉ máy móc.
                </h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
                  Đội ngũ 45 người, gần 70% gắn bó trên 5 năm — đó là thước đo của chúng tôi.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.08)' }}>
                {perks.map((p) => (
                  <div key={p.id} style={{ background: 'var(--navy-900)', padding: 32 }}>
                    <h3 className="display" style={{ fontSize: 18, margin: '0 0 10px', color: '#fff', fontWeight: 600 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <style>{`@media (max-width:900px){ .pk { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
        </section>
      )}
    </>
  );
}

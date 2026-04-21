/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

function formatDate(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function getData() {
  const [hero, posts] = await Promise.all([
    prisma.cmsPageHero.findUnique({ where: { pageSlug: 'news' } }),
    prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 7,
    }),
  ]);
  return { hero, posts };
}

export default async function TinTucPage() {
  const { hero, posts } = await getData();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Insights · Tin tức'}
        title={hero?.titleLead || 'Góc nhìn'}
        serif={hero?.titleAccent || 'chuyên gia —'}
        tail={hero?.titleTail || 'cập nhật từ phòng lab.'}
        subtitle={hero?.subtitle || ''}
      />
      <section style={{ padding: '80px 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          {posts.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>
              Chưa có bài viết nào.
            </div>
          )}

          {featured && (
            <article
              className="fa"
              style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48, alignItems: 'center', paddingBottom: 80, borderBottom: rest.length > 0 ? '1px solid var(--line)' : 'none' }}
            >
              <div style={{ height: 440, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--line)', background: '#f0f2f6' }}>
                {featured.featuredImageUrl && (
                  <img src={featured.featuredImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: 'var(--gold)', color: '#fff', fontSize: 11, fontWeight: 600 }}>
                    ★ Featured
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>
                    {formatDate(featured.publishedAt)}
                  </span>
                </div>
                <h2 className="display" style={{ fontSize: 'clamp(26px, 3vw, 38px)', margin: '0 0 20px', lineHeight: 1.15 }}>
                  {featured.titleVi}
                </h2>
                {featured.excerptVi && (
                  <p style={{ fontSize: 15, color: 'var(--ink-500)', lineHeight: 1.75, margin: '0 0 28px' }}>
                    {featured.excerptVi}
                  </p>
                )}
                <Link
                  href={`/tin-tuc/${featured.slug}`}
                  style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 22px', borderRadius: 999, background: 'var(--ink-900)', color: '#fff', fontSize: 13.5, fontWeight: 600 }}
                >
                  Đọc bài viết →
                </Link>
              </div>
            </article>
          )}

          {rest.length > 0 && (
            <div style={{ paddingTop: 72 }}>
              <h2 className="display" style={{ fontSize: 28, margin: '0 0 40px', fontWeight: 600 }}>
                Bài viết gần đây
              </h2>
              <div className="pg" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36 }}>
                {rest.map((p) => (
                  <article key={p.id}>
                    <Link href={`/tin-tuc/${p.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ height: 220, borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 20, background: '#f0f2f6' }}>
                        {p.featuredImageUrl && (
                          <img src={p.featuredImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        {p.category && (
                          <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 999, background: 'var(--accent-50)', color: 'var(--accent-600)', fontSize: 11, fontWeight: 600 }}>
                            {p.category}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>
                          {formatDate(p.publishedAt)}
                        </span>
                      </div>
                      <h3 className="display" style={{ fontSize: 19, margin: '0 0 10px', fontWeight: 600, lineHeight: 1.3 }}>
                        {p.titleVi}
                      </h3>
                      {p.excerptVi && (
                        <p style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.65, margin: 0 }}>
                          {p.excerptVi}
                        </p>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
        <style>{`@media (max-width:900px){ .fa { grid-template-columns: 1fr !important; } } @media (max-width:980px){ .pg { grid-template-columns: 1fr 1fr !important; } } @media (max-width:560px){ .pg { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </>
  );
}

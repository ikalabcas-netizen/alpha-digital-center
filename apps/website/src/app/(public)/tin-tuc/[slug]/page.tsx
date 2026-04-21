/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marked } from 'marked';
import { prisma } from '@/lib/prisma';
import { PageHero } from '@/components/layout/PageHero';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  'tin-tuc': 'Tin tức',
  'kien-thuc': 'Kiến thức',
  'cong-nghe': 'Công nghệ',
  'tuyen-dung': 'Tuyển dụng',
  'san-pham': 'Chi tiết sản phẩm',
};

function formatDate(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
}

marked.setOptions({ gfm: true, breaks: false });

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: 'published' },
  });
}

async function getRelated(post: { id: string; category: string | null; tags: string[] }) {
  return prisma.blogPost.findMany({
    where: {
      status: 'published',
      id: { not: post.id },
      OR: [
        post.category ? { category: post.category } : {},
        { tags: { hasSome: post.tags.length ? post.tags : [''] } },
      ],
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Không tìm thấy bài viết' };
  return {
    title: post.seoTitle || `${post.titleVi} — Alpha Digital Center`,
    description: post.seoDescription || post.excerptVi || undefined,
    openGraph: {
      title: post.seoTitle || post.titleVi,
      description: post.seoDescription || post.excerptVi || undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Fire-and-forget view count increment — no await
  prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const [relatedPosts, htmlContent] = await Promise.all([
    getRelated({ id: post.id, category: post.category, tags: post.tags }),
    marked.parse(post.contentVi || ''),
  ]);

  const categoryLabel = post.category ? CATEGORY_LABELS[post.category] || post.category : 'Bài viết';

  return (
    <>
      <PageHero
        eyebrow={`${categoryLabel} · ${formatDate(post.publishedAt)}`}
        title={post.titleVi}
        subtitle={post.excerptVi || undefined}
      />

      <section style={{ padding: '80px 0 120px', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {post.featuredImageUrl && (
            <div
              style={{
                marginBottom: 48,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                background: '#f0f2f6',
              }}
            >
              <img
                src={post.featuredImageUrl}
                alt={post.titleVi}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}

          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'var(--bg-warm)',
                    fontSize: 12,
                    color: 'var(--ink-700)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <article
            className="prose"
            style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-700)' }}
            dangerouslySetInnerHTML={{ __html: htmlContent as string }}
          />

          <div
            style={{
              marginTop: 56,
              paddingTop: 32,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <Link
              href="/tin-tuc"
              style={{
                padding: '12px 24px',
                borderRadius: 999,
                border: '1px solid var(--line)',
                color: 'var(--ink-900)',
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              ← Xem tất cả bài viết
            </Link>
            <Link
              href="/lien-he"
              style={{
                padding: '12px 24px',
                borderRadius: 999,
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              Liên hệ tư vấn →
            </Link>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section style={{ padding: '80px 0', background: 'var(--bg-warm)' }}>
          <div className="container">
            <h2
              className="display"
              style={{ fontSize: 28, margin: '0 0 32px', fontWeight: 600 }}
            >
              Bài viết liên quan
            </h2>
            <div
              className="rg"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
            >
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/tin-tuc/${p.slug}`}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-lg)',
                      overflow: 'hidden',
                      height: '100%',
                    }}
                  >
                    <div style={{ height: 160, background: '#f0f2f6' }}>
                      {p.featuredImageUrl && (
                        <img
                          src={p.featuredImageUrl}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ padding: 20 }}>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--ink-400)',
                          fontFamily: 'var(--font-mono)',
                          marginBottom: 6,
                        }}
                      >
                        {formatDate(p.publishedAt)}
                      </div>
                      <div
                        className="display"
                        style={{ fontSize: 16, margin: 0, fontWeight: 600, lineHeight: 1.35 }}
                      >
                        {p.titleVi}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <style>{`@media (max-width:900px){ .rg { grid-template-columns: 1fr 1fr !important; } } @media (max-width:560px){ .rg { grid-template-columns: 1fr !important; } }`}</style>
        </section>
      )}
    </>
  );
}

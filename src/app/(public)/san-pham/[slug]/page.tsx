/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marked } from 'marked';
import { prisma } from '@/lib/prisma';
import { PageHero } from '@/components/layout/PageHero';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

function formatVnd(n: bigint | null | number): string {
  if (n === null || n === undefined) return 'Liên hệ';
  const v = typeof n === 'bigint' ? Number(n) : n;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}K`;
  return String(v);
}

function formatVndFull(n: bigint | number): string {
  const v = typeof n === 'bigint' ? Number(n) : n;
  return v.toLocaleString('vi-VN');
}

marked.setOptions({ gfm: true, breaks: false });

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
      variants: { where: { isActive: true }, orderBy: { priceVnd: 'asc' } },
    },
  });
}

async function getRelatedBlog(productSlug: string, productName: string) {
  // Find blog posts that reference this product — either slug starts with same prefix
  // or tags include product name keywords
  return prisma.blogPost.findMany({
    where: {
      status: 'published',
      category: 'san-pham',
      OR: [
        { slug: { startsWith: productSlug } },
        { contentVi: { contains: `/san-pham/${productSlug}` } },
      ],
    },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Không tìm thấy sản phẩm' };
  return {
    title: product.seoTitle || `${product.nameVi} — Alpha Digital Center`,
    description:
      product.seoDescription ||
      (product.descriptionVi ? product.descriptionVi.slice(0, 160) : undefined),
    openGraph: {
      title: product.seoTitle || product.nameVi,
      description: product.seoDescription || product.descriptionVi?.slice(0, 160) || undefined,
      type: 'website',
      images: product.images[0]?.imageUrl ? [{ url: product.images[0].imageUrl }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [relatedBlog, htmlDesc] = await Promise.all([
    getRelatedBlog(product.slug, product.nameVi),
    product.descriptionVi ? marked.parse(product.descriptionVi) : Promise.resolve(''),
  ]);

  const minPrice = product.variants[0]?.priceVnd;
  const maxPrice = product.variants[product.variants.length - 1]?.priceVnd;
  const priceLabel = minPrice
    ? minPrice === maxPrice
      ? `${formatVnd(minPrice)}`
      : `Từ ${formatVnd(minPrice)}`
    : 'Liên hệ';

  return (
    <>
      <PageHero
        eyebrow={`${product.category.nameVi}${product.material ? ` · ${product.material}` : ''}`}
        title={product.nameVi}
        subtitle={
          product.descriptionVi
            ? product.descriptionVi.replace(/\*\*/g, '').split(/[.!?\n]/)[0] + '...'
            : undefined
        }
        image={product.images[0]?.imageUrl || undefined}
      />

      {/* Overview: gallery + key facts */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div
          className="container po"
          style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'start' }}
        >
          {/* Gallery */}
          <div>
            {product.images.length > 0 ? (
              <>
                <div
                  style={{
                    height: 420,
                    background: '#f0f2f6',
                    borderRadius: 'var(--r-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--line)',
                    marginBottom: 12,
                  }}
                >
                  <img
                    src={product.images[0].imageUrl}
                    alt={product.images[0].altTextVi || product.nameVi}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {product.images.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {product.images.slice(1, 5).map((img) => (
                      <div
                        key={img.id}
                        style={{
                          height: 90,
                          background: '#f0f2f6',
                          borderRadius: 10,
                          overflow: 'hidden',
                          border: '1px solid var(--line)',
                        }}
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.altTextVi || ''}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  height: 420,
                  background: 'linear-gradient(135deg, var(--bg-warm), var(--bg))',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ink-400)',
                }}
              >
                <span className="eyebrow">Ảnh sẽ cập nhật</span>
              </div>
            )}
          </div>

          {/* Key facts + CTA */}
          <div>
            {product.isFeatured && (
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'var(--gold)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                ★ Flagship
              </div>
            )}
            <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 20 }}>
              <Link href="/san-pham" style={{ color: 'var(--ink-500)' }}>
                Sản phẩm
              </Link>
              {' / '}
              <span>{product.category.nameVi}</span>
            </div>

            <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 6 }}>Khoảng giá</div>
              <div
                className="display"
                style={{ fontSize: 36, fontWeight: 500, color: 'var(--ink-900)' }}
              >
                {priceLabel}
              </div>
              {product.warrantyYears && (
                <div style={{ fontSize: 13, color: 'var(--accent-600)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
                  Bảo hành {product.warrantyYears} năm
                </div>
              )}
            </div>

            <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px 20px', margin: 0, marginBottom: 28, fontSize: 14 }}>
              {product.sku && (
                <>
                  <dt style={{ color: 'var(--ink-500)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>MÃ</dt>
                  <dd style={{ margin: 0, color: 'var(--ink-900)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{product.sku}</dd>
                </>
              )}
              {product.material && (
                <>
                  <dt style={{ color: 'var(--ink-500)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>VẬT LIỆU</dt>
                  <dd style={{ margin: 0, color: 'var(--ink-900)' }}>{product.material}</dd>
                </>
              )}
              {product.origin && (
                <>
                  <dt style={{ color: 'var(--ink-500)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>XUẤT XỨ</dt>
                  <dd style={{ margin: 0, color: 'var(--ink-900)' }}>{product.origin}</dd>
                </>
              )}
              <dt style={{ color: 'var(--ink-500)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>DANH MỤC</dt>
              <dd style={{ margin: 0, color: 'var(--ink-900)' }}>{product.category.nameVi}</dd>
            </dl>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link
                href="/lien-he"
                style={{
                  padding: '14px 28px',
                  borderRadius: 999,
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Yêu cầu báo giá →
              </Link>
              <Link
                href="/san-pham"
                style={{
                  padding: '14px 28px',
                  borderRadius: 999,
                  border: '1px solid var(--line)',
                  color: 'var(--ink-900)',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Xem danh mục
              </Link>
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .po { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
      </section>

      {/* Variants price table */}
      {product.variants.length > 0 && (
        <section style={{ padding: '80px 0', background: 'var(--bg-warm)' }}>
          <div className="container" style={{ maxWidth: 960 }}>
            <div style={{ marginBottom: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Biến thể · Giá chi tiết</div>
              <h2 className="display" style={{ fontSize: 28, margin: 0, fontWeight: 600 }}>
                {product.variants.length} biến thể sẵn gia công
              </h2>
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                boxShadow: 'var(--sh-sm)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', color: 'var(--ink-500)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                    <th style={{ textAlign: 'left', padding: '14px 20px' }}>BIẾN THỂ</th>
                    <th style={{ textAlign: 'left', padding: '14px 20px' }}>ĐVT</th>
                    <th style={{ textAlign: 'right', padding: '14px 20px' }}>GIÁ VND</th>
                    <th style={{ textAlign: 'left', padding: '14px 20px' }}>GHI CHÚ</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--ink-900)' }}>{v.nameVi}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--ink-500)' }}>{v.unit}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-600)' }}>
                        {formatVndFull(v.priceVnd)}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--ink-500)', fontSize: 13 }}>
                        {v.priceNote || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Description */}
      {product.descriptionVi && (
        <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Mô tả chi tiết</div>
            <h2 className="display" style={{ fontSize: 28, margin: '0 0 32px', fontWeight: 600 }}>
              Thông tin thêm
            </h2>
            <article
              className="prose"
              style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-700)' }}
              dangerouslySetInnerHTML={{ __html: htmlDesc as string }}
            />
          </div>
        </section>
      )}

      {/* Related blog posts (variant SEO articles) */}
      {relatedBlog.length > 0 && (
        <section style={{ padding: '80px 0 120px', background: 'var(--bg-warm)' }}>
          <div className="container">
            <div style={{ marginBottom: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Bài viết chi tiết</div>
              <h2 className="display" style={{ fontSize: 28, margin: 0, fontWeight: 600 }}>
                Đọc thêm về từng biến thể
              </h2>
            </div>
            <div className="rbg" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {relatedBlog.map((p) => (
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
                      padding: 20,
                      height: '100%',
                    }}
                  >
                    <div style={{ fontSize: 11, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                      {p.tags[0] || 'Chi tiết'}
                    </div>
                    <div
                      className="display"
                      style={{ fontSize: 15, margin: 0, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}
                    >
                      {p.titleVi}
                    </div>
                    {p.excerptVi && (
                      <div style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.6 }}>
                        {p.excerptVi.slice(0, 100)}...
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <style>{`@media (max-width:900px){ .rbg { grid-template-columns: 1fr 1fr !important; } } @media (max-width:560px){ .rbg { grid-template-columns: 1fr !important; } }`}</style>
        </section>
      )}
    </>
  );
}

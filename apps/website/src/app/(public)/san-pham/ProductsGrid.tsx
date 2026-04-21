'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  slug: string;
  nameVi: string;
  descriptionVi: string | null;
  categoryId: string;
  categoryNameVi: string;
  isFeatured: boolean;
  warrantyYears: number | null;
  imageUrl: string | null;
  lowestPrice: number | null;
  material: string | null;
};

type Category = { id: string; nameVi: string };

function formatVnd(n: number | null): string {
  if (!n) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export function ProductsGrid({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [catId, setCatId] = useState<string | null>(null);
  const filt = catId ? products.filter((p) => p.categoryId === catId) : products;

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '24px 0 36px', borderBottom: '1px solid var(--line)', marginBottom: 40 }}>
        <FilterBtn label="Tất cả" active={catId === null} onClick={() => setCatId(null)} />
        {categories.map((c) => (
          <FilterBtn key={c.id} label={c.nameVi} active={catId === c.id} onClick={() => setCatId(c.id)} />
        ))}
      </div>

      {filt.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>
          Chưa có sản phẩm trong danh mục này.
        </div>
      ) : (
        <div className="pg" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {filt.map((p, i) => {
            const isFlagship = i === 0 && p.isFeatured;
            return (
              <Link
                key={p.id}
                href={`/san-pham/${p.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', gridColumn: isFlagship ? 'span 2' : 'auto', gridRow: isFlagship ? 'span 2' : 'auto' }}
              >
              <article
                style={{
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--sh-sm)',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <div style={{ height: isFlagship ? 380 : 200, overflow: 'hidden', background: '#f0f2f6', position: 'relative' }}>
                  {p.imageUrl && <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  {p.isFeatured && (
                    <div style={{ position: 'absolute', top: 16, left: 16 }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: 'var(--gold)', color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>
                        ★ Flagship
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ padding: isFlagship ? 32 : 20 }}>
                  <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>
                    {p.categoryNameVi}
                    {p.material ? ` · ${p.material}` : ''}
                  </div>
                  <h3 className="display" style={{ fontSize: isFlagship ? 24 : 16, margin: '0 0 8px', fontWeight: 600 }}>
                    {p.nameVi}
                  </h3>
                  {p.descriptionVi && (
                    <p style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.6, margin: '0 0 16px' }}>{p.descriptionVi}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--line-soft)' }}>
                    <div className="display" style={{ fontSize: 16, fontWeight: 600 }}>
                      {p.lowestPrice ? `Từ ${formatVnd(p.lowestPrice)}` : 'Liên hệ'}
                    </div>
                    {p.warrantyYears && (
                      <div style={{ fontSize: 11, color: 'var(--accent-600)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        BH {p.warrantyYears} năm
                      </div>
                    )}
                  </div>
                </div>
              </article>
              </Link>
            );
          })}
        </div>
      )}
      <style>{`@media (max-width:980px){ .pg { grid-template-columns: 1fr 1fr !important; } } @media (max-width:560px){ .pg { grid-template-columns: 1fr !important; } .pg > article { grid-column: auto !important; grid-row: auto !important; } }`}</style>
    </>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: 999,
        border: `1px solid ${active ? 'var(--ink-900)' : 'var(--line)'}`,
        background: active ? 'var(--ink-900)' : '#fff',
        color: active ? '#fff' : 'var(--ink-700)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

'use client';
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { PageHero } from '@/components/layout/PageHero';

const IMG = {
  heroLab: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1400&q=80',
  cadcam: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&q=80',
  tech: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1000&q=80',
  crown: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=1000&q=80',
  tools: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1000&q=80',
  scanner: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1000&q=80',
  dentist: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1000&q=80',
  hands: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1000&q=80',
  implant: 'https://images.unsplash.com/photo-1626177382002-f43a6d15b7c0?w=1000&q=80',
};

const CATS = ['Tất cả', 'Toàn sứ', 'Sứ ép', 'Implant', 'Veneer', 'Hàm tháo lắp'];

type Product = {
  tag: string;
  n: string;
  b: string;
  d: string;
  w: string;
  p: string;
  f?: boolean;
  img: string;
};

const PRODS: Product[] = [
  { tag: 'Toàn sứ', n: 'Sứ Zirconia Cercon HT', b: 'Dentsply Sirona', d: 'Zirconia siêu bền, độ trong suốt cao. Ứng dụng cho cầu răng trước và sau.', w: '10 năm', p: '850K', f: true, img: IMG.crown },
  { tag: 'Sứ ép', n: 'IPS e.max Press', b: 'Ivoclar Vivadent', d: 'Lithium disilicate 400 MPa, thẩm mỹ tự nhiên.', w: '7 năm', p: '950K', img: IMG.tech },
  { tag: 'Toàn sứ', n: 'Zolid Gen-X', b: 'Amann Girrbach', d: 'Multilayered zirconia thế hệ mới.', w: '15 năm', p: '1.100K', img: IMG.tools },
  { tag: 'Implant', n: 'Custom Abutment Titanium', b: 'Alpha Lab', d: 'Abutment cá nhân hoá Ti Grade 5.', w: '10 năm', p: '1.800K', img: IMG.implant },
  { tag: 'Implant', n: 'Abutment Zirconia', b: 'Alpha Lab', d: 'Trụ Zirconia cho vùng thẩm mỹ.', w: '10 năm', p: '2.200K', img: IMG.dentist },
  { tag: 'Veneer', n: 'IPS e.max Veneer', b: 'Ivoclar', d: 'Veneer mỏng 0.3mm cho smile design.', w: '7 năm', p: '1.050K', img: IMG.hands },
  { tag: 'Hàm tháo lắp', n: 'Hàm Flexi Partial', b: 'Valplast', d: 'Hàm tháo lắp đàn hồi, không móc kim loại.', w: '5 năm', p: '1.500K', img: IMG.scanner },
  { tag: 'Toàn sứ', n: 'Katana UTML Zirconia', b: 'Kuraray Noritake', d: 'Ultra-translucent zirconia cho vùng cửa.', w: '12 năm', p: '1.250K', img: IMG.heroLab },
];

export default function SanPhamPage() {
  const [cat, setCat] = useState('Tất cả');
  const filt = cat === 'Tất cả' ? PRODS : PRODS.filter((p) => p.tag === cat);

  return (
    <>
      <PageHero
        eyebrow="Products · Sản phẩm"
        title="Danh mục"
        serif="sản phẩm gia công —"
        tail="đầy đủ & chính hãng."
        subtitle="Từ sứ Zirconia cao cấp đến custom abutment implant, veneer thẩm mỹ — tất cả gia công CAD/CAM với phôi chính hãng."
        image={IMG.crown}
      />
      <section style={{ padding: '56px 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              padding: '24px 0 36px',
              borderBottom: '1px solid var(--line)',
              marginBottom: 40,
            }}
          >
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 999,
                  border: `1px solid ${cat === c ? 'var(--ink-900)' : 'var(--line)'}`,
                  background: cat === c ? 'var(--ink-900)' : '#fff',
                  color: cat === c ? '#fff' : 'var(--ink-700)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div
            className="pg"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }}
          >
            {filt.map((p, i) => {
              const isFlagship = i === 0 && p.f;
              return (
                <article
                  key={p.n}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-lg)',
                    boxShadow: 'var(--sh-sm)',
                    overflow: 'hidden',
                    gridColumn: isFlagship ? 'span 2' : 'auto',
                    gridRow: isFlagship ? 'span 2' : 'auto',
                  }}
                >
                  <div
                    style={{
                      height: isFlagship ? 380 : 200,
                      overflow: 'hidden',
                      background: '#f0f2f6',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={p.img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {p.f && (
                      <div style={{ position: 'absolute', top: 16, left: 16 }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: 'var(--gold)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                          }}
                        >
                          ★ Flagship
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: isFlagship ? 32 : 20 }}>
                    <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>
                      {p.tag} · {p.b}
                    </div>
                    <h3
                      className="display"
                      style={{
                        fontSize: isFlagship ? 24 : 16,
                        margin: '0 0 8px',
                        fontWeight: 600,
                      }}
                    >
                      {p.n}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--ink-500)',
                        lineHeight: 1.6,
                        margin: '0 0 16px',
                      }}
                    >
                      {p.d}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 14,
                        borderTop: '1px solid var(--line-soft)',
                      }}
                    >
                      <div className="display" style={{ fontSize: 16, fontWeight: 600 }}>
                        {p.p}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--accent-600)',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        BH {p.w}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <style>{`@media (max-width:980px){ .pg { grid-template-columns: 1fr 1fr !important; } } @media (max-width:560px){ .pg { grid-template-columns: 1fr !important; } .pg > article { grid-column: auto !important; grid-row: auto !important; } }`}</style>
      </section>
    </>
  );
}

'use client';

import { useState } from 'react';
import { PageHero } from '@/components/layout/PageHero';

type Result = {
  code: string;
  product: string;
  lab: string;
  date: string;
  exp: string;
  rem: number;
  tot: number;
};

export default function BaoHanhPage() {
  const [code, setCode] = useState('');
  const [res, setRes] = useState<Result | null>(null);

  const run = (v?: string) => {
    const c = (v || 'ADC-2024-8X7F').toUpperCase();
    setCode(c);
    setTimeout(
      () =>
        setRes({
          code: c,
          product: 'Sứ Zirconia Cercon HT',
          lab: 'Nha khoa Minh Châu',
          date: '15/08/2024',
          exp: '15/08/2034',
          rem: 104,
          tot: 120,
        }),
      300,
    );
  };

  return (
    <>
      <PageHero
        eyebrow="Warranty · Bảo hành"
        title="Cam kết"
        serif="bảo hành —"
        tail="đến 19 năm."
        subtitle="Nhập mã bảo hành trên phiếu đi kèm sản phẩm để tra cứu tình trạng, thời hạn và các quyền lợi kèm theo."
      />

      {/* Warranty lookup */}
      <section
        className="grain"
        style={{
          padding: '88px 0 120px',
          background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))',
          color: '#fff',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 720,
              margin: '0 auto',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--r-xl)',
              padding: 48,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span style={{ width: 24, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  Tra cứu bảo hành
                </span>
                <span style={{ width: 24, height: 1, background: 'var(--gold)' }} />
              </div>
              <h2
                className="display"
                style={{ fontSize: 32, margin: 0, fontWeight: 500, color: '#fff' }}
              >
                Nhập mã bảo hành
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.6)',
                  margin: '12px 0 0',
                }}
              >
                Mã có 8 ký tự, in trên phiếu bảo hành đi kèm sản phẩm
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: ADC-2024-8X7F"
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 15,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => run(code)}
                style={{
                  padding: '16px 28px',
                  borderRadius: 999,
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tra cứu
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Chưa có mã?{' '}
              <a
                style={{ color: 'var(--gold-light)', cursor: 'pointer' }}
                onClick={() => run()}
              >
                Thử với mã demo
              </a>
            </div>
            {res && (
              <div
                style={{
                  marginTop: 36,
                  padding: 28,
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.25)',
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      Đang trong thời gian bảo hành
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--gold-light)',
                    }}
                  >
                    {res.code}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {(
                    [
                      ['Sản phẩm', res.product],
                      ['Labo', res.lab],
                      ['Ngày kích hoạt', res.date],
                      ['Hết hạn', res.exp],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div key={k}>
                      <div
                        style={{
                          fontSize: 10,
                          color: 'rgba(255,255,255,0.45)',
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.15em',
                          marginBottom: 4,
                        }}
                      >
                        {k.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Còn lại</span>
                    <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                      {res.rem}/{res.tot} tháng
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(res.rem / res.tot) * 100}%`,
                        background: 'linear-gradient(90deg, var(--accent), var(--gold))',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Warranty policy */}
      <section style={{ padding: '120px 0', background: 'var(--bg-warm)' }}>
        <div
          className="container pol"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 80,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Chính sách</span>
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(28px, 3vw, 40px)', margin: '0 0 24px' }}
            >
              Bảo hành{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                minh bạch
              </span>
              .
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-500)', lineHeight: 1.75 }}>
              Mọi sản phẩm rời xưởng đều kèm phiếu bảo hành ghi rõ thời hạn, phạm vi. Lỗi gia công — làm lại miễn phí trong 72h.
            </p>
          </div>
          <div>
            {[
              {
                c: 'Toàn sứ (Zirconia)',
                p: ['Cercon HT · 10 năm', 'Zolid Gen-X · 15 năm', 'Katana UTML · 12 năm'],
              },
              { c: 'Sứ ép', p: ['IPS e.max Press · 7 năm', 'IPS e.max CAD · 7 năm'] },
              {
                c: 'Implant',
                p: ['Custom Abutment Ti · 10 năm', 'Abutment Zirconia · 10 năm'],
              },
              { c: 'Hàm tháo lắp', p: ['Flexi Partial · 5 năm', 'Hàm nhựa · 3 năm'] },
            ].map((r, i, a) => (
              <div
                key={r.c}
                style={{
                  padding: '28px 0',
                  borderTop: '1px solid var(--line)',
                  borderBottom: i === a.length - 1 ? '1px solid var(--line)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.6fr',
                  gap: 32,
                  alignItems: 'flex-start',
                }}
              >
                <h3 className="display" style={{ fontSize: 18, margin: 0, fontWeight: 600 }}>
                  {r.c}
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {r.p.map((item) => (
                    <li
                      key={item}
                      style={{
                        padding: '6px 0',
                        fontSize: 14,
                        color: 'var(--ink-700)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: 'var(--accent)',
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width:900px){ .pol { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
      </section>
    </>
  );
}

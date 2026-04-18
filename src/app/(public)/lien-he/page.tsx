'use client';

import { useState, type CSSProperties, type FormEvent } from 'react';
import { PageHero } from '@/components/layout/PageHero';

const fs: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: '#fff',
  border: '1px solid var(--line)',
  borderRadius: 10,
  color: 'var(--ink-900)',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

export default function LienHePage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact · Liên hệ"
        title="Hãy"
        serif="trò chuyện"
        tail="với chúng tôi."
        subtitle="Dù là báo giá, tư vấn kỹ thuật, hay đơn giản muốn tìm hiểu Alpha — chúng tôi luôn sẵn sàng nghe từ bạn."
      />

      {/* Contact + Form */}
      <section style={{ padding: '120px 0', background: 'var(--bg)' }}>
        <div
          className="container ct"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: 80,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Kênh liên hệ</span>
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(28px, 3vw, 42px)', margin: '0 0 28px' }}
            >
              Luôn sẵn sàng{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                hỗ trợ
              </span>{' '}
              bạn.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: 'var(--ink-500)',
                lineHeight: 1.75,
                marginBottom: 40,
              }}
            >
              Đội ngũ kinh doanh và kỹ thuật của Alpha luôn sẵn sàng tư vấn — từ câu hỏi kỹ thuật đến báo giá nhanh.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {(
                [
                  ['HOTLINE · 24/7', '0378 422 496', 'Hỗ trợ kỹ thuật & đặt hàng'],
                  ['EMAIL', 'info@alphacenter.vn', 'Phản hồi trong 2 giờ'],
                  ['ZALO OFFICIAL', '0378 422 496', 'Chat nhanh, gửi file CAD'],
                  ['GIỜ LÀM VIỆC', '07:30 — 17:30', 'Thứ 2 đến Thứ 7'],
                ] as [string, string, string][]
              ).map(([l, v, s]) => (
                <div
                  key={l}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    gap: 20,
                    padding: '16px 0',
                    borderTop: '1px solid var(--line)',
                    alignItems: 'center',
                  }}
                >
                  <div className="eyebrow" style={{ fontSize: 11 }}>
                    {l}
                  </div>
                  <div>
                    <div
                      className="display"
                      style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}
                    >
                      {v}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-xl)',
              padding: 48,
              boxShadow: 'var(--sh-md)',
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#fff',
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <h3
                  className="display"
                  style={{ fontSize: 24, margin: '0 0 12px', fontWeight: 600 }}
                >
                  Cảm ơn bạn!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--ink-500)' }}>
                  Chúng tôi sẽ liên hệ trong vòng 24 giờ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  className="display"
                  style={{ fontSize: 22, margin: '0 0 6px', fontWeight: 600 }}
                >
                  Gửi tin nhắn
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 24px' }}>
                  Đội ngũ sẽ phản hồi trong 24h.
                </p>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input required placeholder="Họ và tên *" style={fs} />
                    <input required type="tel" placeholder="Điện thoại *" style={fs} />
                  </div>
                  <input type="email" placeholder="Email" style={fs} />
                  <input placeholder="Tên labo / phòng khám" style={fs} />
                  <select defaultValue="" required style={fs}>
                    <option value="" disabled>
                      Chủ đề *
                    </option>
                    <option>Yêu cầu báo giá</option>
                    <option>Tư vấn kỹ thuật</option>
                    <option>Đối tác / hợp tác</option>
                    <option>Khác</option>
                  </select>
                  <textarea
                    rows={4}
                    required
                    placeholder="Nội dung *"
                    style={{ ...fs, resize: 'vertical', minHeight: 100 }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '14px 24px',
                      borderRadius: 999,
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: 8,
                    }}
                  >
                    Gửi yêu cầu →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <style>{`@media (max-width:900px){ .ct { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
      </section>

      {/* Map */}
      <section style={{ padding: '0 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          <div
            className="mw"
            style={{
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              border: '1px solid var(--line)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              minHeight: 420,
            }}
          >
            <div
              style={{
                padding: 48,
                background: 'var(--navy-900)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  Văn phòng
                </span>
              </div>
              <h3
                className="display"
                style={{
                  fontSize: 28,
                  margin: '0 0 16px',
                  color: '#fff',
                  fontWeight: 500,
                }}
              >
                242/12 Phạm Văn Hai
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.75,
                }}
              >
                Phường 5, Quận Tân Bình,
                <br />
                Thành phố Hồ Chí Minh, Việt Nam
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 20,
                  flexWrap: 'wrap',
                }}
              >
                <a
                  href="#"
                  style={{
                    padding: '12px 20px',
                    borderRadius: 999,
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  Xem Google Maps
                </a>
                <a
                  href="#"
                  style={{
                    padding: '12px 20px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
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
                <path
                  d="M 0 220 Q 200 200 400 240 T 600 220"
                  stroke="#C9A961"
                  strokeWidth="6"
                  fill="none"
                  opacity="0.5"
                />
                <path d="M 300 0 L 320 420" stroke="#B8C2D4" strokeWidth="4" />
                <circle cx="310" cy="210" r="32" fill="#06B6D4" opacity="0.15" />
                <circle cx="310" cy="210" r="16" fill="#06B6D4" opacity="0.3" />
                <circle cx="310" cy="210" r="8" fill="#06B6D4" />
                <circle cx="310" cy="210" r="3" fill="#fff" />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  padding: '10px 14px',
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: 'var(--sh-md)',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
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

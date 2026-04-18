/* eslint-disable @next/next/no-img-element */
import { PageHero } from '@/components/layout/PageHero';

const IMG = {
  cadcam: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&q=80',
  tech: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1000&q=80',
  crown: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=1000&q=80',
  tools: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1000&q=80',
  scanner: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1000&q=80',
  implant: 'https://images.unsplash.com/photo-1626177382002-f43a6d15b7c0?w=1000&q=80',
};

type Post = { cat: string; d: string; t: string; e: string; img: string; feat?: boolean };

const POSTS: Post[] = [
  {
    cat: 'Công nghệ',
    d: '12 Apr 2026',
    t: 'AI trong thiết kế CAD nha khoa: tương lai đã đến',
    e: 'Machine learning rút ngắn thời gian thiết kế từ 45 phút xuống 8 phút.',
    img: IMG.scanner,
    feat: true,
  },
  {
    cat: 'Vật liệu',
    d: '08 Apr 2026',
    t: 'So sánh Zirconia thế hệ 5 vs Multilayer',
    e: 'Độ trong suốt, độ bền, giá thành — phân tích chi tiết.',
    img: IMG.crown,
  },
  {
    cat: 'Quy trình',
    d: '02 Apr 2026',
    t: 'Workflow số: từ scan đến milling trong 3 giờ',
    e: 'Khám phá quy trình CAD/CAM tại Alpha.',
    img: IMG.cadcam,
  },
  {
    cat: 'Kinh nghiệm',
    d: '28 Mar 2026',
    t: 'Tránh 5 lỗi thường gặp khi chuẩn bị file scan',
    e: 'Hướng dẫn từ đội kỹ thuật Alpha.',
    img: IMG.tools,
  },
  {
    cat: 'Sự kiện',
    d: '22 Mar 2026',
    t: 'Alpha tại IDS 2026 Cologne, Đức',
    e: 'Công nghệ mới từ triển lãm nha khoa lớn nhất thế giới.',
    img: IMG.tech,
  },
  {
    cat: 'Công nghệ',
    d: '14 Mar 2026',
    t: 'In 3D kim loại titanium: đã đến lúc đầu tư?',
    e: 'Phân tích ROI cho labo quy mô vừa và nhỏ.',
    img: IMG.implant,
  },
];

export default function TinTucPage() {
  const [f, ...rest] = POSTS;
  return (
    <>
      <PageHero
        eyebrow="Insights · Tin tức"
        title="Góc nhìn"
        serif="chuyên gia —"
        tail="cập nhật từ phòng lab."
        subtitle="Chia sẻ kinh nghiệm, công nghệ mới, phân tích vật liệu và các sự kiện trong ngành nha khoa kỹ thuật số."
      />
      <section style={{ padding: '80px 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          <article
            className="fa"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr',
              gap: 48,
              alignItems: 'center',
              paddingBottom: 80,
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div
              style={{
                height: 440,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
              }}
            >
              <img
                src={f.img}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'var(--gold)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  ★ Featured
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--ink-400)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {f.d}
                </span>
              </div>
              <h2
                className="display"
                style={{
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  margin: '0 0 20px',
                  lineHeight: 1.15,
                }}
              >
                {f.t}
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--ink-500)',
                  lineHeight: 1.75,
                  margin: '0 0 28px',
                }}
              >
                {f.e}
              </p>
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 22px',
                  borderRadius: 999,
                  background: 'var(--ink-900)',
                  color: '#fff',
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                Đọc bài viết →
              </a>
            </div>
          </article>
          <div style={{ paddingTop: 72 }}>
            <h2
              className="display"
              style={{ fontSize: 28, margin: '0 0 40px', fontWeight: 600 }}
            >
              Bài viết gần đây
            </h2>
            <div
              className="pg"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 36,
              }}
            >
              {rest.map((p) => (
                <article key={p.t}>
                  <div
                    style={{
                      height: 220,
                      borderRadius: 'var(--r-lg)',
                      overflow: 'hidden',
                      marginBottom: 20,
                    }}
                  >
                    <img
                      src={p.img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: 'var(--accent-50)',
                        color: 'var(--accent-600)',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {p.cat}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--ink-400)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {p.d}
                    </span>
                  </div>
                  <h3
                    className="display"
                    style={{
                      fontSize: 19,
                      margin: '0 0 10px',
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {p.t}
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: 'var(--ink-500)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {p.e}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .fa { grid-template-columns: 1fr !important; } } @media (max-width:980px){ .pg { grid-template-columns: 1fr 1fr !important; } } @media (max-width:560px){ .pg { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </>
  );
}

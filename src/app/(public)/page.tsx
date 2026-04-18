/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const IMG = {
  heroLab: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1400&q=80',
  cadcam: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&q=80',
  tech: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1000&q=80',
  scanner: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1000&q=80',
  tools: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1000&q=80',
};

const cardBase = {
  background: '#fff',
  border: '1px solid var(--line)',
  borderRadius: 'var(--r-lg)',
  boxShadow: 'var(--sh-sm)',
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="grain"
        style={{
          background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))',
          color: '#fff',
          padding: '88px 0 120px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -180,
            top: -120,
            width: 600,
            height: 600,
            borderRadius: '50%',
            border: '1px solid rgba(201,169,97,0.12)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -80,
            top: -40,
            width: 420,
            height: 420,
            borderRadius: '50%',
            border: '1px solid rgba(103,232,249,0.08)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="ha"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 1fr',
              gap: 72,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <span style={{ width: 36, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  Digital dental laboratory · Est. 2014
                </span>
              </div>
              <h1
                className="display"
                style={{
                  fontSize: 'clamp(42px, 5.4vw, 72px)',
                  margin: 0,
                  color: '#fff',
                  fontWeight: 500,
                }}
              >
                Nơi tinh hoa <br />
                <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                  nha khoa
                </span>{' '}
                kỹ thuật số <br />
                được <span style={{ color: 'var(--accent-300)' }}>kiến tạo</span>.
              </h1>
              <p
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.68)',
                  margin: '32px 0 40px',
                  maxWidth: 520,
                }}
              >
                Alpha Digital Center — đối tác gia công bán thành phẩm cao cấp cho hơn 500 labo trên toàn quốc. Công nghệ CAD/CAM, phôi chính hãng Dentsply, Ivoclar, Amann Girrbach. Bảo hành đến 19 năm.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/san-pham"
                  style={{
                    padding: '15px 28px',
                    borderRadius: 999,
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Khám phá sản phẩm →
                </Link>
                <Link
                  href="/lien-he"
                  style={{
                    padding: '15px 28px',
                    borderRadius: 999,
                    background: 'var(--gold)',
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Yêu cầu báo giá
                </Link>
              </div>
              <div
                style={{
                  marginTop: 56,
                  paddingTop: 32,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 24,
                }}
              >
                {[
                  { n: '12+', l: 'Năm kinh nghiệm' },
                  { n: '500+', l: 'Labo đối tác' },
                  { n: '19 năm', l: 'Bảo hành tối đa' },
                ].map((s) => (
                  <div key={s.l}>
                    <div
                      className="display"
                      style={{ fontSize: 28, color: 'var(--gold-light)', fontWeight: 500 }}
                    >
                      {s.n}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', height: 580 }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '78%',
                  height: 380,
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                }}
              >
                <img
                  src={IMG.heroLab}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '55%',
                  height: 280,
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  border: '1px solid rgba(201,169,97,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                }}
              >
                <img
                  src={IMG.cadcam}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: 20,
                  bottom: 90,
                  padding: '18px 22px',
                  background: 'rgba(10,22,40,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(201,169,97,0.35)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--gold-light)',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    ISO 13485
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 2 }}>
                    Certified Medical Device
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .ha { grid-template-columns: 1fr !important; gap: 40px !important; } .ha > div:nth-child(2) { height: 420px !important; } }`}</style>
      </section>

      {/* Technology */}
      <section style={{ padding: '120px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ marginBottom: 56, maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Công nghệ · Technology</span>
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', margin: 0 }}
            >
              Máy móc hàng đầu,{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                độ chính xác tuyệt đối.
              </span>
            </h2>
          </div>
          <div
            className="tg"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          >
            {[
              {
                tag: '01',
                meta: '±10μm',
                t: 'Máy phay CNC 5 trục',
                d: 'Hệ thống milling đa trục nhập từ Đức/Nhật. Đảm bảo chi tiết chính xác cho từng sườn sứ và custom abutment.',
                img: IMG.cadcam,
              },
              {
                tag: '02',
                meta: '7μm',
                t: 'Scanner 3D chính xác cao',
                d: '3Shape E4, Medit T710 — scan dấu thạch cao và dấu trong miệng. Workflow số hoàn toàn.',
                img: IMG.scanner,
              },
              {
                tag: '03',
                meta: '25μm',
                t: 'In 3D kim loại & nhựa',
                d: 'Máy in Laser SLM cho khung titanium, in SLA cho mẫu hàm. Rút ngắn thời gian 40%.',
                img: IMG.tools,
              },
            ].map((it) => (
              <article key={it.tag} style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                  <img
                    src={it.img}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      padding: '5px 10px',
                      background: 'rgba(10,22,40,0.75)',
                      backdropFilter: 'blur(10px)',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      borderRadius: 4,
                    }}
                  >
                    {it.tag} · {it.meta}
                  </div>
                </div>
                <div style={{ padding: 28 }}>
                  <h3
                    className="display"
                    style={{ fontSize: 20, margin: '0 0 10px', fontWeight: 600 }}
                  >
                    {it.t}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.7, margin: 0 }}>
                    {it.d}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <style>{`@media (max-width:900px){ .tg { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Materials */}
      <section
        className="grain"
        style={{
          padding: '120px 0',
          background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))',
          color: '#fff',
        }}
      >
        <div className="container">
          <div
            className="mg"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  Materials · Vật liệu
                </span>
              </div>
              <h2
                className="display"
                style={{
                  fontSize: 'clamp(30px, 3.5vw, 46px)',
                  margin: '0 0 24px',
                  color: '#fff',
                }}
              >
                Phôi chính hãng{' '}
                <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                  từ các thương hiệu danh tiếng
                </span>{' '}
                thế giới.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.8,
                }}
              >
                Chúng tôi không đánh đổi chất lượng để lấy giá rẻ. Tất cả phôi Zirconia, sứ ép, kim loại đều nhập khẩu chính ngạch — có Certificate of Origin và lô sản xuất truy xuất được.
              </p>
            </div>
            <div>
              {[
                { n: 'Dentsply Sirona', c: 'Germany / USA', m: 'Cercon HT Zirconia', y: 'Từ 2016' },
                { n: 'Ivoclar Vivadent', c: 'Liechtenstein', m: 'IPS e.max Press', y: 'Từ 2017' },
                { n: 'Amann Girrbach', c: 'Austria', m: 'Zolid Gen-X', y: 'Từ 2019' },
                { n: 'Kuraray Noritake', c: 'Japan', m: 'Katana Zirconia', y: 'Từ 2020' },
              ].map((p, i) => (
                <div
                  key={p.n}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: 24,
                    padding: '28px 0',
                    borderTop: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'rgba(201,169,97,0.7)',
                    }}
                  >
                    0{i + 1}
                  </div>
                  <div>
                    <div
                      className="display"
                      style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}
                    >
                      {p.n}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                      {p.m} · {p.c}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {p.y}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .mg { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '120px 0', background: 'var(--bg-warm)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
              <span className="eyebrow" style={{ color: 'var(--gold-dark)' }}>
                Khách hàng nói
              </span>
              <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', margin: 0 }}
            >
              Tin tưởng từ{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                500+ labo
              </span>{' '}
              đối tác.
            </h2>
          </div>
          <div
            className="tg"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          >
            {[
              {
                q: 'Chất lượng gia công của Alpha ổn định qua 6 năm hợp tác. Sườn zirconia sát khít, màu sắc chính xác với shade yêu cầu.',
                n: 'BS. Nguyễn Anh Tuấn',
                r: 'Giám đốc Labo Anh Tuấn Dental',
                c: 'TP.HCM',
              },
              {
                q: 'Đội ngũ CAD thiết kế tỉ mỉ, tư vấn kỹ. Chúng tôi đã chuyển 80% case ra Alpha và chưa phải làm lại case nào.',
                n: 'KTV. Phạm Minh Hà',
                r: 'Trưởng labo Nha khoa Việt Smile',
                c: 'Hà Nội',
              },
              {
                q: 'Bảo hành 19 năm là cam kết thực sự — lần duy nhất cần bảo hành, họ làm lại miễn phí trong 72h.',
                n: 'BS. Lê Quốc Khánh',
                r: 'Chủ Phòng khám Khánh Dental',
                c: 'Đà Nẵng',
              },
            ].map((t, i) => (
              <figure
                key={i}
                style={{
                  padding: 36,
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-lg)',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 64,
                    color: 'var(--gold)',
                    lineHeight: 0.5,
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;
                </div>
                <blockquote
                  style={{
                    margin: 0,
                    fontSize: 15.5,
                    lineHeight: 1.7,
                    color: 'var(--ink-700)',
                    flex: 1,
                  }}
                >
                  {t.q}
                </blockquote>
                <div style={{ paddingTop: 20, borderTop: '1px solid var(--line-soft)' }}>
                  <div className="display" style={{ fontSize: 15, fontWeight: 600 }}>
                    {t.n}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>
                    {t.r}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--ink-400)',
                      marginTop: 4,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {t.c.toUpperCase()}
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
        <style>{`@media (max-width:900px){ .tg { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </>
  );
}

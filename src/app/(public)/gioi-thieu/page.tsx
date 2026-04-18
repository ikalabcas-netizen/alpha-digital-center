/* eslint-disable @next/next/no-img-element */
import { PageHero } from '@/components/layout/PageHero';

const IMG = {
  office: 'https://images.unsplash.com/photo-1606811842914-f74209f127d1?w=1400&q=80',
  hands: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1000&q=80',
};

export default function GioiThieuPage() {
  return (
    <>
      <PageHero
        eyebrow="About us · Về chúng tôi"
        title="Hơn một"
        serif="xưởng gia công —"
        tail="một đối tác kỹ thuật."
        subtitle="Alpha Digital Center thành lập năm 2014 với sứ mệnh mang công nghệ CAD/CAM đến mọi labo nha khoa Việt Nam. Hôm nay chúng tôi là đối tác của hơn 500 labo trên toàn quốc."
        image={IMG.office}
      />

      {/* Story */}
      <section style={{ padding: '120px 0', background: 'var(--bg)' }}>
        <div
          className="container sg"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', height: 520 }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '70%',
                height: 330,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
              }}
            >
              <img
                src={IMG.office}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '65%',
                height: 290,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--sh-lg)',
              }}
            >
              <img
                src={IMG.hands}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 260,
                right: 20,
                padding: 20,
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 12,
                boxShadow: 'var(--sh-lg)',
              }}
            >
              <div
                className="display"
                style={{ fontSize: 36, color: 'var(--accent)', fontWeight: 500 }}
              >
                2014
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ink-500)',
                  marginTop: 8,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                FOUNDED
              </div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Câu chuyện</span>
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', margin: '0 0 24px' }}
            >
              Khởi nghiệp từ{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                một phòng lab nhỏ
              </span>
              , vươn ra thị trường cả nước.
            </h2>
            <div style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--ink-700)' }}>
              <p>
                Alpha Digital Center được thành lập năm 2014 bởi một nhóm kỹ thuật viên nha khoa yêu nghề, với khao khát mang công nghệ CAD/CAM đến từng labo nhỏ trên khắp cả nước.
              </p>
              <p>
                Sau hơn 12 năm, chúng tôi đã trở thành đối tác gia công của hơn 500 labo. Triết lý ban đầu vẫn không đổi:{' '}
                <strong>
                  mỗi sản phẩm rời xưởng phải đủ tốt để tự tin đặt tên mình lên đó.
                </strong>
              </p>
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .sg { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
      </section>

      {/* Values */}
      <section
        className="grain"
        style={{
          padding: '120px 0',
          color: '#fff',
          background: 'linear-gradient(180deg, var(--navy-900), var(--navy-800))',
        }}
      >
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
              <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                Giá trị cốt lõi
              </span>
              <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', margin: 0, color: '#fff' }}
            >
              Bốn chữ{' '}
              <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                &quot;Chính&quot;
              </span>{' '}
              làm nền móng.
            </h2>
          </div>
          <div
            className="vg"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
          >
            {[
              {
                n: '01',
                t: 'Chính xác',
                d: 'Mỗi sản phẩm qua 5 vòng QC. Dung sai tối đa 25μm.',
              },
              {
                n: '02',
                t: 'Chính hãng',
                d: 'Chỉ dùng phôi có Certificate of Origin từ hãng danh tiếng.',
              },
              {
                n: '03',
                t: 'Chính trực',
                d: 'Bảo hành đến 19 năm, làm lại miễn phí nếu không đạt.',
              },
              {
                n: '04',
                t: 'Chuyên nghiệp',
                d: 'Đội ngũ 40+ KTV đào tạo bài bản, cập nhật liên tục.',
              },
            ].map((v, i) => (
              <div
                key={v.n}
                style={{
                  padding: '36px 32px',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--gold-light)',
                    letterSpacing: '0.15em',
                    marginBottom: 16,
                  }}
                >
                  {v.n}
                </div>
                <h3
                  className="display"
                  style={{ fontSize: 22, margin: '0 0 12px', fontWeight: 500 }}
                >
                  {v.t}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {v.d}
                </p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width:900px){ .vg { grid-template-columns: 1fr 1fr !important; } .vg > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); } } @media (max-width:560px){ .vg { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Timeline */}
      <section style={{ padding: '120px 0', background: 'var(--bg-warm)' }}>
        <div className="container">
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Dấu mốc</span>
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', margin: 0 }}
            >
              12 năm,{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                một hành trình
              </span>{' '}
              không ngừng nâng tầm.
            </h2>
          </div>
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 11,
                width: 1,
                background: 'var(--line)',
              }}
            />
            {[
              {
                y: '2014',
                t: 'Thành lập',
                d: 'Mở xưởng gia công đầu tiên tại Q. Tân Bình với 3 KTV.',
              },
              {
                y: '2016',
                t: 'Đối tác Dentsply',
                d: 'Chính thức trở thành đối tác uỷ quyền Dentsply Sirona.',
              },
              {
                y: '2018',
                t: 'Mở rộng CAD/CAM',
                d: 'Đầu tư 3 máy CNC 5 trục, scanner 3Shape E3.',
              },
              {
                y: '2020',
                t: '500 labo đối tác',
                d: 'Phủ sóng 63 tỉnh thành, ký hợp tác chuỗi nha khoa lớn.',
              },
              {
                y: '2023',
                t: 'Chứng nhận ISO 13485',
                d: 'Đạt chuẩn ISO 13485 về thiết bị y tế.',
              },
              {
                y: '2026',
                t: 'Digital Center 2.0',
                d: 'Ra mắt nền tảng đặt case online, AI thiết kế.',
              },
            ].map((e, i, a) => {
              const last = i === a.length - 1;
              return (
                <div
                  key={e.y}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 1.2fr',
                    gap: 32,
                    paddingBottom: 40,
                    position: 'relative',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: -35,
                      top: 6,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#fff',
                      border: `2px solid ${last ? 'var(--gold)' : 'var(--accent)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: last ? 'var(--gold)' : 'var(--accent)',
                      }}
                    />
                  </div>
                  <div className="display" style={{ fontSize: 30, fontWeight: 500 }}>
                    {e.y}
                  </div>
                  <h3 className="display" style={{ fontSize: 18, margin: 0, fontWeight: 600 }}>
                    {e.t}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'var(--ink-500)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {e.d}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

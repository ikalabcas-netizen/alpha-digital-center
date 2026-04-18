import { PageHero } from '@/components/layout/PageHero';

const IMG = {
  team: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1400&q=80',
};

const JOBS = [
  { d: 'CAD/CAM', t: 'Kỹ thuật viên CAD (2 năm KN)', l: 'TP.HCM', ty: 'Toàn thời gian', s: '18–25 triệu' },
  { d: 'CAD/CAM', t: 'Chuyên viên thiết kế Implant', l: 'TP.HCM', ty: 'Toàn thời gian', s: '22–30 triệu' },
  { d: 'Sản xuất', t: 'KTV vận hành máy CNC 5 trục', l: 'TP.HCM', ty: 'Toàn thời gian', s: '15–20 triệu' },
  { d: 'QC', t: 'Nhân viên kiểm soát chất lượng', l: 'TP.HCM', ty: 'Toàn thời gian', s: '14–18 triệu' },
  { d: 'Kinh doanh', t: 'Sales B2B (Labo đối tác)', l: 'HCM/HN/ĐN', ty: 'Toàn thời gian', s: '15tr + hoa hồng' },
  { d: 'Marketing', t: 'Content Marketing B2B', l: 'TP.HCM', ty: 'Toàn thời gian', s: '12–18 triệu' },
];

export default function TuyenDungPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers · Tuyển dụng"
        title="Cùng xây dựng"
        serif="tương lai"
        tail="nha khoa số."
        subtitle="Alpha Digital Center đang mở rộng đội ngũ — tìm những con người yêu nghề, thích học và dám làm khác."
        image={IMG.team}
      />

      {/* Job list */}
      <section style={{ padding: '120px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span className="eyebrow">Vị trí đang tuyển</span>
            </div>
            <h2
              className="display"
              style={{ fontSize: 'clamp(28px, 3vw, 42px)', margin: 0 }}
            >
              {JOBS.length} vị trí{' '}
              <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                chờ bạn
              </span>
              .
            </h2>
          </div>
          <div>
            {JOBS.map((j, i, a) => (
              <a
                key={j.t}
                href="#"
                className="jr"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr 180px 160px 40px',
                  gap: 24,
                  alignItems: 'center',
                  padding: '26px 0',
                  borderTop: '1px solid var(--line)',
                  borderBottom: i === a.length - 1 ? '1px solid var(--line)' : 'none',
                  color: 'var(--ink-900)',
                  cursor: 'pointer',
                }}
              >
                <div className="eyebrow" style={{ fontSize: 11 }}>
                  {j.d}
                </div>
                <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>
                  {j.t}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>
                  📍 {j.l} · {j.ty}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: 'var(--accent-600)',
                    fontWeight: 600,
                  }}
                >
                  {j.s}
                </div>
                <div style={{ textAlign: 'right', color: 'var(--ink-400)' }}>↗</div>
              </a>
            ))}
          </div>
          <style>{`@media (max-width:900px){ .jr { grid-template-columns: 1fr !important; gap: 6px !important; } .jr > div:last-child { display: none; } }`}</style>
        </div>
      </section>

      {/* Why Alpha */}
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
            className="pk"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: 72,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
                  Why Alpha
                </span>
              </div>
              <h2
                className="display"
                style={{
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  margin: '0 0 24px',
                  color: '#fff',
                }}
              >
                Đầu tư vào{' '}
                <span className="serif" style={{ color: 'var(--gold-light)', fontWeight: 400 }}>
                  con người
                </span>
                , không chỉ máy móc.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.8,
                }}
              >
                Đội ngũ 45 người, gần 70% gắn bó trên 5 năm — đó là thước đo của chúng tôi.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              {[
                {
                  t: 'Lương cạnh tranh',
                  d: 'Base + thưởng sản lượng + thưởng QC. Review 6 tháng.',
                },
                {
                  t: 'Đào tạo quốc tế',
                  d: 'Workshop từ Dentsply, Ivoclar. Đi IDS Cologne 2 năm/lần.',
                },
                {
                  t: 'Bảo hiểm cao cấp',
                  d: 'BHYT + BHNT + khám sức khoẻ định kỳ tại FV.',
                },
                {
                  t: 'Môi trường chuyên nghiệp',
                  d: 'Xưởng sản xuất đạt ISO 13485. Máy móc thế hệ mới.',
                },
              ].map((p) => (
                <div key={p.t} style={{ background: 'var(--navy-900)', padding: 32 }}>
                  <h3
                    className="display"
                    style={{
                      fontSize: 18,
                      margin: '0 0 10px',
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  >
                    {p.t}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {p.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){ .pk { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
      </section>
    </>
  );
}

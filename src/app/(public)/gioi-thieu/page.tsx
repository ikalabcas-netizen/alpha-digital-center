import { colors, fonts } from '@/lib/styles';
import type { Metadata } from 'next';
import {
  Target,
  Eye,
  Heart,
  Cpu,
  ScanLine,
  Printer,
  Users,
  Award,
  Clock,
  MapPin,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Giới thiệu | Alpha Digital Center',
  description:
    'Alpha Digital Center - Trung tâm gia công nha khoa kỹ thuật số hàng đầu. Công nghệ CAD/CAM, máy phay CNC 5 trục, scanner 3D, in 3D.',
};

const MILESTONES = [
  { year: '2014', event: 'Thành lập Alpha Dental Lab tại TP.HCM' },
  { year: '2017', event: 'Đầu tư máy phay CNC 5 trục đầu tiên' },
  { year: '2019', event: 'Mở rộng xưởng sản xuất, nâng cấp hệ thống CAD/CAM' },
  { year: '2021', event: 'Đổi tên thành Alpha Digital Center, tập trung công nghệ số' },
  { year: '2023', event: 'Đạt mốc 500+ labo đối tác, 50,000+ sản phẩm/năm' },
];

const EQUIPMENT = [
  {
    icon: Cpu,
    name: 'Máy phay CNC 5 trục',
    description:
      'Hệ thống phay CNC 5 trục từ Amann Girrbach và VHF, độ chính xác lên đến 5 micron. Phay Zirconia, CoCr, Titanium, PMMA.',
  },
  {
    icon: ScanLine,
    name: 'Scanner 3D',
    description:
      'Scanner 3Shape và Medit Lab chính xác cao. Số hóa mẫu nhanh chóng, hỗ trợ file STL/PLY từ mọi hệ thống.',
  },
  {
    icon: Printer,
    name: 'Máy in 3D',
    description:
      'In 3D nhựa và kim loại. In mẫu, khay chỉnh nha, hướng dẫn phẫu thuật Implant, wax-up kỹ thuật số.',
  },
];

const VALUES = [
  {
    icon: Target,
    title: 'Sứ mệnh',
    description:
      'Nâng tầm chất lượng phục hình nha khoa tại Việt Nam thông qua ứng dụng công nghệ số và vật liệu chính hãng. Đồng hành cùng các labo tạo ra những sản phẩm tốt nhất cho bệnh nhân.',
  },
  {
    icon: Eye,
    title: 'Tầm nhìn',
    description:
      'Trở thành trung tâm gia công nha khoa kỹ thuật số hàng đầu khu vực phía Nam. Tiên phong ứng dụng công nghệ CAD/CAM và in 3D trong gia công nha khoa.',
  },
  {
    icon: Heart,
    title: 'Giá trị cốt lõi',
    description:
      'Chất lượng - Uy tín - Chuyên nghiệp. Mọi sản phẩm đều được kiểm soát chất lượng nghiêm ngặt trước khi giao đến tay khách hàng.',
  },
];

export default function GioiThieuPage() {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #ecfeff 0%, #f0f9ff 40%, #e0f2fe 100%)',
          padding: '60px 0 48px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              background: colors.primaryBg,
              color: colors.primaryHover,
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Về chúng tôi
          </div>
          <h1
            style={{
              fontFamily: fonts.heading,
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 800,
              color: colors.textPrimary,
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Alpha <span style={{ color: colors.primary }}>Digital Center</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              lineHeight: 1.7,
              maxWidth: 650,
              margin: '0 auto',
            }}
          >
            Trung tâm gia công bán thành phẩm nha khoa kỹ thuật số hàng đầu.
            Ứng dụng công nghệ CAD/CAM, in 3D và vật liệu chính hãng từ các hãng
            hàng đầu thế giới.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section style={{ padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  style={{
                    background: colors.cardBg,
                    borderRadius: 16,
                    padding: 28,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: colors.primaryUltraLight,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={22} color={colors.primary} />
                  </div>
                  <h2
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 18,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: 10,
                    }}
                  >
                    {val.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      lineHeight: 1.65,
                    }}
                  >
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company History */}
      <section style={{ padding: '56px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: fonts.heading,
                fontSize: 28,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 8,
              }}
            >
              Hành trình phát triển
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Hơn 10 năm xây dựng và phát triển
            </p>
          </div>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {MILESTONES.map((ms, i) => (
              <div
                key={ms.year}
                style={{
                  display: 'flex',
                  gap: 20,
                  marginBottom: i < MILESTONES.length - 1 ? 28 : 0,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    minWidth: 60,
                    padding: '6px 0',
                    textAlign: 'center',
                    background: colors.primaryBg,
                    color: colors.primaryHover,
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: fonts.heading,
                  }}
                >
                  {ms.year}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 1.5,
                    borderLeft: `2px solid ${colors.border}`,
                    paddingLeft: 20,
                  }}
                >
                  {ms.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment & Technology */}
      <section style={{ padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: fonts.heading,
                fontSize: 28,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 8,
              }}
            >
              Trang thiết bị & Công nghệ
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Đầu tư hệ thống máy móc hiện đại, đảm bảo độ chính xác và chất lượng cao nhất
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {EQUIPMENT.map((eq) => {
              const Icon = eq.icon;
              return (
                <div
                  key={eq.name}
                  style={{
                    background: colors.cardBg,
                    borderRadius: 16,
                    padding: 28,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: 'linear-gradient(135deg, #ecfeff, #cffafe)',
                      borderRadius: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px',
                    }}
                  >
                    <Icon size={28} color={colors.primary} />
                  </div>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 17,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: 10,
                    }}
                  >
                    {eq.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      lineHeight: 1.65,
                    }}
                  >
                    {eq.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '56px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: fonts.heading,
                fontSize: 28,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 8,
              }}
            >
              Đội ngũ của chúng tôi
            </h2>
            <p
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                maxWidth: 550,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Đội ngũ kỹ thuật viên giỏi, nhiều năm kinh nghiệm, thường xuyên cập nhật
              công nghệ và kỹ thuật mới nhất trong lĩnh vực nha khoa.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20,
            }}
          >
            {[
              { icon: Users, title: 'Kỹ thuật viên CAD/CAM', count: '8+' },
              { icon: Award, title: 'Kỹ thuật viên labo', count: '15+' },
              { icon: Clock, title: 'Kinh doanh & CSKH', count: '6+' },
              { icon: Cpu, title: 'QC & Quản lý', count: '4+' },
            ].map((team) => {
              const Icon = team.icon;
              return (
                <div
                  key={team.title}
                  style={{
                    background: colors.pageBg,
                    borderRadius: 14,
                    padding: 24,
                    textAlign: 'center',
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Icon
                    size={28}
                    color={colors.primary}
                    style={{ marginBottom: 12 }}
                  />
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      fontFamily: fonts.heading,
                      color: colors.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {team.count}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textSecondary }}>
                    {team.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Address */}
      <section style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              borderRadius: 20,
              padding: '40px 36px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPin size={26} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: 6,
                }}
              >
                Địa chỉ xưởng sản xuất
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                242/12 Phạm Văn Hai, Phường 5, Quận Tân Bình, TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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
  title: 'Gioi thieu | Alpha Digital Center',
  description:
    'Alpha Digital Center - Trung tam gia cong nha khoa ky thuat so hang dau. Cong nghe CAD/CAM, may phay CNC 5 truc, scanner 3D, in 3D.',
};

const MILESTONES = [
  { year: '2014', event: 'Thanh lap Alpha Dental Lab tai TP.HCM' },
  { year: '2017', event: 'Dau tu may phay CNC 5 truc dau tien' },
  { year: '2019', event: 'Mo rong xuong san xuat, nang cap he thong CAD/CAM' },
  { year: '2021', event: 'Doi ten thanh Alpha Digital Center, tap trung cong nghe so' },
  { year: '2023', event: 'Dat moc 500+ labo doi tac, 50,000+ san pham/nam' },
];

const EQUIPMENT = [
  {
    icon: Cpu,
    name: 'May phay CNC 5 truc',
    description:
      'He thong phay CNC 5 truc tu Amann Girrbach va VHF, do chinh xac len den 5 micron. Phay Zirconia, CoCr, Titanium, PMMA.',
  },
  {
    icon: ScanLine,
    name: 'Scanner 3D',
    description:
      'Scanner 3Shape va Medit Lab chinh xac cao. So hoa mau nhanh chong, ho tro file STL/PLY tu moi he thong.',
  },
  {
    icon: Printer,
    name: 'May in 3D',
    description:
      'In 3D nhua va kim loai. In mau, khay chinh nha, huong dan phau thuat Implant, wax-up ky thuat so.',
  },
];

const VALUES = [
  {
    icon: Target,
    title: 'Su menh',
    description:
      'Nang tam chat luong phuc hinh nha khoa tai Viet Nam thong qua ung dung cong nghe so va vat lieu chinh hang. Dong hanh cung cac labo tao ra nhung san pham tot nhat cho benh nhan.',
  },
  {
    icon: Eye,
    title: 'Tam nhin',
    description:
      'Tro thanh trung tam gia cong nha khoa ky thuat so hang dau khu vuc phia Nam. Tien phong ung dung cong nghe CAD/CAM va in 3D trong gia cong nha khoa.',
  },
  {
    icon: Heart,
    title: 'Gia tri cot loi',
    description:
      'Chat luong - Uy tin - Chuyen nghiep. Moi san pham deu duoc kiem soat chat luong nghiem ngat truoc khi giao den tay khach hang.',
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
            Ve chung toi
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
            Trung tam gia cong ban thanh pham nha khoa ky thuat so hang dau.
            Ung dung cong nghe CAD/CAM, in 3D va vat lieu chinh hang tu cac hang
            hang dau the gioi.
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
              Hanh trinh phat trien
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Hon 10 nam xay dung va phat trien
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
              Trang thiet bi & Cong nghe
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Dau tu he thong may moc hien dai, dam bao do chinh xac va chat luong cao nhat
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
              Doi ngu cua chung toi
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
              Doi ngu ky thuat vien gioi, nhieu nam kinh nghiem, thuong xuyen cap nhat
              cong nghe va ky thuat moi nhat trong linh vuc nha khoa.
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
              { icon: Users, title: 'Ky thuat vien CAD/CAM', count: '8+' },
              { icon: Award, title: 'Ky thuat vien labo', count: '15+' },
              { icon: Clock, title: 'Kinh doanh & CSKH', count: '6+' },
              { icon: Cpu, title: 'QC & Quan ly', count: '4+' },
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
                Dia chi xuong san xuat
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                242/12 Pham Van Hai, Phuong 5, Quan Tan Binh, TP. Ho Chi Minh
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

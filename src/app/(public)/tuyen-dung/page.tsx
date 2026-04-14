import { colors, fonts } from '@/lib/styles';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Briefcase,
  MapPin,
  Clock,
  Heart,
  GraduationCap,
  TrendingUp,
  Users,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tuyen dung | Alpha Digital Center',
  description:
    'Co hoi nghe nghiep tai Alpha Digital Center. Gia nhap doi ngu ky thuat vien nha khoa chuyen nghiep, moi truong lam viec hien dai.',
};

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Phat trien nghe nghiep',
    description: 'Co hoi hoc hoi va phat trien ky nang voi cong nghe CAD/CAM, in 3D tien tien nhat.',
  },
  {
    icon: Heart,
    title: 'Phuc loi hap dan',
    description: 'Luong canh tranh, BHXH day du, thuong le tet, team building hang quy.',
  },
  {
    icon: GraduationCap,
    title: 'Dao tao lien tuc',
    description: 'Chuong trinh dao tao noi bo, tham gia hoi nghi chuyen nganh, cap nhat cong nghe moi.',
  },
  {
    icon: Users,
    title: 'Moi truong than thien',
    description: 'Doi ngu tre, nang dong, ho tro lan nhau. Van hoa lam viec coi mo va sang tao.',
  },
];

const PLACEHOLDER_JOBS = [
  {
    title: 'Ky thuat vien CAD/CAM',
    type: 'Toan thoi gian',
    location: 'Tan Binh, TP.HCM',
    description:
      'Thiet ke phuc hinh nha khoa tren phan mem CAD. Yeu cau: co kinh nghiem 3Shape, Exocad hoac tuong duong.',
  },
  {
    title: 'Ky thuat vien Labo',
    type: 'Toan thoi gian',
    location: 'Tan Binh, TP.HCM',
    description:
      'Gia cong, dap su, hoan thien san pham phuc hinh. Yeu cau: tot nghiep chuyen nganh, co kinh nghiem 1+ nam.',
  },
  {
    title: 'Nhan vien Kinh doanh',
    type: 'Toan thoi gian',
    location: 'Tan Binh, TP.HCM',
    description:
      'Cham soc khach hang, tu van san pham, phat trien khach hang moi. Yeu cau: giao tiep tot, uu tien co kien thuc nha khoa.',
  },
];

export default function TuyenDungPage() {
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
            Co hoi nghe nghiep
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
            Tuyen Dung
          </h1>
          <p
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Gia nhap Alpha Digital Center - noi ban duoc phat trien nghe nghiep
            trong moi truong cong nghe hien dai, doi ngu chuyen nghiep va nhiet huyet.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2
              style={{
                fontFamily: fonts.heading,
                fontSize: 24,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 8,
              }}
            >
              Tai sao nen gia nhap Alpha?
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Nhung gia tri chung toi mang den cho thanh vien
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  style={{
                    background: colors.cardBg,
                    borderRadius: 16,
                    padding: 24,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    textAlign: 'center',
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
                      margin: '0 auto 14px',
                    }}
                  >
                    <Icon size={22} color={colors.primary} />
                  </div>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 15,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: 8,
                    }}
                  >
                    {b.title}
                  </h3>
                  <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section style={{ padding: '56px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2
              style={{
                fontFamily: fonts.heading,
                fontSize: 24,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 8,
              }}
            >
              Vi tri dang tuyen
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Khám phá cac co hoi phu hop voi ban
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gap: 16,
              maxWidth: 760,
              margin: '0 auto',
            }}
          >
            {PLACEHOLDER_JOBS.map((job) => (
              <div
                key={job.title}
                style={{
                  background: colors.pageBg,
                  borderRadius: 14,
                  padding: 24,
                  border: `1px solid ${colors.border}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: 17,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      margin: 0,
                    }}
                  >
                    {job.title}
                  </h3>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      background: colors.primaryBg,
                      color: colors.primaryHover,
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Dang tuyen
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: colors.textMuted,
                    }}
                  >
                    <Briefcase size={13} /> {job.type}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: colors.textMuted,
                    }}
                  >
                    <MapPin size={13} /> {job.location}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Encouragement */}
      <section
        style={{
          padding: '56px 0',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <h2
            style={{
              fontFamily: fonts.heading,
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 10,
            }}
          >
            San sang gia nhap?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Gui CV cua ban qua email hoac lien he truc tiep. Chung toi luon chao don
            nhung ung vien co dam me voi nghe nha khoa.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:info@alphacenter.vn" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '12px 28px',
                  background: '#fff',
                  color: colors.primary,
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Mail size={16} /> Gui CV qua email
              </button>
            </a>
            <Link href="/lien-he" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '12px 28px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Lien he <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

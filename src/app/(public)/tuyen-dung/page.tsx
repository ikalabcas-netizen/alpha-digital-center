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
  title: 'Tuyển dụng | Alpha Digital Center',
  description:
    'Cơ hội nghề nghiệp tại Alpha Digital Center. Gia nhập đội ngũ kỹ thuật viên nha khoa chuyên nghiệp, môi trường làm việc hiện đại.',
};

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Phát triển nghề nghiệp',
    description: 'Cơ hội học hỏi và phát triển kỹ năng với công nghệ CAD/CAM, in 3D tiên tiến nhất.',
  },
  {
    icon: Heart,
    title: 'Phúc lợi hấp dẫn',
    description: 'Lương cạnh tranh, BHXH đầy đủ, thưởng lễ tết, team building hàng quý.',
  },
  {
    icon: GraduationCap,
    title: 'Đào tạo liên tục',
    description: 'Chương trình đào tạo nội bộ, tham gia hội nghị chuyên ngành, cập nhật công nghệ mới.',
  },
  {
    icon: Users,
    title: 'Môi trường thân thiện',
    description: 'Đội ngũ trẻ, năng động, hỗ trợ lẫn nhau. Văn hóa làm việc cởi mở và sáng tạo.',
  },
];

const PLACEHOLDER_JOBS = [
  {
    title: 'Kỹ thuật viên CAD/CAM',
    type: 'Toàn thời gian',
    location: 'Tân Bình, TP.HCM',
    description:
      'Thiết kế phục hình nha khoa trên phần mềm CAD. Yêu cầu: có kinh nghiệm 3Shape, Exocad hoặc tương đương.',
  },
  {
    title: 'Kỹ thuật viên Labo',
    type: 'Toàn thời gian',
    location: 'Tân Bình, TP.HCM',
    description:
      'Gia công, đắp sứ, hoàn thiện sản phẩm phục hình. Yêu cầu: tốt nghiệp chuyên ngành, có kinh nghiệm 1+ năm.',
  },
  {
    title: 'Nhân viên Kinh doanh',
    type: 'Toàn thời gian',
    location: 'Tân Bình, TP.HCM',
    description:
      'Chăm sóc khách hàng, tư vấn sản phẩm, phát triển khách hàng mới. Yêu cầu: giao tiếp tốt, ưu tiên có kiến thức nha khoa.',
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
            Cơ hội nghề nghiệp
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
            Tuyển Dụng
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
            Gia nhập Alpha Digital Center - nơi bạn được phát triển nghề nghiệp
            trong môi trường công nghệ hiện đại, đội ngũ chuyên nghiệp và nhiệt huyết.
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
              Tại sao nên gia nhập Alpha?
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Những giá trị chúng tôi mang đến cho thành viên
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
              Vị trí đang tuyển
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>
              Khám phá các cơ hội phù hợp với bạn
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
                    Đang tuyển
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
            Sẵn sàng gia nhập?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Gửi CV của bạn qua email hoặc liên hệ trực tiếp. Chúng tôi luôn chào đón
            những ứng viên có đam mê với nghề nha khoa.
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
                <Mail size={16} /> Gửi CV qua email
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
                Liên hệ <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

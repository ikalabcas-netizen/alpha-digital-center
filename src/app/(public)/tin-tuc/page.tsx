'use client';

import { useState } from 'react';
import { colors, fonts } from '@/lib/styles';
import Link from 'next/link';
import {
  Newspaper,
  BookOpen,
  Cpu,
  Users,
  ArrowRight,
  Calendar,
  Tag,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'Tat ca', icon: Newspaper },
  { key: 'tin-tuc', label: 'Tin tuc', icon: Newspaper },
  { key: 'kien-thuc', label: 'Kien thuc', icon: BookOpen },
  { key: 'cong-nghe', label: 'Cong nghe', icon: Cpu },
  { key: 'tuyen-dung', label: 'Tuyen dung', icon: Users },
];

const PLACEHOLDER_POSTS = [
  {
    slug: 'su-khac-biet-zirconia-emax',
    title: 'Su khac biet giua Zirconia va E.Max - Lua chon nao phu hop?',
    excerpt:
      'Tim hieu uu nhuoc diem cua su Zirconia va su ep E.Max de tu van dung cho tung truong hop lam sang.',
    category: 'kien-thuc',
    date: '10/04/2026',
    readTime: '5 phut doc',
  },
  {
    slug: 'cong-nghe-cadcam-nha-khoa',
    title: 'Cong nghe CAD/CAM trong nha khoa - Xu huong tat yeu',
    excerpt:
      'Ung dung cong nghe CAD/CAM giup nang cao do chinh xac, rut ngan thoi gian san xuat phuc hinh nha khoa.',
    category: 'cong-nghe',
    date: '05/04/2026',
    readTime: '7 phut doc',
  },
  {
    slug: 'huong-dan-chon-mau-rang',
    title: 'Huong dan chon mau rang chinh xac cho phuc hinh su',
    excerpt:
      'Cac buoc lay mau rang dung ky thuat, luu y anh sang, goc nhin de dat ket qua tham my tot nhat.',
    category: 'kien-thuc',
    date: '28/03/2026',
    readTime: '4 phut doc',
  },
  {
    slug: 'alpha-tham-gia-trienlam-2026',
    title: 'Alpha Digital Center tham gia Trien lam Nha khoa Quoc te 2026',
    excerpt:
      'Chung toi hang hanh gioi thieu cac giai phap gia cong ky thuat so tai trien lam nha khoa lon nhat nam.',
    category: 'tin-tuc',
    date: '20/03/2026',
    readTime: '3 phut doc',
  },
  {
    slug: 'in-3d-trong-nha-khoa',
    title: 'Ung dung in 3D trong nha khoa - Tu mau den san pham',
    excerpt:
      'Cong nghe in 3D dang thay doi cach lam viec cua labo nha khoa. Tu in mau, khay chinh nha den huong dan phau thuat.',
    category: 'cong-nghe',
    date: '15/03/2026',
    readTime: '6 phut doc',
  },
  {
    slug: 'tuyen-ky-thuat-vien-cadcam',
    title: 'Tuyen dung: Ky thuat vien CAD/CAM - Co hoi phat trien nghe nghiep',
    excerpt:
      'Alpha Digital Center tuyen ky thuat vien CAD/CAM co kinh nghiem. Moi truong lam viec hien dai, phuc loi hap dan.',
    category: 'tuyen-dung',
    date: '10/03/2026',
    readTime: '2 phut doc',
  },
];

export default function TinTucPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts =
    activeCategory === 'all'
      ? PLACEHOLDER_POSTS
      : PLACEHOLDER_POSTS.filter((p) => p.category === activeCategory);

  const getCategoryLabel = (key: string) => {
    return CATEGORIES.find((c) => c.key === key)?.label || key;
  };

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
            Blog
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
            Tin tuc & <span style={{ color: colors.primary }}>Kien thuc</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              lineHeight: 1.7,
              maxWidth: 550,
              margin: '0 auto',
            }}
          >
            Cap nhat cac tin tuc moi nhat, kien thuc chuyen nganh va xu huong
            cong nghe trong linh vuc nha khoa.
          </p>
        </div>
      </section>

      {/* Category Filter + Posts */}
      <section style={{ padding: '40px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 32,
              overflowX: 'auto',
              paddingBottom: 4,
              flexWrap: 'wrap',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: fonts.body,
                    cursor: 'pointer',
                    border: isActive
                      ? '1px solid transparent'
                      : `1px solid ${colors.border}`,
                    background: isActive
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      : colors.cardBg,
                    color: isActive ? '#fff' : colors.textSecondary,
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 0',
              }}
            >
              <Newspaper size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14, color: colors.textSecondary }}>
                Chua co bai viet nao trong danh muc nay.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/tin-tuc/${post.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <article
                    style={{
                      background: colors.cardBg,
                      borderRadius: 16,
                      border: `1px solid ${colors.border}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Placeholder image area */}
                    <div
                      style={{
                        height: 160,
                        background: 'linear-gradient(135deg, #ecfeff, #e0f2fe)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BookOpen size={36} color={colors.primaryLight} />
                    </div>

                    <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Category & Date */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 12,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 10px',
                            background: colors.primaryBg,
                            color: colors.primaryHover,
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          <Tag size={10} />
                          {getCategoryLabel(post.category)}
                        </span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            color: colors.textMuted,
                          }}
                        >
                          <Calendar size={11} />
                          {post.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        style={{
                          fontFamily: fonts.heading,
                          fontSize: 16,
                          fontWeight: 700,
                          color: colors.textPrimary,
                          lineHeight: 1.4,
                          marginBottom: 10,
                        }}
                      >
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p
                        style={{
                          fontSize: 13,
                          color: colors.textSecondary,
                          lineHeight: 1.6,
                          flex: 1,
                          marginBottom: 14,
                        }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: 12, color: colors.textMuted }}>
                          {post.readTime}
                        </span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 13,
                            fontWeight: 600,
                            color: colors.primary,
                          }}
                        >
                          Doc them <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

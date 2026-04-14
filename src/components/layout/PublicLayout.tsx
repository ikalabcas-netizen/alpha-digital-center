'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin, Mail } from 'lucide-react';
import { colors, fonts, transitions } from '@/lib/styles';

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/san-pham', label: 'Sản phẩm' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/bao-hanh', label: 'Kiểm tra bảo hành' },
  { href: '/tuyen-dung', label: 'Tuyển dụng' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top info bar */}
      <div
        style={{
          background: '#0B1929',
          padding: '6px 0',
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Phone size={12} /> 0378 422 496
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Mail size={12} /> info@alphacenter.vn
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} /> 242/12 Phạm Văn Hai, Q. Tân Bình, TP.HCM
          </span>
        </div>
      </div>

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: scrolled ? 'rgba(255,255,255,0.95)' : colors.white,
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
          transition: transitions.medium,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
          }}
        >
          {/* Logo */}
          <Link href="/">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.white,
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                A
              </div>
              <div>
                <div
                  style={{
                    fontFamily: fonts.heading,
                    fontWeight: 700,
                    fontSize: 16,
                    color: colors.textPrimary,
                    lineHeight: 1.2,
                  }}
                >
                  Alpha Digital Center
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.primary,
                    fontWeight: 500,
                  }}
                >
                  Digital Service For Lab
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <span
                    style={{
                      padding: '6px 12px',
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      color: active ? colors.primary : colors.textSecondary,
                      borderBottom: active ? `2px solid ${colors.primary}` : '2px solid transparent',
                      transition: transitions.fast,
                      fontFamily: fonts.body,
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: colors.textPrimary,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div
            className="mobile-nav"
            style={{
              padding: '8px 24px 16px',
              borderTop: `1px solid ${colors.border}`,
              animation: 'slideUp 0.2s ease',
            }}
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    style={{
                      padding: '10px 0',
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      color: active ? colors.primary : colors.textSecondary,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main content */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* Footer */}
      <footer
        style={{
          background: '#0B1929',
          color: 'rgba(255,255,255,0.8)',
          padding: '48px 0 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 32,
          }}
        >
          {/* Company info */}
          <div>
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: 18,
                color: colors.white,
                marginBottom: 12,
              }}
            >
              Alpha Digital Center
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              Chuyên gia công các sản phẩm nha khoa bán thành phẩm cho labo.
              Ứng dụng công nghệ CAD/CAM và in 3D hiện đại.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: colors.white,
                marginBottom: 12,
              }}
            >
              Liên kết nhanh
            </div>
            {NAV_LINKS.slice(0, 5).map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  style={{
                    fontSize: 13,
                    padding: '4px 0',
                    color: 'rgba(255,255,255,0.6)',
                    transition: transitions.fast,
                  }}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: colors.white,
                marginBottom: 12,
              }}
            >
              Liên hệ
            </div>
            <div style={{ fontSize: 13, lineHeight: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} color={colors.primary} />
                242/12 Phạm Văn Hai, Q. Tân Bình, TP.HCM
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} color={colors.primary} />
                0378 422 496
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} color={colors.primary} />
                info@alphacenter.vn
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: '32px auto 0',
            padding: '16px 24px 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          &copy; {new Date().getFullYear()} Alpha Digital Center. All rights reserved.
        </div>
      </footer>

      {/* Responsive CSS */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

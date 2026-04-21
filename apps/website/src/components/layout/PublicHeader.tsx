'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { PUBLIC_NAV } from './publicNav';
import { colors, fonts, transitions } from '@/lib/styles';

type Props = {
  logoUrl: string | null;
  companyName: string;
  tagline: string;
};

export function PublicHeader({ logoUrl, companyName, tagline }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(255,255,255,0.92)' : '#fff',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${colors.border}`,
        transition: transitions.medium,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 76,
        }}
      >
        <Link href="/" aria-label="Trang chủ">
          <Logo size={40} imageUrl={logoUrl} companyName={companyName} tagline={tagline} />
        </Link>

        <nav className="dn" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {PUBLIC_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '10px 14px',
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? colors.ink900 : colors.ink500,
                  position: 'relative',
                  fontFamily: fonts.body,
                }}
              >
                {item.label}
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: 14,
                      right: 14,
                      height: 2,
                      background: colors.accent,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="dn" style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/bao-hanh"
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              fontSize: 13.5,
              fontWeight: 600,
              color: colors.ink900,
              transition: transitions.fast,
            }}
          >
            Kiểm tra BH
          </Link>
          <Link
            href="/lien-he"
            style={{
              padding: '10px 20px',
              borderRadius: 999,
              background: colors.accent,
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 600,
              transition: transitions.fast,
            }}
          >
            Báo giá →
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="mb"
          aria-label="Mở menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            padding: 6,
            cursor: 'pointer',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            padding: '12px 20px 20px',
            background: '#fff',
          }}
        >
          {PUBLIC_NAV.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  fontSize: 15,
                  borderBottom: `1px solid ${colors.borderSoft}`,
                  color: active ? colors.accent600 : colors.ink700,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {r.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .dn { display: none !important; }
          .mb { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}

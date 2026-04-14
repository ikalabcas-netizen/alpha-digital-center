'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { colors, fonts, transitions } from '@/lib/styles';

export interface NavItem {
  to: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
}

interface ResponsiveShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  accentColor?: string;
  roleLabel?: string;
  profilePath?: string;
  logoSrc?: string;
}

const SIDEBAR_WIDTH = 220;
const MOBILE_SIDEBAR_WIDTH = 260;
const MOBILE_BREAKPOINT = 768;

export function ResponsiveShell({
  children,
  navItems,
  accentColor = colors.primary,
  roleLabel = 'Admin',
  logoSrc,
}: ResponsiveShellProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(path + '/'),
    [pathname]
  );

  const renderNav = () => (
    <nav style={{ padding: '12px 8px', flex: 1 }}>
      {navItems.map((item) => {
        const active = isActive(item.to);
        const Icon = item.icon;
        return (
          <Link key={item.to} href={item.to}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                marginBottom: 2,
                borderRadius: 8,
                borderLeft: `2px solid ${active ? accentColor : 'transparent'}`,
                background: active ? `${accentColor}22` : 'transparent',
                color: active ? accentColor : 'rgba(255,255,255,0.55)',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                fontFamily: fonts.body,
                transition: transitions.fast,
                cursor: 'pointer',
              }}
            >
              <Icon size={18} color={active ? accentColor : 'rgba(255,255,255,0.55)'} />
              {item.label}
            </div>
          </Link>
        );
      })}
    </nav>
  );

  // Desktop sidebar
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside
          style={{
            width: SIDEBAR_WIDTH,
            background: colors.sidebarGradient,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: '20px 16px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {logoSrc ? (
              <img src={logoSrc} alt="Alpha Digital Center" style={{ height: 32 }} />
            ) : (
              <div
                style={{
                  color: colors.white,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: fonts.heading,
                }}
              >
                Alpha Digital Center
              </div>
            )}
            <div
              style={{
                fontSize: 11,
                color: accentColor,
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {roleLabel}
            </div>
          </div>

          {renderNav()}
        </aside>

        <main
          style={{
            marginLeft: SIDEBAR_WIDTH,
            flex: 1,
            padding: '28px 32px',
            minHeight: '100vh',
          }}
        >
          {children}
        </main>
      </div>
    );
  }

  // Mobile with drawer
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          background: colors.sidebarGradient,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          zIndex: 40,
        }}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: colors.white,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <Menu size={22} />
        </button>
        <span
          style={{
            color: colors.white,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: fonts.heading,
            marginLeft: 12,
          }}
        >
          Alpha Digital Center
        </span>
      </div>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 45,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Drawer */}
      {drawerOpen && (
        <aside
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: MOBILE_SIDEBAR_WIDTH,
            background: colors.sidebarGradient,
            zIndex: 50,
            animation: 'slideInLeft 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span
              style={{
                color: colors.white,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: fonts.heading,
              }}
            >
              Alpha Digital Center
            </span>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.white,
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>
          {renderNav()}
        </aside>
      )}

      <main style={{ paddingTop: 52 + 16, padding: '68px 16px 16px' }}>
        {children}
      </main>
    </div>
  );
}

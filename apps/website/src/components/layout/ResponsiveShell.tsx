'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
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
  // User footer
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onSignOut?: () => void;
}

const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const MOBILE_SIDEBAR_WIDTH = 260;
const MOBILE_BREAKPOINT = 768;
const COLLAPSE_STORAGE_KEY = 'adc-sidebar-collapsed';

export function ResponsiveShell({
  children,
  navItems,
  accentColor = colors.primary,
  roleLabel = 'Admin',
  logoSrc,
  userName,
  userEmail,
  userImage,
  onSignOut,
}: ResponsiveShellProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSE_STORAGE_KEY);
      if (stored === '1') setCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0');
      } catch {}
      return next;
    });
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // ESC to close mobile drawer
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

  const renderNav = (showLabels: boolean) => (
    <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
      {navItems.map((item) => {
        const active = isActive(item.to);
        const Icon = item.icon;
        return (
          <Link key={item.to} href={item.to} title={showLabels ? undefined : item.label}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: showLabels ? '9px 12px' : '10px 0',
                justifyContent: showLabels ? 'flex-start' : 'center',
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
              {showLabels && item.label}
            </div>
          </Link>
        );
      })}
    </nav>
  );

  const renderUserFooter = (showLabels: boolean) => {
    if (!userName && !userEmail && !userImage) return null;
    const displayName = userName || userEmail || '';
    return (
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: showLabels ? '12px 12px 16px' : '10px 8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: showLabels ? 'flex-start' : 'center',
          }}
          title={showLabels ? undefined : displayName}
        >
          {userImage ? (
            <img
              src={userImage}
              alt=""
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: `2px solid ${accentColor}`,
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `${accentColor}33`,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: fonts.heading,
                flexShrink: 0,
              }}
            >
              {(displayName[0] || '?').toUpperCase()}
            </div>
          )}
          {showLabels && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.white,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userName || 'User'}
              </div>
              {userEmail && userEmail !== userName && (
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userEmail}
                </div>
              )}
            </div>
          )}
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            title={showLabels ? undefined : 'Đăng xuất'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: showLabels ? '7px 10px' : '7px 0',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: fonts.body,
              transition: transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(225,29,72,0.15)';
              e.currentTarget.style.color = '#fca5a5';
              e.currentTarget.style.borderColor = 'rgba(225,29,72,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <LogOut size={13} />
            {showLabels && 'Đăng xuất'}
          </button>
        )}
      </div>
    );
  };

  // Desktop sidebar
  if (!isMobile) {
    const currentWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside
          style={{
            width: currentWidth,
            background: colors.sidebarGradient,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            transition: 'width 0.2s ease',
            overflow: 'hidden',
          }}
        >
          {/* Header: Hamburger + Logo/Role */}
          <div
            style={{
              padding: collapsed ? '16px 0' : '16px 14px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              gap: 8,
            }}
          >
            {!collapsed && (
              <div style={{ minWidth: 0, flex: 1 }}>
                {logoSrc ? (
                  <img src={logoSrc} alt="Alpha Digital Center" style={{ height: 28 }} />
                ) : (
                  <div
                    style={{
                      color: colors.white,
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: fonts.heading,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Alpha Digital Center
                  </div>
                )}
                <div
                  style={{
                    fontSize: 11,
                    color: accentColor,
                    marginTop: 2,
                    fontWeight: 500,
                  }}
                >
                  {roleLabel}
                </div>
              </div>
            )}
            <button
              onClick={toggleCollapsed}
              title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: transitions.fast,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = colors.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {renderNav(!collapsed)}
          {renderUserFooter(!collapsed)}
        </aside>

        <main
          style={{
            marginLeft: currentWidth,
            flex: 1,
            padding: '28px 32px',
            minHeight: '100vh',
            transition: 'margin-left 0.2s ease',
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
          {renderNav(true)}
          {renderUserFooter(true)}
        </aside>
      )}

      <main style={{ paddingTop: 52 + 16, padding: '68px 16px 16px' }}>
        {children}
      </main>
    </div>
  );
}

'use client';

import { useSession, signOut } from 'next-auth/react';
import { ResponsiveShell } from '@/components/layout/ResponsiveShell';
import { getNoiboNav, getRoleLabel } from '@/lib/noibo/nav';
import type { HrRole } from '@/lib/noibo/auth';
import { colors, fonts } from '@/lib/styles';

interface NoiboShellProps {
  children: React.ReactNode;
  hrRole: HrRole | null;
  fullName?: string;
  workEmail?: string;
  avatarUrl?: string;
}

export function NoiboShell({
  children,
  hrRole,
  fullName,
  workEmail,
  avatarUrl,
}: NoiboShellProps) {
  const { data: session } = useSession();

  const displayName = fullName || session?.user?.name || undefined;
  const displayEmail = workEmail || session?.user?.email || undefined;
  const displayImage = avatarUrl || session?.user?.image || undefined;

  return (
    <ResponsiveShell
      navItems={getNoiboNav(hrRole)}
      accentColor={colors.accent}
      roleLabel={`Nội bộ · ${getRoleLabel(hrRole)}`}
      userName={displayName}
      userEmail={displayEmail}
      userImage={displayImage}
      onSignOut={() => signOut({ callbackUrl: '/admin/login' })}
    >
      {children}
    </ResponsiveShell>
  );
}

export function NoiboCenterMessage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: 8,
        fontFamily: fonts.body,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
        {title}
      </div>
      {description && (
        <div style={{ fontSize: 14, color: colors.textLight, maxWidth: 480 }}>{description}</div>
      )}
    </div>
  );
}

'use client';

import { useSession, signOut } from 'next-auth/react';
import { Clock, Mail } from 'lucide-react';
import { colors, fonts } from '@/lib/styles';
import { Button } from '@/components/ui/Button';

export default function PendingPage() {
  const { data: session } = useSession();
  const name = session?.user?.name || session?.user?.email || '';
  const email = session?.user?.email || '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #ecfeff 0%, #f0f9ff 40%, #e0f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(6,182,212,0.2)',
          boxShadow: '0 8px 40px rgba(6,182,212,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          padding: '36px 32px 28px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: '#fef3c7',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#d97706',
          }}
        >
          <Clock size={30} />
        </div>

        <h1
          style={{
            fontFamily: fonts.heading,
            fontSize: 20,
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: 8,
          }}
        >
          Tài khoản đang chờ duyệt
        </h1>
        <p
          style={{
            fontSize: 13.5,
            color: colors.textSecondary,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Cảm ơn {name ? (<strong>{name}</strong>) : 'bạn'} đã đăng nhập.
          Super Admin sẽ xem xét yêu cầu và cấp quyền truy cập sớm nhất.
        </p>

        {email && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              background: '#f0f9ff',
              borderRadius: 10,
              fontSize: 13,
              color: colors.textSecondary,
              marginBottom: 24,
              border: '1px solid #e0f2fe',
            }}
          >
            <Mail size={14} />
            {email}
          </div>
        )}

        <div
          style={{
            padding: '12px 16px',
            background: '#fffbeb',
            borderRadius: 10,
            border: '1px solid #fef3c7',
            fontSize: 12.5,
            color: '#92400e',
            lineHeight: 1.55,
            marginBottom: 20,
            textAlign: 'left',
          }}
        >
          Vui lòng liên hệ quản trị viên của Alpha Digital Center để được duyệt nhanh,
          hoặc đợi thông báo qua email.
        </div>

        <Button
          variant="secondary"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{ width: '100%' }}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}

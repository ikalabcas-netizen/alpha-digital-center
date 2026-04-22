'use client';

import { useState } from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { apiPost } from '@/lib/api-client';
import { colors, fonts, transitions } from '@/lib/styles';

interface AttendanceRow {
  id: string;
  clockInAt: string | null;
  clockOutAt: string | null;
  status: string;
  workMinutes: number | null;
}

interface ClockInButtonProps {
  initialAttendance: AttendanceRow | null;
  shiftLabel?: string | null;
  onChange?: (row: AttendanceRow) => void;
}

type Phase = 'idle' | 'getting_location' | 'submitting' | 'success' | 'error';

export function ClockInButton({ initialAttendance, shiftLabel, onChange }: ClockInButtonProps) {
  const [attendance, setAttendance] = useState<AttendanceRow | null>(initialAttendance);
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState<string>('');

  const isClockedIn = !!attendance?.clockInAt;
  const isClockedOut = !!attendance?.clockOutAt;
  const action = isClockedOut ? 'done' : isClockedIn ? 'clock_out' : 'clock_in';

  async function submitClockIn(lat: number | null, lng: number | null) {
    setPhase('submitting');
    setMessage(lat === null ? 'Đang gửi (không có vị trí)...' : 'Đang xác thực vị trí và IP...');

    const url = action === 'clock_in' ? '/api/noibo/attendance/clock-in' : '/api/noibo/attendance/clock-out';
    const result = await apiPost<{ ok: boolean; attendance: AttendanceRow }>(url, { lat, lng });

    setAttendance(result.attendance);
    onChange?.(result.attendance);
    setPhase('success');
    setMessage(action === 'clock_in' ? 'Đã chấm công vào ca.' : 'Đã chấm công ra ca.');
  }

  async function handleClick() {
    if (action === 'done') return;
    setPhase('getting_location');
    setMessage('Đang lấy vị trí...');

    try {
      const position = await getPosition();
      const { latitude: lat, longitude: lng, accuracy } = position.coords;

      if (accuracy > 200) {
        setPhase('error');
        setMessage(`Độ chính xác GPS thấp (${Math.round(accuracy)}m). Hãy ra ngoài trời hoặc bật GPS độ chính xác cao.`);
        return;
      }

      await submitClockIn(lat, lng);
    } catch (e: any) {
      setPhase('error');
      setMessage(e.message || 'Có lỗi xảy ra');
    }
  }

  async function handleSkipGps() {
    try {
      await submitClockIn(null, null);
    } catch (e: any) {
      setPhase('error');
      setMessage(e.message || 'Có lỗi xảy ra');
    }
  }

  return (
    <div
      style={{
        background: colors.cardBg,
        borderRadius: 16,
        border: `1px solid ${colors.border}`,
        padding: 24,
        maxWidth: 480,
        boxShadow: '0 8px 24px rgba(10,22,40,0.06)',
        fontFamily: fonts.body,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Clock size={18} color={colors.accent} />
        <span style={{ fontSize: 13, color: colors.textLight, fontFamily: fonts.mono, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Chấm công hôm nay
        </span>
      </div>

      {shiftLabel && (
        <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 16 }}>
          Ca làm: <strong style={{ color: colors.textPrimary }}>{shiftLabel}</strong>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
        <TimeBlock label="Vào ca" time={attendance?.clockInAt} />
        <div style={{ color: colors.textMuted, fontSize: 18 }}>→</div>
        <TimeBlock label="Ra ca" time={attendance?.clockOutAt} />
      </div>

      {action === 'done' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: `${colors.success}12`,
            color: colors.success,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          Đã hoàn thành ca hôm nay
          {attendance?.workMinutes && ` · ${formatDuration(attendance.workMinutes)}`}
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={phase === 'getting_location' || phase === 'submitting'}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: action === 'clock_in'
              ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent600})`
              : `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
            color: colors.white,
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            cursor: phase === 'idle' || phase === 'success' || phase === 'error' ? 'pointer' : 'wait',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontFamily: fonts.body,
            boxShadow: action === 'clock_in' ? '0 6px 20px rgba(6,182,212,0.35)' : '0 6px 20px rgba(201,169,97,0.35)',
            opacity: phase === 'getting_location' || phase === 'submitting' ? 0.6 : 1,
            transition: transitions.fast,
          }}
        >
          {action === 'clock_in' ? <MapPin size={18} /> : <LogOut size={18} />}
          {phase === 'getting_location'
            ? 'Đang lấy vị trí...'
            : phase === 'submitting'
              ? 'Đang xác thực...'
              : action === 'clock_in'
                ? 'Chấm công VÀO ca'
                : 'Chấm công RA ca'}
        </button>
      )}

      {message && phase !== 'idle' && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 12px',
            borderRadius: 8,
            background: phase === 'error' ? `${colors.danger}10` : phase === 'success' ? `${colors.success}10` : colors.borderSoft,
            color: phase === 'error' ? colors.danger : phase === 'success' ? colors.success : colors.textSecondary,
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          {phase === 'error' && <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />}
          <span>{message}</span>
        </div>
      )}

      {phase === 'error' && action !== 'done' && (
        <button
          onClick={handleSkipGps}
          style={{
            marginTop: 10,
            width: '100%',
            padding: '10px 16px',
            background: 'transparent',
            color: colors.textSecondary,
            border: `1px dashed ${colors.border}`,
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: fonts.body,
          }}
          title="Chỉ hoạt động khi OFFICE_GEOFENCES chưa cấu hình trên server (test mode)"
        >
          Bỏ qua GPS — chấm công (test mode)
        </button>
      )}

      <div style={{ marginTop: 14, fontSize: 11, color: colors.textMuted, lineHeight: 1.5 }}>
        Yêu cầu cho phép trình duyệt truy cập vị trí (GPS) và đang ở trong mạng văn phòng.
      </div>
    </div>
  );
}

function TimeBlock({ label, time }: { label: string; time?: string | null }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: fonts.mono }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: fonts.heading, color: time ? colors.textPrimary : colors.textMuted, marginTop: 4 }}>
        {time ? formatTimeVN(time) : '--:--'}
      </div>
    </div>
  );
}

function formatTimeVN(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  });
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Trình duyệt không hỗ trợ geolocation'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, (err) => {
      const messages: Record<number, string> = {
        1: 'Bạn đã từ chối quyền truy cập vị trí. Vào cài đặt trình duyệt để cho phép.',
        2: 'Không xác định được vị trí (GPS yếu hoặc thiết bị offline)',
        3: 'Hết thời gian chờ lấy vị trí',
      };
      reject(new Error(messages[err.code] || err.message));
    }, { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 });
  });
}

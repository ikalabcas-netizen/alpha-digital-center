/**
 * Helper xử lý ca làm + chấm công.
 */

export interface ShiftWindow {
  startMin: number; // số phút từ 00:00
  endMin: number;
  breakMin: number;
}

/** "HH:mm" → số phút từ 00:00 */
export function parseHHmm(s: string): number {
  const [h, m] = s.split(':').map((x) => parseInt(x, 10));
  return (h ?? 0) * 60 + (m ?? 0);
}

export function formatHHmm(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Số phút từ 00:00 của giờ địa phương (Asia/Ho_Chi_Minh).
 * Note: server có thể chạy UTC — convert qua getHours/getMinutes của Date object
 * (dùng Intl.DateTimeFormat để đúng múi giờ VN).
 */
export function localMinutesVN(date: Date): number {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const hh = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
  const mm = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  return hh * 60 + mm;
}

/** Date đầu ngày (00:00) của ngày làm việc theo VN. */
export function vnDateOnly(date: Date): Date {
  // Lấy chuỗi YYYY-MM-DD theo VN, parse về midnight UTC
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return new Date(`${y}-${m}-${d}T00:00:00.000Z`);
}

export interface AttendanceStatusInput {
  shiftStart: string; // "HH:mm"
  shiftEnd: string;
  lateAfterMin: number;
  clockInAt: Date;
  clockOutAt?: Date | null;
}

export interface AttendanceStatusResult {
  status: 'present' | 'late' | 'half_day';
  workMinutes: number | null;
  lateMinutes: number;
}

/**
 * Tính status + số phút làm việc từ shift template + clock in/out.
 */
export function computeAttendanceStatus(input: AttendanceStatusInput): AttendanceStatusResult {
  const startMin = parseHHmm(input.shiftStart);
  const endMin = parseHHmm(input.shiftEnd);
  const clockInMin = localMinutesVN(input.clockInAt);
  const lateMin = Math.max(0, clockInMin - startMin);

  let workMinutes: number | null = null;
  if (input.clockOutAt) {
    const clockOutMin = localMinutesVN(input.clockOutAt);
    workMinutes = Math.max(0, clockOutMin - clockInMin);
  }

  const expectedShiftMin = endMin - startMin;
  const isHalf = workMinutes !== null && workMinutes < expectedShiftMin / 2;

  return {
    status: isHalf ? 'half_day' : lateMin > input.lateAfterMin ? 'late' : 'present',
    workMinutes,
    lateMinutes: lateMin,
  };
}

/** Số ngày giữa 2 ngày (inclusive), bỏ qua thời gian. */
export function inclusiveDayCount(start: Date, end: Date): number {
  const ms = vnDateOnly(end).getTime() - vnDateOnly(start).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

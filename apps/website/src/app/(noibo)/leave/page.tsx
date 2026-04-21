'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { CalendarOff, Plus, X } from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import {
  colors,
  fonts,
  cardStyle,
  pageTitle,
  pageSubtitle,
  primaryButton,
  secondaryButton,
  inputStyle,
} from '@/lib/styles';

type LeaveRequest = {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  attachmentUrl: string | null;
  status: string;
  rejectReason: string | null;
  approvedAt: string | null;
  createdAt: string;
  approver?: { id: string; fullName: string } | null;
};

const LEAVE_TYPES: Array<{ value: string; label: string }> = [
  { value: 'annual', label: 'Phép năm' },
  { value: 'sick', label: 'Ốm' },
  { value: 'unpaid', label: 'Không lương' },
  { value: 'maternity', label: 'Thai sản' },
  { value: 'wedding', label: 'Cưới hỏi' },
  { value: 'bereavement', label: 'Tang lễ' },
  { value: 'other', label: 'Khác' },
];

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Chờ duyệt', bg: '#fffbeb', color: '#d97706' },
  approved: { label: 'Đã duyệt', bg: '#f0fdf4', color: '#16a34a' },
  rejected: { label: 'Từ chối', bg: '#fff1f2', color: '#e11d48' },
  cancelled: { label: 'Đã hủy', bg: '#f8fafc', color: '#94a3b8' },
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textSecondary,
  marginBottom: 4,
  display: 'block',
};

export default function LeavePage() {
  const [items, setItems] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<Partial<LeaveRequest> | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await apiGet<LeaveRequest[]>('/api/noibo/leave?scope=mine'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (!creating) return;
    try {
      const payload = {
        leaveType: creating.leaveType || 'annual',
        startDate: creating.startDate,
        endDate: creating.endDate,
        totalDays: creating.totalDays,
        reason: creating.reason || null,
        attachmentUrl: creating.attachmentUrl || null,
      };
      if (!payload.startDate || !payload.endDate) {
        alert('Cần ngày bắt đầu và kết thúc');
        return;
      }
      await apiPost('/api/noibo/leave', payload);
      setCreating(null);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function cancel(it: LeaveRequest) {
    if (!confirm('Hủy đơn nghỉ này?')) return;
    try {
      await apiDelete(`/api/noibo/leave/${it.id}`);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <h1 style={pageTitle}>Nghỉ phép</h1>
          <div style={pageSubtitle}>Đơn xin nghỉ của bạn — manager trực tiếp sẽ duyệt</div>
        </div>
        <button
          style={primaryButton}
          onClick={() =>
            setCreating({
              leaveType: 'annual',
              startDate: new Date().toISOString().slice(0, 10),
              endDate: new Date().toISOString().slice(0, 10),
            })
          }
        >
          <Plus size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
          Tạo đơn nghỉ
        </button>
      </div>

      {loading ? (
        <div style={{ color: colors.textLight }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
          <CalendarOff size={28} style={{ marginBottom: 8, opacity: 0.5 }} />
          <div>Chưa có đơn nghỉ nào.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it) => {
            const status = STATUS_LABELS[it.status] ?? { label: it.status, bg: '#f8fafc', color: '#64748b' };
            const typeLabel = LEAVE_TYPES.find((t) => t.value === it.leaveType)?.label ?? it.leaveType;
            return (
              <div key={it.id} style={{ ...cardStyle, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                        {typeLabel}
                      </span>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 6 }}>
                      Từ <strong>{formatDate(it.startDate)}</strong> đến <strong>{formatDate(it.endDate)}</strong> ·{' '}
                      <strong>{it.totalDays}</strong> ngày
                    </div>
                    {it.reason && (
                      <div style={{ fontSize: 13, color: colors.textLight, marginTop: 6, lineHeight: 1.5 }}>
                        Lý do: {it.reason}
                      </div>
                    )}
                    {it.status === 'rejected' && it.rejectReason && (
                      <div style={{ marginTop: 8, padding: '8px 10px', background: '#fff1f2', borderRadius: 8, fontSize: 12, color: colors.danger }}>
                        Lý do từ chối: {it.rejectReason}
                      </div>
                    )}
                    {it.approver && it.approvedAt && (
                      <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>
                        {it.status === 'approved' ? 'Duyệt' : 'Phản hồi'} bởi {it.approver.fullName} vào {formatDateTime(it.approvedAt)}
                      </div>
                    )}
                  </div>
                  {it.status === 'pending' && (
                    <button
                      onClick={() => cancel(it)}
                      title="Hủy đơn"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight, padding: 6 }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {creating && (
        <Modal isOpen onClose={() => setCreating(null)} title="Tạo đơn nghỉ" maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <span style={labelStyle}>Loại nghỉ *</span>
              <select
                style={inputStyle as any}
                value={creating.leaveType || 'annual'}
                onChange={(e) => setCreating({ ...creating, leaveType: e.target.value })}
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={labelStyle}>Từ ngày *</span>
                <input
                  style={inputStyle}
                  type="date"
                  value={creating.startDate ?? ''}
                  onChange={(e) => setCreating({ ...creating, startDate: e.target.value })}
                />
              </div>
              <div>
                <span style={labelStyle}>Đến ngày *</span>
                <input
                  style={inputStyle}
                  type="date"
                  value={creating.endDate ?? ''}
                  onChange={(e) => setCreating({ ...creating, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <span style={labelStyle}>Số ngày (mặc định tự tính, để 0.5 nếu nửa ngày)</span>
              <input
                style={inputStyle}
                type="number"
                step="0.5"
                min="0.5"
                value={creating.totalDays ?? ''}
                placeholder="Tự tính từ khoảng ngày"
                onChange={(e) => setCreating({ ...creating, totalDays: e.target.value ? parseFloat(e.target.value) : undefined })}
              />
            </div>
            <div>
              <span style={labelStyle}>Lý do</span>
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: 'vertical', fontFamily: fonts.body }}
                value={creating.reason ?? ''}
                onChange={(e) => setCreating({ ...creating, reason: e.target.value })}
              />
            </div>
            <div>
              <span style={labelStyle}>Tệp đính kèm (URL — vd giấy khám bệnh)</span>
              <input
                style={inputStyle}
                value={creating.attachmentUrl ?? ''}
                onChange={(e) => setCreating({ ...creating, attachmentUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 6, justifyContent: 'flex-end' }}>
              <button style={secondaryButton} onClick={() => setCreating(null)}>
                Hủy
              </button>
              <button style={primaryButton} onClick={submit}>
                Gửi đơn
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formatDateTime(d: string) {
  return new Date(d).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}

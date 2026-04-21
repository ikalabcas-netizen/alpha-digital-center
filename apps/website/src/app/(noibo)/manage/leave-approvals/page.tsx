'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Check, X as XIcon, Inbox } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api-client';
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
  employee: {
    id: string;
    fullName: string;
    employeeCode: string;
    department: { name: string };
    position: { title: string };
  };
  approver?: { id: string; fullName: string } | null;
};

const LEAVE_TYPE_LABELS: Record<string, string> = {
  annual: 'Phép năm',
  sick: 'Ốm',
  unpaid: 'Không lương',
  maternity: 'Thai sản',
  wedding: 'Cưới hỏi',
  bereavement: 'Tang lễ',
  other: 'Khác',
};

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Chờ duyệt', bg: '#fffbeb', color: '#d97706' },
  approved: { label: 'Đã duyệt', bg: '#f0fdf4', color: '#16a34a' },
  rejected: { label: 'Từ chối', bg: '#fff1f2', color: '#e11d48' },
  cancelled: { label: 'Đã hủy', bg: '#f8fafc', color: '#94a3b8' },
};

export default function LeaveApprovalsPage() {
  const [items, setItems] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [scope, setScope] = useState<'team' | 'all'>('team');
  const [rejecting, setRejecting] = useState<LeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ scope });
      if (filter === 'pending') params.set('status', 'pending');
      const url = `/api/noibo/leave?${params.toString()}`;
      setItems(await apiGet<LeaveRequest[]>(url));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, scope]);

  async function approve(it: LeaveRequest) {
    try {
      await apiPost(`/api/noibo/leave/${it.id}/approve`, { decision: 'approved' });
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function reject() {
    if (!rejecting || !rejectReason.trim()) {
      alert('Cần lý do từ chối');
      return;
    }
    try {
      await apiPost(`/api/noibo/leave/${rejecting.id}/approve`, {
        decision: 'rejected',
        rejectReason: rejectReason.trim(),
      });
      setRejecting(null);
      setRejectReason('');
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={pageTitle}>Duyệt nghỉ phép</h1>
          <div style={pageSubtitle}>
            {pendingCount > 0 ? `${pendingCount} đơn đang chờ bạn xử lý` : 'Không có đơn nào chờ duyệt'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select style={inputStyle as any} value={scope} onChange={(e) => setScope(e.target.value as any)}>
            <option value="team">Team trực tiếp</option>
            <option value="all">Toàn công ty (HR Admin)</option>
          </select>
          <select style={inputStyle as any} value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="pending">Đang chờ</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ color: colors.textLight }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ ...cardStyle, padding: 48, textAlign: 'center', color: colors.textLight }}>
          <Inbox size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
          <div>Không có đơn nghỉ phép nào.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it) => {
            const status = STATUS_LABELS[it.status] ?? STATUS_LABELS.pending!;
            const typeLabel = LEAVE_TYPE_LABELS[it.leaveType] ?? it.leaveType;
            const isPending = it.status === 'pending';
            return (
              <div key={it.id} style={{ ...cardStyle, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                        {it.employee.fullName}
                      </span>
                      <code style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>
                        {it.employee.employeeCode}
                      </code>
                      <span style={{ fontSize: 12, color: colors.textLight }}>
                        · {it.employee.position.title} · {it.employee.department.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 8 }}>
                      <strong>{typeLabel}</strong> · từ <strong>{formatDate(it.startDate)}</strong> đến{' '}
                      <strong>{formatDate(it.endDate)}</strong> ({it.totalDays} ngày)
                    </div>
                    {it.reason && (
                      <div style={{ fontSize: 13, color: colors.textLight, marginTop: 6, lineHeight: 1.5 }}>
                        <span style={{ color: colors.textMuted }}>Lý do:</span> {it.reason}
                      </div>
                    )}
                    {it.attachmentUrl && (
                      <a
                        href={it.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-block', marginTop: 6, fontSize: 12, color: colors.accent, textDecoration: 'none' }}
                      >
                        📎 Xem tệp đính kèm
                      </a>
                    )}
                    {it.status === 'rejected' && it.rejectReason && (
                      <div style={{ marginTop: 8, padding: '8px 10px', background: '#fff1f2', borderRadius: 8, fontSize: 12, color: colors.danger }}>
                        Lý do từ chối: {it.rejectReason}
                      </div>
                    )}
                    {it.approver && it.approvedAt && (
                      <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>
                        Phản hồi bởi {it.approver.fullName} vào {formatDateTime(it.approvedAt)}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                      Gửi lúc {formatDateTime(it.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 12px',
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 600,
                        background: status.bg,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </span>
                    {isPending && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => approve(it)}
                          title="Duyệt"
                          style={{
                            padding: '6px 12px',
                            background: colors.success,
                            color: colors.white,
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Check size={13} />
                          Duyệt
                        </button>
                        <button
                          onClick={() => {
                            setRejecting(it);
                            setRejectReason('');
                          }}
                          title="Từ chối"
                          style={{
                            padding: '6px 12px',
                            background: '#fff1f2',
                            color: colors.danger,
                            border: `1px solid ${colors.danger}30`,
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <XIcon size={13} />
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejecting && (
        <Modal
          isOpen
          onClose={() => {
            setRejecting(null);
            setRejectReason('');
          }}
          title={`Từ chối đơn của ${rejecting.employee.fullName}`}
          maxWidth={460}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>
              {LEAVE_TYPE_LABELS[rejecting.leaveType]} · {formatDate(rejecting.startDate)} → {formatDate(rejecting.endDate)} ({rejecting.totalDays} ngày)
            </div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' }}>
                Lý do từ chối *
              </span>
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: 'vertical', fontFamily: fonts.body }}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Vd: Trùng lịch sản xuất quan trọng, vui lòng dời sang tuần sau..."
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                style={secondaryButton}
                onClick={() => {
                  setRejecting(null);
                  setRejectReason('');
                }}
              >
                Hủy
              </button>
              <button
                style={{
                  ...primaryButton,
                  background: `linear-gradient(135deg, ${colors.danger}, #be123c)`,
                  boxShadow: '0 4px 16px rgba(225,29,72,0.25)',
                }}
                onClick={reject}
              >
                Từ chối đơn
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

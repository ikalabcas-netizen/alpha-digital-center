'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  inputStyle,
  pageTitle,
  transitions,
  getBadgeStyle,
} from '@/lib/styles';
import {
  Phone,
  Mail,
  Calendar,
  UserCheck,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { apiGet, apiPut, ApiError } from '@/lib/api-client';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted';
type LeadSource = 'website' | 'facebook' | 'zalo' | 'phone';

interface Lead {
  id: string;
  contactName: string;
  labName: string | null;
  phone: string | null;
  email: string | null;
  source: LeadSource;
  status: LeadStatus;
  message: string | null;
  createdAt: string;
  assignedTo: string | null;
  productInterest: string | null;
}

const salesReps = ['Tú', 'Thái', 'Hưng', 'Nghĩa', 'Trí', 'Thanh Nhàn'];

const statusTabs: { key: LeadStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'new', label: 'Mới' },
  { key: 'contacted', label: 'Đã liên hệ' },
  { key: 'qualified', label: 'Đủ điều kiện' },
  { key: 'converted', label: 'Đã chuyển đổi' },
];

const sourceFilters: { key: LeadSource | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'website', label: 'Website' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'zalo', label: 'Zalo' },
  { key: 'phone', label: 'Điện thoại' },
];

const sourceBadgeColors: Record<LeadSource, { bg: string; color: string }> = {
  website: { bg: '#ecfeff', color: '#0891b2' },
  facebook: { bg: '#eff6ff', color: '#2563eb' },
  zalo: { bg: '#f0fdf4', color: '#16a34a' },
  phone: { bg: '#fffbeb', color: '#d97706' },
};

const sourceLabels: Record<LeadSource, string> = {
  website: 'Website',
  facebook: 'Facebook',
  zalo: 'Zalo',
  phone: 'Điện thoại',
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  qualified: 'Đủ điều kiện',
  converted: 'Đã chuyển đổi',
};

function formatVnDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Lead[]>('/api/admin/leads');
      setLeads(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.contactName.toLowerCase().includes(q) ||
        (lead.labName || '').toLowerCase().includes(q) ||
        (lead.phone || '').includes(q) ||
        (lead.email || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const patchLead = async (leadId: string, patch: Partial<Pick<Lead, 'status' | 'assignedTo'>>) => {
    const previous = leads;
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...patch } : l)));
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, ...patch } : null));
    }
    try {
      await apiPut(`/api/admin/leads/${leadId}`, patch);
    } catch (e) {
      setLeads(previous);
      if (selectedLead?.id === leadId) {
        setSelectedLead(previous.find((l) => l.id === leadId) || null);
      }
      setError(e instanceof ApiError ? e.message : 'Cập nhật thất bại');
    }
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    patchLead(leadId, { status: newStatus });
  };

  const handleAssign = (leadId: string, rep: string | null) => {
    patchLead(leadId, { assignedTo: rep });
  };

  const openDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={pageTitle}>Quản lý Khách hàng</h1>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colors.primaryBg,
              color: colors.primary,
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 20,
              padding: '2px 12px',
              fontFamily: fonts.body,
            }}
          >
            {leads.length}
          </span>
        </div>
      </div>

      {error && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 16,
            background: colors.dangerBg,
            borderColor: 'rgba(225,29,72,0.2)',
            color: colors.danger,
            fontSize: 13,
            fontFamily: fonts.body,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search
            size={16}
            color={colors.textMuted}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            style={{ ...inputStyle, paddingLeft: 36 }}
            placeholder="Tìm kiếm theo tên, labo, SĐT, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          ...cardStyle,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: 13,
                fontWeight: statusFilter === tab.key ? 600 : 400,
                cursor: 'pointer',
                fontFamily: fonts.body,
                transition: transitions.fast,
                background: statusFilter === tab.key ? colors.primary : 'transparent',
                color: statusFilter === tab.key ? colors.white : colors.textSecondary,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          style={{
            width: 1,
            height: 24,
            background: colors.border,
            flexShrink: 0,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: colors.textMuted, fontFamily: fonts.body }}>
            Nguồn:
          </span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as LeadSource | 'all')}
            style={{
              ...inputStyle,
              width: 'auto',
              padding: '6px 28px 6px 10px',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              cursor: 'pointer',
            }}
          >
            {sourceFilters.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: 13, color: colors.textMuted, fontFamily: fonts.body, marginLeft: 'auto' }}>
          {filteredLeads.length} kết quả
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && (
          <div
            style={{
              ...cardStyle,
              padding: 40,
              textAlign: 'center',
              color: colors.textMuted,
              fontSize: 14,
              fontFamily: fonts.body,
            }}
          >
            Đang tải...
          </div>
        )}
        {!loading && filteredLeads.length === 0 && (
          <div
            style={{
              ...cardStyle,
              padding: 40,
              textAlign: 'center',
              color: colors.textMuted,
              fontSize: 14,
              fontFamily: fonts.body,
            }}
          >
            Không tìm thấy khách hàng nào.
          </div>
        )}
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            style={{
              ...cardStyle,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              cursor: 'pointer',
              transition: transitions.fast,
            }}
            onClick={() => openDetail(lead)}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: colors.primaryBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700,
                fontSize: 15,
                color: colors.primary,
                fontFamily: fonts.heading,
              }}
            >
              {lead.contactName.charAt(0)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontFamily: fonts.body,
                  }}
                >
                  {lead.contactName}
                </span>
                {lead.labName && (
                  <span style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fonts.body }}>
                    - {lead.labName}
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 6,
                  flexWrap: 'wrap',
                }}
              >
                {lead.phone && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: colors.textMuted,
                      fontFamily: fonts.body,
                    }}
                  >
                    <Phone size={12} />
                    {lead.phone}
                  </span>
                )}
                {lead.email && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: colors.textMuted,
                      fontFamily: fonts.body,
                    }}
                  >
                    <Mail size={12} />
                    {lead.email}
                  </span>
                )}
              </div>

              {lead.message && (
                <div
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    fontFamily: fonts.body,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 500,
                  }}
                >
                  {lead.message}
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: sourceBadgeColors[lead.source].bg,
                    color: sourceBadgeColors[lead.source].color,
                    fontFamily: fonts.body,
                  }}
                >
                  {sourceLabels[lead.source]}
                </span>
                <span style={getBadgeStyle(lead.status)}>
                  {statusLabels[lead.status]}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: colors.textMuted,
                  fontFamily: fonts.body,
                }}
              >
                <Calendar size={12} />
                {formatVnDate(lead.createdAt)}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: lead.assignedTo ? colors.textSecondary : colors.warning,
                  fontFamily: fonts.body,
                  fontWeight: 500,
                }}
              >
                <UserCheck size={12} />
                {lead.assignedTo || 'Chưa gán'}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                flexShrink: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                style={{
                  ...inputStyle,
                  width: 'auto',
                  padding: '4px 24px 4px 8px',
                  fontSize: 12,
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 6px center',
                  cursor: 'pointer',
                }}
              >
                <option value="new">Mới</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="qualified">Đủ điều kiện</option>
                <option value="converted">Đã chuyển đổi</option>
              </select>
              <select
                value={lead.assignedTo || ''}
                onChange={(e) => handleAssign(lead.id, e.target.value || null)}
                style={{
                  ...inputStyle,
                  width: 'auto',
                  padding: '4px 24px 4px 8px',
                  fontSize: 12,
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 6px center',
                  cursor: 'pointer',
                }}
              >
                <option value="">Chưa gán</option>
                {salesReps.map((rep) => (
                  <option key={rep} value={rep}>
                    {rep}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết khách hàng"
        maxWidth={560}
      >
        {selectedLead && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: colors.primaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  color: colors.primary,
                  fontFamily: fonts.heading,
                }}
              >
                {selectedLead.contactName.charAt(0)}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontFamily: fonts.body,
                  }}
                >
                  {selectedLead.contactName}
                </div>
                {selectedLead.labName && (
                  <div
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      fontFamily: fonts.body,
                    }}
                  >
                    {selectedLead.labName}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  Điện thoại
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {selectedLead.phone || '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  Email
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {selectedLead.email || '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  Nguồn
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: sourceBadgeColors[selectedLead.source].bg,
                    color: sourceBadgeColors[selectedLead.source].color,
                    fontFamily: fonts.body,
                  }}
                >
                  {sourceLabels[selectedLead.source]}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  Ngày nhận
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {formatVnDate(selectedLead.createdAt)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  Sản phẩm quan tâm
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {selectedLead.productInterest || '—'}
                </div>
              </div>
            </div>

            {selectedLead.message && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 4 }}>
                  Tin nhắn
                </div>
                <div
                  style={{
                    background: colors.pageBg,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 13,
                    color: colors.textPrimary,
                    fontFamily: fonts.body,
                    lineHeight: 1.5,
                  }}
                >
                  {selectedLead.message}
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.textSecondary,
                    marginBottom: 4,
                    fontFamily: fonts.body,
                  }}
                >
                  Trạng thái
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    handleStatusChange(selectedLead.id, e.target.value as LeadStatus)
                  }
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    paddingRight: 28,
                    cursor: 'pointer',
                  }}
                >
                  <option value="new">Mới</option>
                  <option value="contacted">Đã liên hệ</option>
                  <option value="qualified">Đủ điều kiện</option>
                  <option value="converted">Đã chuyển đổi</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.textSecondary,
                    marginBottom: 4,
                    fontFamily: fonts.body,
                  }}
                >
                  Gán cho
                </label>
                <select
                  value={selectedLead.assignedTo || ''}
                  onChange={(e) =>
                    handleAssign(selectedLead.id, e.target.value || null)
                  }
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    paddingRight: 28,
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Chưa gán</option>
                  {salesReps.map((rep) => (
                    <option key={rep} value={rep}>
                      {rep}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

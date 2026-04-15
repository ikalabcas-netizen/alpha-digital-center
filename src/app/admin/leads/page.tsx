'use client';

import React, { useState } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  primaryButton,
  secondaryButton,
  inputStyle,
  pageTitle,
  pageSubtitle,
  transitions,
  getBadgeStyle,
} from '@/lib/styles';
import {
  Users,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  ChevronDown,
  Globe,
  UserCheck,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted';
type LeadSource = 'website' | 'facebook' | 'zalo' | 'phone';

interface Lead {
  id: number;
  contactName: string;
  labName: string;
  phone: string;
  email: string;
  source: LeadSource;
  status: LeadStatus;
  message: string;
  dateReceived: string;
  assignedTo: string | null;
  productInterest: string;
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

const initialLeads: Lead[] = [
  {
    id: 1,
    contactName: 'Nguyễn Văn An',
    labName: 'Nha khoa Sài Gòn Smile',
    phone: '0912 345 678',
    email: 'an.nguyen@saigonsmile.vn',
    source: 'website',
    status: 'new',
    message: 'Tôi muốn tìm hiểu về răng sứ Zirconia và bảng giá cho đơn hàng lớn. Phòng khám chúng tôi đang cần đối tác labo uy tín.',
    dateReceived: '14/04/2026',
    assignedTo: null,
    productInterest: 'Răng sứ Zirconia',
  },
  {
    id: 2,
    contactName: 'Trần Thị Bích',
    labName: 'Nha khoa Kim Cương',
    phone: '0987 654 321',
    email: 'bich.tran@kimcuong.vn',
    source: 'facebook',
    status: 'contacted',
    message: 'Đã thấy quảng cáo trên Facebook, muốn biết thêm về dịch vụ CAD/CAM và thời gian giao hàng.',
    dateReceived: '13/04/2026',
    assignedTo: 'Tú',
    productInterest: 'CAD/CAM',
  },
  {
    id: 3,
    contactName: 'Lê Minh Đức',
    labName: 'Nha khoa Răng Xinh',
    phone: '0903 111 222',
    email: 'duc.le@rangxinh.com',
    source: 'zalo',
    status: 'qualified',
    message: 'Cần báo giá cho 50 đơn vị răng sứ mỗi tháng. Đã làm việc với labo khác nhưng muốn chuyển sang Alpha.',
    dateReceived: '12/04/2026',
    assignedTo: 'Thái',
    productInterest: 'Răng sứ toàn hàm',
  },
  {
    id: 4,
    contactName: 'Phạm Hoàng Nam',
    labName: 'Phòng khám ABC Dental',
    phone: '0976 543 210',
    email: 'nam.pham@abcdental.vn',
    source: 'phone',
    status: 'converted',
    message: 'Đã ký hợp đồng, bắt đầu gửi đơn hàng từ tháng 4.',
    dateReceived: '10/04/2026',
    assignedTo: 'Hưng',
    productInterest: 'Toàn bộ dịch vụ',
  },
  {
    id: 5,
    contactName: 'Võ Thị Cẩm Tú',
    labName: 'Nha khoa Đông Á',
    phone: '0918 876 543',
    email: 'tu.vo@dongadental.vn',
    source: 'website',
    status: 'new',
    message: 'Quan tâm đến công nghệ in 3D cho mô hình nha khoa. Xin gửi tài liệu và bảng giá.',
    dateReceived: '14/04/2026',
    assignedTo: null,
    productInterest: 'In 3D nha khoa',
  },
  {
    id: 6,
    contactName: 'Hoàng Quốc Việt',
    labName: 'Labo Răng Đẹp',
    phone: '0933 222 444',
    email: 'viet.hoang@rangdep.com',
    source: 'facebook',
    status: 'contacted',
    message: 'Đang tìm labo có thể gia công implant abutment tùy chỉnh. Cần gặp để thảo luận.',
    dateReceived: '11/04/2026',
    assignedTo: 'Nghĩa',
    productInterest: 'Implant abutment',
  },
  {
    id: 7,
    contactName: 'Đặng Thanh Sơn',
    labName: 'Nha khoa Thuận An',
    phone: '0945 666 777',
    email: 'son.dang@thuanan.vn',
    source: 'zalo',
    status: 'new',
    message: 'Mới mở phòng khám, cần labo đồng hành lâu dài. Muốn tham quan cơ sở Alpha Digital Center.',
    dateReceived: '13/04/2026',
    assignedTo: null,
    productInterest: 'Tham quan cơ sở',
  },
  {
    id: 8,
    contactName: 'Bùi Văn Khánh',
    labName: 'Nha khoa Quốc Tế',
    phone: '0966 888 999',
    email: 'khanh.bui@quocte.dental',
    source: 'phone',
    status: 'qualified',
    message: 'Đã nhận mẫu thử, chất lượng tốt. Muốn biết thêm về chính sách đại lý và chiết khấu.',
    dateReceived: '09/04/2026',
    assignedTo: 'Trí',
    productInterest: 'Chính sách đại lý',
  },
  {
    id: 9,
    contactName: 'Nguyễn Thị Lan',
    labName: 'Nha khoa Mỹ Đức',
    phone: '0901 333 555',
    email: 'lan.nguyen@myduc.vn',
    source: 'website',
    status: 'contacted',
    message: 'Cần tư vấn về các loại vật liệu làm răng sứ phù hợp cho bệnh nhân lớn tuổi.',
    dateReceived: '12/04/2026',
    assignedTo: 'Thanh Nhàn',
    productInterest: 'Răng sứ cho người già',
  },
  {
    id: 10,
    contactName: 'Trần Quang Huy',
    labName: 'Labo Nha Khoa Miền Nam',
    phone: '0978 111 000',
    email: 'huy.tran@labomiennam.vn',
    source: 'facebook',
    status: 'new',
    message: 'Labo nhỏ đang muốn hợp tác gia công. Hiện tại có khoảng 20-30 case/tháng.',
    dateReceived: '14/04/2026',
    assignedTo: null,
    productInterest: 'Hợp tác gia công',
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.contactName.toLowerCase().includes(q) ||
        lead.labName.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (leadId: number, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAssign = (leadId: number, rep: string | null) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, assignedTo: rep } : l))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, assignedTo: rep } : null));
    }
  };

  const openDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Page Header */}
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

      {/* Search */}
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

      {/* Filter Bar */}
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
        {/* Status Tabs */}
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

        {/* Source Filter */}
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

      {/* Leads List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredLeads.length === 0 && (
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
            {/* Avatar */}
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

            {/* Main Info */}
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
                <span style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fonts.body }}>
                  - {lead.labName}
                </span>
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
              </div>

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
            </div>

            {/* Right Side: Badges + Meta */}
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
                {/* Source badge */}
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
                {/* Status badge */}
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
                {lead.dateReceived}
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

            {/* Actions - stop propagation */}
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

      {/* Detail Modal */}
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
                <div
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    fontFamily: fonts.body,
                  }}
                >
                  {selectedLead.labName}
                </div>
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
                  {selectedLead.phone}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  Email
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {selectedLead.email}
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
                  {selectedLead.dateReceived}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  Sản phẩm quan tâm
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {selectedLead.productInterest}
                </div>
              </div>
            </div>

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

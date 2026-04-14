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

const salesReps = ['Tu', 'Thai', 'Hung', 'Nghia', 'Tri', 'Thanh Nhan'];

const statusTabs: { key: LeadStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tat ca' },
  { key: 'new', label: 'Moi' },
  { key: 'contacted', label: 'Da lien he' },
  { key: 'qualified', label: 'Du dieu kien' },
  { key: 'converted', label: 'Da chuyen doi' },
];

const sourceFilters: { key: LeadSource | 'all'; label: string }[] = [
  { key: 'all', label: 'Tat ca' },
  { key: 'website', label: 'Website' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'zalo', label: 'Zalo' },
  { key: 'phone', label: 'Dien thoai' },
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
  phone: 'Dien thoai',
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'Moi',
  contacted: 'Da lien he',
  qualified: 'Du dieu kien',
  converted: 'Da chuyen doi',
};

const initialLeads: Lead[] = [
  {
    id: 1,
    contactName: 'Nguyen Van An',
    labName: 'Nha khoa Sai Gon Smile',
    phone: '0912 345 678',
    email: 'an.nguyen@saigonsmile.vn',
    source: 'website',
    status: 'new',
    message: 'Toi muon tim hieu ve rang su Zirconia va bang gia cho don hang lon. Phong kham chung toi dang can doi tac labo uy tin.',
    dateReceived: '14/04/2026',
    assignedTo: null,
    productInterest: 'Rang su Zirconia',
  },
  {
    id: 2,
    contactName: 'Tran Thi Bich',
    labName: 'Nha khoa Kim Cuong',
    phone: '0987 654 321',
    email: 'bich.tran@kimcuong.vn',
    source: 'facebook',
    status: 'contacted',
    message: 'Da thay quang cao tren Facebook, muon biet them ve dich vu CAD/CAM va thoi gian giao hang.',
    dateReceived: '13/04/2026',
    assignedTo: 'Tu',
    productInterest: 'CAD/CAM',
  },
  {
    id: 3,
    contactName: 'Le Minh Duc',
    labName: 'Nha khoa Rang Xinh',
    phone: '0903 111 222',
    email: 'duc.le@rangxinh.com',
    source: 'zalo',
    status: 'qualified',
    message: 'Can bao gia cho 50 don vi rang su moi thang. Da lam viec voi labo khac nhung muon chuyen sang Alpha.',
    dateReceived: '12/04/2026',
    assignedTo: 'Thai',
    productInterest: 'Rang su toan ham',
  },
  {
    id: 4,
    contactName: 'Pham Hoang Nam',
    labName: 'Phong kham ABC Dental',
    phone: '0976 543 210',
    email: 'nam.pham@abcdental.vn',
    source: 'phone',
    status: 'converted',
    message: 'Da ky hop dong, bat dau gui don hang tu thang 4.',
    dateReceived: '10/04/2026',
    assignedTo: 'Hung',
    productInterest: 'Toan bo dich vu',
  },
  {
    id: 5,
    contactName: 'Vo Thi Cam Tu',
    labName: 'Nha khoa Dong A',
    phone: '0918 876 543',
    email: 'tu.vo@dongadental.vn',
    source: 'website',
    status: 'new',
    message: 'Quan tam den cong nghe in 3D cho mo hinh nha khoa. Xin gui tai lieu va bang gia.',
    dateReceived: '14/04/2026',
    assignedTo: null,
    productInterest: 'In 3D nha khoa',
  },
  {
    id: 6,
    contactName: 'Hoang Quoc Viet',
    labName: 'Labo Rang Dep',
    phone: '0933 222 444',
    email: 'viet.hoang@rangdep.com',
    source: 'facebook',
    status: 'contacted',
    message: 'Dang tim labo co the gia cong implant abutment tuy chinh. Can gap de thao luan.',
    dateReceived: '11/04/2026',
    assignedTo: 'Nghia',
    productInterest: 'Implant abutment',
  },
  {
    id: 7,
    contactName: 'Dang Thanh Son',
    labName: 'Nha khoa Thuan An',
    phone: '0945 666 777',
    email: 'son.dang@thuanan.vn',
    source: 'zalo',
    status: 'new',
    message: 'Moi mo phong kham, can labo dong hanh lau dai. Muon tham quan co so Alpha Digital Center.',
    dateReceived: '13/04/2026',
    assignedTo: null,
    productInterest: 'Tham quan co so',
  },
  {
    id: 8,
    contactName: 'Bui Van Khanh',
    labName: 'Nha khoa Quoc Te',
    phone: '0966 888 999',
    email: 'khanh.bui@quocte.dental',
    source: 'phone',
    status: 'qualified',
    message: 'Da nhan mau thu, chat luong tot. Muon biet them ve chinh sach dai ly va chiet khau.',
    dateReceived: '09/04/2026',
    assignedTo: 'Tri',
    productInterest: 'Chinh sach dai ly',
  },
  {
    id: 9,
    contactName: 'Nguyen Thi Lan',
    labName: 'Nha khoa My Duc',
    phone: '0901 333 555',
    email: 'lan.nguyen@myduc.vn',
    source: 'website',
    status: 'contacted',
    message: 'Can tu van ve cac loai vat lieu lam rang su phu hop cho benh nhan lon tuoi.',
    dateReceived: '12/04/2026',
    assignedTo: 'Thanh Nhan',
    productInterest: 'Rang su cho nguoi gia',
  },
  {
    id: 10,
    contactName: 'Tran Quang Huy',
    labName: 'Labo Nha Khoa Mien Nam',
    phone: '0978 111 000',
    email: 'huy.tran@labomiennam.vn',
    source: 'facebook',
    status: 'new',
    message: 'Labo nho dang muon hop tac gia cong. Hien tai co khoang 20-30 case/thang.',
    dateReceived: '14/04/2026',
    assignedTo: null,
    productInterest: 'Hop tac gia cong',
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
          <h1 style={pageTitle}>Quan ly Khach hang</h1>
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
            placeholder="Tim kiem theo ten, labo, SDT, email..."
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
            Nguon:
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
          {filteredLeads.length} ket qua
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
            Khong tim thay khach hang nao.
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
                {lead.assignedTo || 'Chua gan'}
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
                <option value="new">Moi</option>
                <option value="contacted">Da lien he</option>
                <option value="qualified">Du dieu kien</option>
                <option value="converted">Da chuyen doi</option>
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
                <option value="">Chua gan</option>
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
        title="Chi tiet khach hang"
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
                  Dien thoai
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
                  Nguon
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
                  Ngay nhan
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {selectedLead.dateReceived}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>
                  San pham quan tam
                </div>
                <div style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {selectedLead.productInterest}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginBottom: 4 }}>
                Tin nhan
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
                  Trang thai
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
                  <option value="new">Moi</option>
                  <option value="contacted">Da lien he</option>
                  <option value="qualified">Du dieu kien</option>
                  <option value="converted">Da chuyen doi</option>
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
                  Gan cho
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
                  <option value="">Chua gan</option>
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
                Dong
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

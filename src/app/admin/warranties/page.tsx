'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Eye,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  colors,
  fonts,
  cardStyle,
  pageTitle,
  pageSubtitle,
  inputStyle,
  transitions,
  getBadgeStyle,
} from '@/lib/styles';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';

// --- Types ---

type WarrantyStatus = 'active' | 'claimed' | 'expired';

interface WarrantyRecord {
  id: string;
  code: string;
  productName: string;
  variant: string;
  labName: string;
  dentist: string;
  patientName: string;
  toothPosition: string;
  shade: string;
  productionDate: string;
  expiryDate: string;
  notes: string;
  status: WarrantyStatus;
}

// --- Constants ---

const WARRANTY_STATUS_STYLES: Record<
  WarrantyStatus,
  { bg: string; color: string; label: string }
> = {
  active: { bg: '#f0fdf4', color: '#16a34a', label: 'Hiệu lực' },
  claimed: { bg: '#fffbeb', color: '#d97706', label: 'Đã claim' },
  expired: { bg: '#fff1f2', color: '#e11d48', label: 'Hết hạn' },
};

const PRODUCTS_LIST = [
  'Zirconia Multilayer Premium',
  'Emax Press',
  'PFM Crown Standard',
  'Hàm tháo lắp nhựa dẻo',
  'Implant Abutment Titanium',
  'Zirconia HT Monolithic',
  'Sứ ép Celtra Press',
  'Hàm khung kim loại',
];

const VARIANT_LIST = [
  'Tiêu chuẩn',
  'Cao cấp',
  'Premium',
  'Siêu trong suốt',
  'Đơn sắc',
  'Đa lớp',
];

const SAMPLE_WARRANTIES: WarrantyRecord[] = [
  {
    id: '1',
    code: 'ADC-2024-00142',
    productName: 'Zirconia Multilayer Premium',
    variant: 'Cao cấp',
    labName: 'Nha khoa Kim Cương',
    dentist: 'BS. Nguyễn Văn An',
    patientName: 'Trần Thị Mai',
    toothPosition: '11, 21',
    shade: 'A2',
    productionDate: '2024-01-15',
    expiryDate: '2034-01-15',
    notes: 'Cầu răng 2 đơn vị, check lại sau 6 tháng.',
    status: 'active',
  },
  {
    id: '2',
    code: 'ADC-2024-00138',
    productName: 'Emax Press',
    variant: 'Premium',
    labName: 'Labo Hoàng Gia',
    dentist: 'BS. Lê Minh Tuấn',
    patientName: 'Phạm Quang Huy',
    toothPosition: '14, 15',
    shade: 'A3',
    productionDate: '2024-01-10',
    expiryDate: '2031-01-10',
    notes: '',
    status: 'active',
  },
  {
    id: '3',
    code: 'ADC-2023-00087',
    productName: 'PFM Crown Standard',
    variant: 'Tiêu chuẩn',
    labName: 'Nha khoa Sài Gòn Smile',
    dentist: 'BS. Trần Hữu Phước',
    patientName: 'Nguyễn Thanh Tùng',
    toothPosition: '36',
    shade: 'B2',
    productionDate: '2023-06-20',
    expiryDate: '2028-06-20',
    notes: 'Mão đơn lẻ.',
    status: 'claimed',
  },
  {
    id: '4',
    code: 'ADC-2022-00034',
    productName: 'Hàm tháo lắp nhựa dẻo',
    variant: 'Tiêu chuẩn',
    labName: 'Phòng khám Đông Á',
    dentist: 'BS. Võ Thị Lan',
    patientName: 'Lê Văn Bình',
    toothPosition: 'Hàm trên toàn bộ',
    shade: 'A3.5',
    productionDate: '2022-03-05',
    expiryDate: '2025-03-05',
    notes: 'Hàm toàn hàm trên.',
    status: 'expired',
  },
  {
    id: '5',
    code: 'ADC-2024-00156',
    productName: 'Implant Abutment Titanium',
    variant: 'Cao cấp',
    labName: 'Nha khoa Quốc Tế',
    dentist: 'BS. Đặng Hoàng Nam',
    patientName: 'Hoàng Minh Châu',
    toothPosition: '46',
    shade: 'A1',
    productionDate: '2024-02-20',
    expiryDate: '2039-02-20',
    notes: 'Implant Osstem, abutment custom titanium.',
    status: 'active',
  },
  {
    id: '6',
    code: 'ADC-2023-00102',
    productName: 'Zirconia HT Monolithic',
    variant: 'Đơn sắc',
    labName: 'Labo Việt Đức',
    dentist: 'BS. Phan Thị Hồng',
    patientName: 'Vũ Đức Minh',
    toothPosition: '25, 26, 27',
    shade: 'A2',
    productionDate: '2023-09-12',
    expiryDate: '2031-09-12',
    notes: 'Cầu 3 đơn vị răng sau.',
    status: 'active',
  },
  {
    id: '7',
    code: 'ADC-2023-00065',
    productName: 'Sứ ép Celtra Press',
    variant: 'Premium',
    labName: 'Nha khoa Ánh Sáng',
    dentist: 'BS. Nguyễn Thị Hạnh',
    patientName: 'Trịnh Văn Khoa',
    toothPosition: '11',
    shade: 'BL2',
    productionDate: '2023-05-08',
    expiryDate: '2030-05-08',
    notes: 'Veneer răng cửa, yêu cầu thẩm mỹ cao.',
    status: 'claimed',
  },
  {
    id: '8',
    code: 'ADC-2021-00018',
    productName: 'PFM Crown Standard',
    variant: 'Tiêu chuẩn',
    labName: 'Phòng khám Bảo Anh',
    dentist: 'BS. Lý Quốc Tuấn',
    patientName: 'Đỗ Thị Thu',
    toothPosition: '46, 47',
    shade: 'C2',
    productionDate: '2021-11-15',
    expiryDate: '2026-11-15',
    notes: '',
    status: 'expired',
  },
];

function generateCode(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `ADC-${year}-${num}`;
}

const EMPTY_FORM: Omit<WarrantyRecord, 'id'> = {
  code: '',
  productName: PRODUCTS_LIST[0],
  variant: VARIANT_LIST[0],
  labName: '',
  dentist: '',
  patientName: '',
  toothPosition: '',
  shade: '',
  productionDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  notes: '',
  status: 'active',
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// --- Component ---

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState<WarrantyRecord[]>(SAMPLE_WARRANTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<WarrantyRecord, 'id'>>(EMPTY_FORM);

  const filtered = useMemo(() => {
    if (!searchQuery) return warranties;
    const q = searchQuery.toLowerCase();
    return warranties.filter(
      (w) =>
        w.code.toLowerCase().includes(q) ||
        w.labName.toLowerCase().includes(q) ||
        w.patientName.toLowerCase().includes(q)
    );
  }, [warranties, searchQuery]);

  const stats = useMemo(() => {
    const counts = { active: 0, claimed: 0, expired: 0 };
    warranties.forEach((w) => {
      counts[w.status]++;
    });
    return counts;
  }, [warranties]);

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, code: generateCode() });
    setModalOpen(true);
  }

  function openEdit(record: WarrantyRecord) {
    setEditingId(record.id);
    setForm({
      code: record.code,
      productName: record.productName,
      variant: record.variant,
      labName: record.labName,
      dentist: record.dentist,
      patientName: record.patientName,
      toothPosition: record.toothPosition,
      shade: record.shade,
      productionDate: record.productionDate,
      expiryDate: record.expiryDate,
      notes: record.notes,
      status: record.status,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (editingId) {
      setWarranties((prev) =>
        prev.map((w) => (w.id === editingId ? { ...w, ...form } : w))
      );
    } else {
      const newRecord: WarrantyRecord = {
        id: Date.now().toString(),
        ...form,
      };
      setWarranties((prev) => [...prev, newRecord]);
    }
    setModalOpen(false);
  }

  const kpiCards: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }[] = [
    {
      label: 'Đang hiệu lực',
      value: stats.active,
      icon: <CheckCircle size={20} />,
      color: colors.success,
      bg: colors.successBg,
    },
    {
      label: 'Đã claim',
      value: stats.claimed,
      icon: <AlertTriangle size={20} />,
      color: colors.warning,
      bg: colors.warningBg,
    },
    {
      label: 'Hết hạn',
      value: stats.expired,
      icon: <Clock size={20} />,
      color: colors.danger,
      bg: colors.dangerBg,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={pageTitle}>Quản lý Bảo hành</h1>
          <p style={pageSubtitle}>
            {warranties.length} phiếu bảo hành trong hệ thống
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Tạo phiếu mới
        </Button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 420 }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.textMuted,
          }}
        />
        <input
          style={{ ...inputStyle, paddingLeft: 36 }}
          placeholder="Tìm theo mã bảo hành, tên labo, tên bệnh nhân..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stats KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              ...cardStyle,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: kpi.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: kpi.color,
                flexShrink: 0,
              }}
            >
              {kpi.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  fontFamily: fonts.heading,
                  lineHeight: 1,
                }}
              >
                {kpi.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginTop: 2,
                }}
              >
                {kpi.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warranty list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((record) => {
          const statusStyle = WARRANTY_STATUS_STYLES[record.status];
          return (
            <div
              key={record.id}
              style={{
                ...cardStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              {/* Left info */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      fontFamily: 'monospace',
                      letterSpacing: 0.5,
                    }}
                  >
                    {record.code}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      background: statusStyle.bg,
                      color: statusStyle.color,
                    }}
                  >
                    {statusStyle.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {record.productName}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
                    fontSize: 12,
                    color: colors.textSecondary,
                  }}
                >
                  <span>
                    <span style={{ fontWeight: 500 }}>Labo:</span> {record.labName}
                  </span>
                  <span>
                    <span style={{ fontWeight: 500 }}>BN:</span> {record.patientName}
                  </span>
                </div>
              </div>

              {/* Date range */}
              <div
                style={{
                  textAlign: 'center',
                  minWidth: 160,
                }}
              >
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>
                  Thời hạn
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    fontWeight: 500,
                  }}
                >
                  {formatDate(record.productionDate)} &rarr; {formatDate(record.expiryDate)}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(record)}
                  style={{
                    background: colors.infoBg,
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 8px',
                    cursor: 'pointer',
                    color: colors.info,
                    transition: transitions.fast,
                  }}
                  title="Xem / Chỉnh sửa"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            ...cardStyle,
            textAlign: 'center',
            padding: '48px 24px',
            color: colors.textMuted,
          }}
        >
          <Shield size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            Không tìm thấy phiếu bảo hành
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Thử thay đổi từ khoá tìm kiếm
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Chỉnh sửa phiếu bảo hành' : 'Tạo phiếu bảo hành mới'}
        maxWidth={540}
      >
        <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
          <Input
            label="Mã bảo hành"
            placeholder="ADC-YYYY-XXXXX"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <div style={{ marginBottom: 12 }}>
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
              Tên sản phẩm
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
            >
              {PRODUCTS_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
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
              Biến thể
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
            >
              {VARIANT_LIST.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Tên labo"
              placeholder="Nhập tên labo"
              value={form.labName}
              onChange={(e) => setForm({ ...form, labName: e.target.value })}
            />
            <Input
              label="Bác sĩ"
              placeholder="Nhập tên bác sĩ"
              value={form.dentist}
              onChange={(e) => setForm({ ...form, dentist: e.target.value })}
            />
          </div>

          <Input
            label="Bệnh nhân"
            placeholder="Nhập tên bệnh nhân"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Vị trí răng"
              placeholder="VD: 11, 21"
              value={form.toothPosition}
              onChange={(e) => setForm({ ...form, toothPosition: e.target.value })}
            />
            <Input
              label="Shade"
              placeholder="VD: A2, BL2"
              value={form.shade}
              onChange={(e) => setForm({ ...form, shade: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Ngày sản xuất"
              type="date"
              value={form.productionDate}
              onChange={(e) => setForm({ ...form, productionDate: e.target.value })}
            />
            <Input
              label="Ngày hết hạn"
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
          </div>

          <Textarea
            label="Ghi chú"
            placeholder="Ghi chú thêm về phiếu bảo hành..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <div style={{ marginBottom: 12 }}>
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
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as WarrantyStatus })
              }
            >
              <option value="active">Hiệu lực</option>
              <option value="claimed">Đã claim</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </div>

        {/* Modal actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            marginTop: 16,
            borderTop: `1px solid ${colors.border}`,
            paddingTop: 16,
          }}
        >
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Huỷ
          </Button>
          <Button onClick={handleSave}>Lưu phiếu bảo hành</Button>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit2,
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
} from '@/lib/styles';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { apiGet, apiPost, apiPut, ApiError } from '@/lib/api-client';

type WarrantyStatus = 'active' | 'claimed' | 'expired';

interface Variant {
  id: string;
  nameVi: string;
}

interface ProductLite {
  id: string;
  nameVi: string;
  variants: Variant[];
}

interface WarrantyRecord {
  id: string;
  warrantyCode: string;
  patientName: string | null;
  dentistName: string | null;
  labName: string | null;
  productId: string | null;
  variantId: string | null;
  product: { id: string; nameVi: string } | null;
  variant: { id: string; nameVi: string } | null;
  teethPositions: string | null;
  shade: string | null;
  productionDate: string;
  warrantyExpiry: string;
  status: WarrantyStatus;
  notes: string | null;
}

interface WarrantyForm {
  warrantyCode: string;
  productId: string;
  variantId: string;
  labName: string;
  dentistName: string;
  patientName: string;
  teethPositions: string;
  shade: string;
  productionDate: string;
  warrantyExpiry: string;
  notes: string;
  status: WarrantyStatus;
}

const WARRANTY_STATUS_STYLES: Record<
  WarrantyStatus,
  { bg: string; color: string; label: string }
> = {
  active: { bg: '#f0fdf4', color: '#16a34a', label: 'Hiệu lực' },
  claimed: { bg: '#fffbeb', color: '#d97706', label: 'Đã claim' },
  expired: { bg: '#fff1f2', color: '#e11d48', label: 'Hết hạn' },
};

function generateCode(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `ADC-${year}-${num}`;
}

const EMPTY_FORM: WarrantyForm = {
  warrantyCode: '',
  productId: '',
  variantId: '',
  labName: '',
  dentistName: '',
  patientName: '',
  teethPositions: '',
  shade: '',
  productionDate: new Date().toISOString().split('T')[0],
  warrantyExpiry: '',
  notes: '',
  status: 'active',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function toDateInputValue(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState<WarrantyRecord[]>([]);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WarrantyForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ws, ps] = await Promise.all([
        apiGet<WarrantyRecord[]>('/api/admin/warranties'),
        apiGet<ProductLite[]>('/api/admin/products'),
      ]);
      setWarranties(ws);
      setProducts(ps);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!searchQuery) return warranties;
    const q = searchQuery.toLowerCase();
    return warranties.filter(
      (w) =>
        w.warrantyCode.toLowerCase().includes(q) ||
        (w.labName || '').toLowerCase().includes(q) ||
        (w.patientName || '').toLowerCase().includes(q)
    );
  }, [warranties, searchQuery]);

  const stats = useMemo(() => {
    const counts = { active: 0, claimed: 0, expired: 0 };
    warranties.forEach((w) => {
      counts[w.status]++;
    });
    return counts;
  }, [warranties]);

  const variantsOfSelected = useMemo(() => {
    const p = products.find((x) => x.id === form.productId);
    return p?.variants || [];
  }, [products, form.productId]);

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, warrantyCode: generateCode() });
    setModalOpen(true);
  }

  function openEdit(record: WarrantyRecord) {
    setEditingId(record.id);
    setForm({
      warrantyCode: record.warrantyCode,
      productId: record.productId || '',
      variantId: record.variantId || '',
      labName: record.labName || '',
      dentistName: record.dentistName || '',
      patientName: record.patientName || '',
      teethPositions: record.teethPositions || '',
      shade: record.shade || '',
      productionDate: toDateInputValue(record.productionDate),
      warrantyExpiry: toDateInputValue(record.warrantyExpiry),
      notes: record.notes || '',
      status: record.status,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.warrantyCode || !form.productionDate || !form.warrantyExpiry) {
      setError('Mã bảo hành, ngày sản xuất và ngày hết hạn là bắt buộc');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      warrantyCode: form.warrantyCode,
      productId: form.productId || null,
      variantId: form.variantId || null,
      labName: form.labName || null,
      dentistName: form.dentistName || null,
      patientName: form.patientName || null,
      teethPositions: form.teethPositions || null,
      shade: form.shade || null,
      productionDate: form.productionDate,
      warrantyExpiry: form.warrantyExpiry,
      notes: form.notes || null,
      status: form.status,
    };
    try {
      if (editingId) {
        await apiPut(`/api/admin/warranties/${editingId}`, payload);
      } else {
        await apiPost('/api/admin/warranties', payload);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
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

      {loading && (
        <div
          style={{
            ...cardStyle,
            textAlign: 'center',
            padding: '48px 24px',
            color: colors.textMuted,
          }}
        >
          Đang tải...
        </div>
      )}

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
                    {record.warrantyCode}
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
                  {record.product?.nameVi || '—'}
                  {record.variant ? ` · ${record.variant.nameVi}` : ''}
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
                  {record.labName && (
                    <span>
                      <span style={{ fontWeight: 500 }}>Labo:</span> {record.labName}
                    </span>
                  )}
                  {record.patientName && (
                    <span>
                      <span style={{ fontWeight: 500 }}>BN:</span> {record.patientName}
                    </span>
                  )}
                </div>
              </div>

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
                  {formatDate(record.productionDate)} &rarr; {formatDate(record.warrantyExpiry)}
                </div>
              </div>

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

      {!loading && filtered.length === 0 && (
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
            {warranties.length === 0 ? 'Chưa có phiếu bảo hành' : 'Không tìm thấy phiếu bảo hành'}
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {warranties.length === 0 ? 'Tạo phiếu mới để bắt đầu' : 'Thử thay đổi từ khoá tìm kiếm'}
          </div>
        </div>
      )}

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
            value={form.warrantyCode}
            onChange={(e) => setForm({ ...form, warrantyCode: e.target.value })}
            disabled={!!editingId}
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
              Sản phẩm
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.productId}
              onChange={(e) =>
                setForm({ ...form, productId: e.target.value, variantId: '' })
              }
            >
              <option value="">— Chọn sản phẩm —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameVi}
                </option>
              ))}
            </select>
          </div>

          {variantsOfSelected.length > 0 && (
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
                value={form.variantId}
                onChange={(e) => setForm({ ...form, variantId: e.target.value })}
              >
                <option value="">— Không chọn —</option>
                {variantsOfSelected.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nameVi}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              value={form.dentistName}
              onChange={(e) => setForm({ ...form, dentistName: e.target.value })}
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
              value={form.teethPositions}
              onChange={(e) => setForm({ ...form, teethPositions: e.target.value })}
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
              value={form.warrantyExpiry}
              onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })}
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
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
            Huỷ
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu phiếu bảo hành'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
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

interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  origin: string;
  warrantyYears: number;
  description: string;
  priceMin: number;
  priceMax: number;
  active: boolean;
}

// --- Sample data ---

const CATEGORIES = ['Tất cả', 'Toàn sứ', 'Sứ ép', 'Kim loại', 'Tháo lắp', 'Implant'];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Zirconia Multilayer Premium',
    category: 'Toàn sứ',
    material: 'Zirconia',
    origin: 'Đức',
    warrantyYears: 10,
    description: 'Răng sứ Zirconia đa lớp cao cấp, thẩm mỹ tự nhiên.',
    priceMin: 3500000,
    priceMax: 5000000,
    active: true,
  },
  {
    id: '2',
    name: 'Emax Press',
    category: 'Sứ ép',
    material: 'Lithium Disilicate',
    origin: 'Đức',
    warrantyYears: 7,
    description: 'Sứ ép Emax thẩm mỹ cao, độ trong suốt tự nhiên.',
    priceMin: 4000000,
    priceMax: 6000000,
    active: true,
  },
  {
    id: '3',
    name: 'PFM Crown Standard',
    category: 'Kim loại',
    material: 'Hợp kim Ni-Cr',
    origin: 'Nhật Bản',
    warrantyYears: 5,
    description: 'Mão sứ kim loại tiêu chuẩn, bền bỉ theo thời gian.',
    priceMin: 1200000,
    priceMax: 2000000,
    active: true,
  },
  {
    id: '4',
    name: 'Hàm tháo lắp nhựa dẻo',
    category: 'Tháo lắp',
    material: 'Nhựa Valplast',
    origin: 'Mỹ',
    warrantyYears: 3,
    description: 'Hàm giả tháo lắp mềm dẻo, không móc kim loại.',
    priceMin: 2500000,
    priceMax: 4000000,
    active: true,
  },
  {
    id: '5',
    name: 'Implant Abutment Titanium',
    category: 'Implant',
    material: 'Titanium Grade 5',
    origin: 'Hàn Quốc',
    warrantyYears: 15,
    description: 'Abutment Implant titanium chính hãng, tương thích sinh học.',
    priceMin: 3000000,
    priceMax: 5500000,
    active: true,
  },
  {
    id: '6',
    name: 'Zirconia HT Monolithic',
    category: 'Toàn sứ',
    material: 'Zirconia HT',
    origin: 'Nhật Bản',
    warrantyYears: 8,
    description: 'Zirconia nguyên khối trong suốt cao, thích hợp cho răng sau.',
    priceMin: 2800000,
    priceMax: 3800000,
    active: false,
  },
  {
    id: '7',
    name: 'Sứ ép Celtra Press',
    category: 'Sứ ép',
    material: 'ZLS (Zirconia-Lithium Silicate)',
    origin: 'Đức',
    warrantyYears: 7,
    description: 'Sứ ép thế hệ mới, kết hợp Zirconia và Lithium Silicate.',
    priceMin: 4500000,
    priceMax: 6500000,
    active: true,
  },
  {
    id: '8',
    name: 'Hàm khung kim loại',
    category: 'Tháo lắp',
    material: 'Hợp kim Co-Cr',
    origin: 'Đức',
    warrantyYears: 5,
    description: 'Hàm khung kim loại Co-Cr, độ bền cao, nhẹ.',
    priceMin: 3500000,
    priceMax: 6000000,
    active: true,
  },
];

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  category: 'Toàn sứ',
  material: '',
  origin: '',
  warrantyYears: 5,
  description: '',
  priceMin: 0,
  priceMax: 0,
  active: true,
};

function formatPrice(value: number): string {
  return value.toLocaleString('vi-VN') + 'đ';
}

// --- Component ---

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      material: product.material,
      origin: product.origin,
      warrantyYears: product.warrantyYears,
      description: product.description,
      priceMin: product.priceMin,
      priceMax: product.priceMax,
      active: product.active,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...form,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleActive(id: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  }

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
          <h1 style={pageTitle}>Quản lý Sản phẩm</h1>
          <p style={pageSubtitle}>
            {products.length} sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 380 }}>
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
          placeholder="Tìm sản phẩm theo tên, chất liệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category pills */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 18px',
                borderRadius: 20,
                border: isActive ? 'none' : `1px solid ${colors.border}`,
                background: isActive
                  ? `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`
                  : colors.cardBg,
                color: isActive ? colors.white : colors.textSecondary,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                fontFamily: fonts.body,
                whiteSpace: 'nowrap',
                transition: transitions.fast,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map((product) => (
          <div
            key={product.id}
            style={{
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              opacity: product.active ? 1 : 0.65,
              transition: transitions.fast,
            }}
          >
            {/* Top row: name + category */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    fontFamily: fonts.heading,
                    marginBottom: 4,
                  }}
                >
                  {product.name}
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: colors.primaryBg,
                    color: colors.primaryHover,
                  }}
                >
                  {product.category}
                </span>
              </div>
              <Package size={18} style={{ color: colors.textMuted, flexShrink: 0 }} />
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 13, color: colors.textSecondary }}>
                <span style={{ fontWeight: 500 }}>Chất liệu:</span> {product.material}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary }}>
                <span style={{ fontWeight: 500 }}>Xuất xứ:</span> {product.origin}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary }}>
                <span style={{ fontWeight: 500 }}>Bảo hành:</span> {product.warrantyYears} năm
              </div>
            </div>

            {/* Price range */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: colors.primary,
                fontFamily: fonts.heading,
              }}
            >
              {formatPrice(product.priceMin)} - {formatPrice(product.priceMax)}
            </div>

            {/* Bottom row: status + actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 10,
                marginTop: 2,
              }}
            >
              {/* Active toggle */}
              <button
                onClick={() => toggleActive(product.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    background: product.active ? colors.success : colors.textMuted,
                    position: 'relative',
                    transition: transitions.fast,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: colors.white,
                      position: 'absolute',
                      top: 2,
                      left: product.active ? 18 : 2,
                      transition: transitions.fast,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: product.active ? colors.success : colors.textMuted,
                    fontWeight: 500,
                    fontFamily: fonts.body,
                  }}
                >
                  {product.active ? 'Đang bán' : 'Ngừng bán'}
                </span>
              </button>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => openEdit(product)}
                  style={{
                    background: colors.infoBg,
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 8px',
                    cursor: 'pointer',
                    color: colors.info,
                    transition: transitions.fast,
                  }}
                  title="Chỉnh sửa"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    background: colors.dangerBg,
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 8px',
                    cursor: 'pointer',
                    color: colors.danger,
                    transition: transitions.fast,
                  }}
                  title="Xoá"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
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
          <Package size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            Không tìm thấy sản phẩm nào
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        maxWidth={480}
      >
        <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
          <Input
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              Danh mục
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Chất liệu"
            placeholder="VD: Zirconia, Lithium Disilicate..."
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
          />

          <Input
            label="Xuất xứ"
            placeholder="VD: Đức, Nhật Bản, Hàn Quốc..."
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
          />

          <Input
            label="Bảo hành (năm)"
            type="number"
            min={0}
            placeholder="Số năm bảo hành"
            value={form.warrantyYears}
            onChange={(e) =>
              setForm({ ...form, warrantyYears: parseInt(e.target.value) || 0 })
            }
          />

          <Textarea
            label="Mô tả"
            placeholder="Mô tả chi tiết sản phẩm..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Active toggle */}
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: colors.textSecondary,
                fontFamily: fonts.body,
              }}
            >
              Trạng thái
            </label>
            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: form.active ? colors.success : colors.textMuted,
                  position: 'relative',
                  transition: transitions.fast,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: colors.white,
                    position: 'absolute',
                    top: 2,
                    left: form.active ? 18 : 2,
                    transition: transitions.fast,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: form.active ? colors.success : colors.textMuted,
                  fontFamily: fonts.body,
                }}
              >
                {form.active ? 'Đang bán' : 'Ngừng bán'}
              </span>
            </button>
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
          <Button onClick={handleSave}>Lưu sản phẩm</Button>
        </div>
      </Modal>
    </div>
  );
}

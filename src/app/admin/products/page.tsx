'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
} from '@/lib/styles';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from '@/lib/api-client';

interface Category {
  id: string;
  nameVi: string;
  slug: string;
}

interface Variant {
  id: string;
  nameVi: string;
  unit: string;
  priceVnd: string; // BigInt serialized as string
}

interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

interface Product {
  id: string;
  nameVi: string;
  categoryId: string;
  category?: { id: string; nameVi: string };
  material: string | null;
  origin: string | null;
  warrantyYears: number | null;
  descriptionVi: string | null;
  isActive: boolean;
  isFeatured: boolean;
  variants: Variant[];
  images: ProductImage[];
}

interface ProductFormState {
  nameVi: string;
  categoryId: string;
  material: string;
  origin: string;
  warrantyYears: number;
  descriptionVi: string;
  isFeatured: boolean;
  variantName: string;
  variantUnit: string;
  variantPriceMin: number;
  variantPriceMax: number;
}

const EMPTY_FORM: ProductFormState = {
  nameVi: '',
  categoryId: '',
  material: '',
  origin: '',
  warrantyYears: 5,
  descriptionVi: '',
  isFeatured: false,
  variantName: 'Tiêu chuẩn',
  variantUnit: 'Cái',
  variantPriceMin: 0,
  variantPriceMax: 0,
};

function formatPrice(value: number): string {
  return value.toLocaleString('vi-VN') + 'đ';
}

function priceRangeOf(product: Product): { min: number; max: number } | null {
  if (!product.variants.length) return null;
  const prices = product.variants.map((v) => Number(v.priceVnd));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        apiGet<Product[]>('/api/admin/products'),
        apiGet<Category[]>('/api/admin/categories'),
      ]);
      setProducts(prods);
      setCategories(cats);
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
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.material || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id || '' });
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    const prices = product.variants.map((v) => Number(v.priceVnd));
    setForm({
      nameVi: product.nameVi,
      categoryId: product.categoryId,
      material: product.material || '',
      origin: product.origin || '',
      warrantyYears: product.warrantyYears || 0,
      descriptionVi: product.descriptionVi || '',
      isFeatured: product.isFeatured,
      variantName: product.variants[0]?.nameVi || 'Tiêu chuẩn',
      variantUnit: product.variants[0]?.unit || 'Cái',
      variantPriceMin: prices.length ? Math.min(...prices) : 0,
      variantPriceMax: prices.length ? Math.max(...prices) : 0,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.nameVi.trim() || !form.categoryId) {
      setError('Vui lòng nhập tên sản phẩm và chọn danh mục');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await apiPut<Product>(`/api/admin/products/${editingId}`, {
          nameVi: form.nameVi,
          categoryId: form.categoryId,
          material: form.material || null,
          origin: form.origin || null,
          warrantyYears: form.warrantyYears || null,
          descriptionVi: form.descriptionVi || null,
          isFeatured: form.isFeatured,
        });
      } else {
        const variants = [] as Array<{ nameVi: string; unit: string; priceVnd: number }>;
        if (form.variantPriceMin > 0) {
          variants.push({
            nameVi: form.variantName,
            unit: form.variantUnit,
            priceVnd: form.variantPriceMin,
          });
        }
        if (form.variantPriceMax > 0 && form.variantPriceMax !== form.variantPriceMin) {
          variants.push({
            nameVi: `${form.variantName} — cao`,
            unit: form.variantUnit,
            priceVnd: form.variantPriceMax,
          });
        }
        await apiPost<Product>('/api/admin/products', {
          nameVi: form.nameVi,
          categoryId: form.categoryId,
          material: form.material || null,
          origin: form.origin || null,
          warrantyYears: form.warrantyYears || null,
          descriptionVi: form.descriptionVi || null,
          isFeatured: form.isFeatured,
          variants,
        });
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Xoá sản phẩm này?')) return;
    try {
      await apiDelete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Xoá thất bại');
    }
  }

  async function toggleActive(product: Product) {
    const previous = products;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
    );
    try {
      await apiPut(`/api/admin/products/${product.id}`, { isActive: !product.isActive });
    } catch (e) {
      setProducts(previous);
      setError(e instanceof ApiError ? e.message : 'Cập nhật thất bại');
    }
  }

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
          <h1 style={pageTitle}>Quản lý Sản phẩm</h1>
          <p style={pageSubtitle}>
            {products.length} sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={openAdd} disabled={categories.length === 0}>
          <Plus size={16} />
          Thêm sản phẩm
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

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {[{ id: 'all', nameVi: 'Tất cả' }, ...categories].map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
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
              {cat.nameVi}
            </button>
          );
        })}
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map((product) => {
          const priceRange = priceRangeOf(product);
          return (
            <div
              key={product.id}
              style={{
                ...cardStyle,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                opacity: product.isActive ? 1 : 0.65,
                transition: transitions.fast,
              }}
            >
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
                    {product.nameVi}
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
                    {product.category?.nameVi || '—'}
                  </span>
                </div>
                <Package size={18} style={{ color: colors.textMuted, flexShrink: 0 }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>
                  <span style={{ fontWeight: 500 }}>Chất liệu:</span>{' '}
                  {product.material || '—'}
                </div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>
                  <span style={{ fontWeight: 500 }}>Xuất xứ:</span>{' '}
                  {product.origin || '—'}
                </div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>
                  <span style={{ fontWeight: 500 }}>Bảo hành:</span>{' '}
                  {product.warrantyYears ? `${product.warrantyYears} năm` : '—'}
                </div>
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.primary,
                  fontFamily: fonts.heading,
                }}
              >
                {priceRange
                  ? priceRange.min === priceRange.max
                    ? formatPrice(priceRange.min)
                    : `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
                  : 'Chưa có giá'}
              </div>

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
                <button
                  onClick={() => toggleActive(product)}
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
                      background: product.isActive ? colors.success : colors.textMuted,
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
                        left: product.isActive ? 18 : 2,
                        transition: transitions.fast,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: product.isActive ? colors.success : colors.textMuted,
                      fontWeight: 500,
                      fontFamily: fonts.body,
                    }}
                  >
                    {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                  </span>
                </button>

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
          <Package size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            {products.length === 0 ? 'Chưa có sản phẩm nào' : 'Không tìm thấy sản phẩm nào'}
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {products.length === 0 && categories.length === 0
              ? 'Hãy tạo danh mục trước khi thêm sản phẩm'
              : 'Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm'}
          </div>
        </div>
      )}

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
            value={form.nameVi}
            onChange={(e) => setForm({ ...form, nameVi: e.target.value })}
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
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">— Chọn danh mục —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameVi}
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
            value={form.descriptionVi}
            onChange={(e) => setForm({ ...form, descriptionVi: e.target.value })}
          />

          {!editingId && (
            <div
              style={{
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 12,
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: 10,
                  fontFamily: fonts.heading,
                }}
              >
                Giá (tạo biến thể đầu tiên)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input
                  label="Giá thấp nhất (VNĐ)"
                  type="number"
                  min={0}
                  value={form.variantPriceMin}
                  onChange={(e) =>
                    setForm({ ...form, variantPriceMin: parseInt(e.target.value) || 0 })
                  }
                />
                <Input
                  label="Giá cao nhất (VNĐ)"
                  type="number"
                  min={0}
                  value={form.variantPriceMax}
                  onChange={(e) =>
                    setForm({ ...form, variantPriceMax: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          )}

          <div
            style={{
              marginBottom: 16,
              marginTop: 12,
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
              Nổi bật
            </label>
            <button
              type="button"
              onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
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
                  background: form.isFeatured ? colors.success : colors.textMuted,
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
                    left: form.isFeatured ? 18 : 2,
                    transition: transitions.fast,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: form.isFeatured ? colors.success : colors.textMuted,
                  fontFamily: fonts.body,
                }}
              >
                {form.isFeatured ? 'Hiển thị trang chủ' : 'Không nổi bật'}
              </span>
            </button>
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
            {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

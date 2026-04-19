'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { colors, fonts, pageTitle, pageSubtitle, inputStyle, primaryButton, secondaryButton, cardStyle } from '@/lib/styles';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import OrderableList from '@/components/admin/OrderableList';
import ImageUpload from '@/components/admin/ImageUpload';
import { Modal } from '@/components/ui/Modal';

type Category = {
  id: string;
  nameVi: string;
  nameEn: string | null;
  slug: string;
  descriptionVi: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
};

const label: CSSProperties = { fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 4, display: 'block' };
const addRow: CSSProperties = { display: 'flex', gap: 10, marginBottom: 12, justifyContent: 'flex-end' };

export default function CategoriesAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  async function load() {
    setItems(await apiGet<Category[]>('/api/admin/categories'));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      nameVi: editing.nameVi || '',
      nameEn: editing.nameEn || null,
      descriptionVi: editing.descriptionVi || null,
      imageUrl: editing.imageUrl || null,
      displayOrder: editing.displayOrder ?? items.length + 1,
      isActive: editing.isActive ?? true,
    };
    if (editing.id) await apiPut(`/api/admin/categories/${editing.id}`, payload);
    else await apiPost('/api/admin/categories', payload);
    setEditing(null);
    load();
  }

  async function remove(it: Category) {
    if (it._count && it._count.products > 0) {
      alert(`Không thể xóa — còn ${it._count.products} sản phẩm trong danh mục.`);
      return;
    }
    if (!confirm(`Xóa danh mục "${it.nameVi}"?`)) return;
    await apiDelete(`/api/admin/categories/${it.id}`);
    load();
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Danh mục sản phẩm</h1>
        <div style={pageSubtitle}>Quản lý nhóm sản phẩm (tag lọc trên <code>/san-pham</code>)</div>
      </div>

      <div style={addRow}>
        <button style={primaryButton} onClick={() => setEditing({ nameVi: '', isActive: true })}>
          + Thêm danh mục
        </button>
      </div>

      <OrderableList
        items={items}
        onReorder={() => {}}
        onEdit={(it) => setEditing(it)}
        onDelete={remove}
        renderItem={(it) => (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {it.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }} />
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>
                {it.nameVi}{' '}
                <span style={{ color: colors.textLight, fontWeight: 400, fontSize: 12 }}>
                  /{it.slug} · {it._count?.products ?? 0} sp
                </span>
              </div>
              {it.descriptionVi && (
                <div style={{ fontSize: 12, color: colors.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {it.descriptionVi}
                </div>
              )}
            </div>
          </div>
        )}
        emptyText="Chưa có danh mục nào. Bấm + Thêm để tạo."
      />

      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing.id ? 'Sửa danh mục' : 'Thêm danh mục'} maxWidth={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <span style={label}>Tên (tiếng Việt)</span>
              <input style={inputStyle} value={editing.nameVi || ''} onChange={(e) => setEditing({ ...editing, nameVi: e.target.value })} />
            </div>
            <div>
              <span style={label}>Tên tiếng Anh (tùy chọn)</span>
              <input style={inputStyle} value={editing.nameEn || ''} onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })} />
            </div>
            <div>
              <span style={label}>Mô tả (tùy chọn)</span>
              <textarea
                style={{ ...inputStyle, minHeight: 72, resize: 'vertical', fontFamily: fonts.body }}
                value={editing.descriptionVi || ''}
                onChange={(e) => setEditing({ ...editing, descriptionVi: e.target.value })}
              />
            </div>
            <div>
              <span style={label}>Ảnh danh mục (tùy chọn)</span>
              <ImageUpload value={editing.imageUrl || null} onChange={(url) => setEditing({ ...editing, imageUrl: url })} prefix="products" height={140} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: colors.textSecondary }}>
                <input
                  type="checkbox"
                  checked={editing.isActive ?? true}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                />
                Hiển thị trên /san-pham
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button style={primaryButton} onClick={save}>
                Lưu
              </button>
              <button style={secondaryButton} onClick={() => setEditing(null)}>
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MessageSquareQuote,
  Star,
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
import ImageUpload from '@/components/admin/ImageUpload';

interface Testimonial {
  id: string;
  labName: string;
  contactPerson: string | null;
  contentVi: string;
  rating: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isApproved: boolean;
  displayOrder: number;
  createdAt: string;
}

interface TestimonialForm {
  labName: string;
  contactPerson: string;
  contentVi: string;
  rating: number;
  imageUrl: string;
  isFeatured: boolean;
  isApproved: boolean;
  displayOrder: number;
}

const EMPTY_FORM: TestimonialForm = {
  labName: '',
  contactPerson: '',
  contentVi: '',
  rating: 5,
  imageUrl: '',
  isFeatured: false,
  isApproved: true,
  displayOrder: 0,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Testimonial[]>('/api/admin/testimonials');
      setTestimonials(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được danh sách');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({
      labName: t.labName,
      contactPerson: t.contactPerson || '',
      contentVi: t.contentVi,
      rating: t.rating || 5,
      imageUrl: t.imageUrl || '',
      isFeatured: t.isFeatured,
      isApproved: t.isApproved,
      displayOrder: t.displayOrder,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.labName.trim() || !form.contentVi.trim()) {
      setError('Tên labo và nội dung là bắt buộc');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      labName: form.labName,
      contactPerson: form.contactPerson || null,
      contentVi: form.contentVi,
      rating: form.rating,
      imageUrl: form.imageUrl || null,
      isFeatured: form.isFeatured,
      isApproved: form.isApproved,
      displayOrder: form.displayOrder,
    };
    try {
      if (editingId) {
        await apiPut(`/api/admin/testimonials/${editingId}`, payload);
      } else {
        await apiPost('/api/admin/testimonials', payload);
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
    if (!confirm('Xoá ý kiến này?')) return;
    try {
      await apiDelete(`/api/admin/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Xoá thất bại');
    }
  }

  async function toggleApproved(t: Testimonial) {
    const previous = testimonials;
    setTestimonials((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, isApproved: !x.isApproved } : x))
    );
    try {
      await apiPut(`/api/admin/testimonials/${t.id}`, { isApproved: !t.isApproved });
    } catch (e) {
      setTestimonials(previous);
      setError(e instanceof ApiError ? e.message : 'Cập nhật thất bại');
    }
  }

  async function toggleFeatured(t: Testimonial) {
    const previous = testimonials;
    setTestimonials((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, isFeatured: !x.isFeatured } : x))
    );
    try {
      await apiPut(`/api/admin/testimonials/${t.id}`, { isFeatured: !t.isFeatured });
    } catch (e) {
      setTestimonials(previous);
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
          <h1 style={pageTitle}>Ý kiến khách hàng</h1>
          <p style={pageSubtitle}>{testimonials.length} đánh giá trong hệ thống</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Thêm ý kiến
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
        {testimonials.map((t) => (
          <div
            key={t.id}
            style={{
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              opacity: t.isApproved ? 1 : 0.6,
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
                    marginBottom: 2,
                  }}
                >
                  {t.labName}
                </div>
                {t.contactPerson && (
                  <div style={{ fontSize: 12, color: colors.textMuted }}>
                    {t.contactPerson}
                  </div>
                )}
              </div>
              <MessageSquareQuote size={18} style={{ color: colors.textMuted, flexShrink: 0 }} />
            </div>

            {t.rating && (
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < (t.rating || 0) ? colors.gold : 'transparent'}
                    color={i < (t.rating || 0) ? colors.gold : colors.textMuted}
                  />
                ))}
              </div>
            )}

            <div
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                fontFamily: fonts.body,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              "{t.contentVi}"
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 10,
                marginTop: 2,
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={() => toggleApproved(t)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: t.isApproved ? colors.successBg : '#f8fafc',
                    color: t.isApproved ? colors.success : colors.textMuted,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: fonts.body,
                    transition: transitions.fast,
                  }}
                >
                  {t.isApproved ? '✓ Duyệt' : 'Chờ duyệt'}
                </button>
                <button
                  onClick={() => toggleFeatured(t)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: t.isFeatured ? '#fff7ed' : '#f8fafc',
                    color: t.isFeatured ? '#c2410c' : colors.textMuted,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: fonts.body,
                    transition: transitions.fast,
                  }}
                >
                  {t.isFeatured ? '★ Nổi bật' : 'Thường'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => openEdit(t)}
                  style={{
                    background: colors.infoBg,
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 8px',
                    cursor: 'pointer',
                    color: colors.info,
                  }}
                  title="Chỉnh sửa"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{
                    background: colors.dangerBg,
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 8px',
                    cursor: 'pointer',
                    color: colors.danger,
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

      {!loading && testimonials.length === 0 && (
        <div
          style={{
            ...cardStyle,
            textAlign: 'center',
            padding: '48px 24px',
            color: colors.textMuted,
          }}
        >
          <MessageSquareQuote size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>Chưa có ý kiến nào</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Thêm ý kiến khách hàng để hiển thị trên trang chủ
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Chỉnh sửa ý kiến' : 'Thêm ý kiến mới'}
        maxWidth={520}
      >
        <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
          <Input
            label="Tên labo / phòng khám"
            placeholder="VD: Nha khoa Sài Gòn Smile"
            value={form.labName}
            onChange={(e) => setForm({ ...form, labName: e.target.value })}
          />

          <Input
            label="Người liên hệ (tuỳ chọn)"
            placeholder="VD: BS. Nguyễn Văn An"
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          />

          <Textarea
            label="Nội dung đánh giá"
            placeholder="Nội dung ý kiến của khách hàng..."
            value={form.contentVi}
            onChange={(e) => setForm({ ...form, contentVi: e.target.value })}
            rows={4}
          />

          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: colors.textSecondary,
                marginBottom: 6,
                fontFamily: fonts.body,
              }}
            >
              Đánh giá sao
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 2,
                  }}
                >
                  <Star
                    size={22}
                    fill={n <= form.rating ? colors.gold : 'transparent'}
                    color={n <= form.rating ? colors.gold : colors.textMuted}
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: colors.textPrimary }}>
              Ảnh đại diện (tuỳ chọn)
            </div>
            <ImageUpload
              value={form.imageUrl || null}
              onChange={(url) => setForm({ ...form, imageUrl: url || '' })}
              prefix="testimonials"
              height={160}
            />
          </div>

          <Input
            label="Thứ tự hiển thị"
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(e) =>
              setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })
            }
          />

          <div style={{ display: 'flex', gap: 20, marginTop: 12, marginBottom: 8 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: colors.textSecondary,
                fontFamily: fonts.body,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={form.isApproved}
                onChange={(e) => setForm({ ...form, isApproved: e.target.checked })}
              />
              Đã duyệt
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: colors.textSecondary,
                fontFamily: fonts.body,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Hiển thị trang chủ (nổi bật)
            </label>
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
            {saving ? 'Đang lưu...' : 'Lưu ý kiến'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

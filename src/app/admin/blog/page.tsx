'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Eye,
  Calendar,
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
  statusMap,
  StatusKey,
} from '@/lib/styles';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from '@/lib/api-client';
import PageHeroEditor from '@/components/admin/PageHeroEditor';

type BlogStatus = 'draft' | 'scheduled' | 'published';
type BlogCategory = 'tin-tuc' | 'kien-thuc' | 'cong-nghe' | 'tuyen-dung';

interface BlogPost {
  id: string;
  titleVi: string;
  slug: string;
  excerptVi: string | null;
  contentVi: string;
  featuredImageUrl: string | null;
  category: string | null;
  tags: string[];
  status: BlogStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  viewCount: number;
  createdAt: string;
}

interface BlogForm {
  titleVi: string;
  excerptVi: string;
  contentVi: string;
  category: BlogCategory;
  status: BlogStatus;
  tagsText: string;
  seoTitle: string;
  seoDescription: string;
}

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  'tin-tuc': 'Tin tức',
  'kien-thuc': 'Kiến thức',
  'cong-nghe': 'Công nghệ',
  'tuyen-dung': 'Tuyển dụng',
};

const CATEGORY_COLORS: Record<BlogCategory, { bg: string; color: string }> = {
  'tin-tuc': { bg: '#ecfeff', color: '#0891b2' },
  'kien-thuc': { bg: '#f3f0ff', color: '#7c3aed' },
  'cong-nghe': { bg: '#eff6ff', color: '#2563eb' },
  'tuyen-dung': { bg: '#fffbeb', color: '#d97706' },
};

const STATUS_TABS: { key: 'all' | BlogStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'draft', label: 'Nháp' },
  { key: 'scheduled', label: 'Đã lên lịch' },
  { key: 'published', label: 'Đã xuất bản' },
];

const EMPTY_FORM: BlogForm = {
  titleVi: '',
  excerptVi: '',
  contentVi: '',
  category: 'tin-tuc',
  status: 'draft',
  tagsText: '',
  seoTitle: '',
  seoDescription: '',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<BlogPost[]>('/api/admin/blog');
      setPosts(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return posts;
    return posts.filter((p) => p.status === statusFilter);
  }, [posts, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: posts.length, draft: 0, scheduled: 0, published: 0 };
    posts.forEach((p) => {
      counts[p.status]++;
    });
    return counts;
  }, [posts]);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      titleVi: post.titleVi,
      excerptVi: post.excerptVi || '',
      contentVi: post.contentVi,
      category: (post.category as BlogCategory) || 'tin-tuc',
      status: post.status,
      tagsText: (post.tags || []).join(', '),
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.titleVi.trim() || !form.contentVi.trim()) {
      setError('Tiêu đề và nội dung là bắt buộc');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      titleVi: form.titleVi,
      excerptVi: form.excerptVi || null,
      contentVi: form.contentVi,
      category: form.category,
      status: form.status,
      tags: form.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
    };
    try {
      if (editingId) {
        await apiPut(`/api/admin/blog/${editingId}`, payload);
      } else {
        await apiPost('/api/admin/blog', payload);
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
    if (!confirm('Xoá bài viết này?')) return;
    try {
      await apiDelete(`/api/admin/blog/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Xoá thất bại');
    }
  }

  return (
    <div>
      <details style={{ marginBottom: 20, background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 12 }}>
        <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#334155' }}>
          Sửa Hero của trang <code>/tin-tuc</code>
        </summary>
        <div style={{ marginTop: 12 }}>
          <PageHeroEditor pageSlug="news" uploadPrefix="blog" hideImage />
        </div>
      </details>
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
          <h1 style={pageTitle}>Quản lý Bài viết</h1>
          <p style={pageSubtitle}>{posts.length} bài viết trong hệ thống</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Viết bài mới
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

      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 20,
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: 0,
        }}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderBottom: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
                background: 'none',
                color: isActive ? colors.primary : colors.textSecondary,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                fontFamily: fonts.body,
                transition: transitions.fast,
              }}
            >
              {tab.label}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background: isActive ? colors.primaryBg : '#f1f5f9',
                  color: isActive ? colors.primary : colors.textMuted,
                  padding: '1px 7px',
                  borderRadius: 10,
                }}
              >
                {statusCounts[tab.key]}
              </span>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((post) => {
          const catKey = (post.category as BlogCategory) in CATEGORY_LABELS
            ? (post.category as BlogCategory)
            : null;
          return (
            <div
              key={post.id}
              style={{
                ...cardStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    fontFamily: fonts.heading,
                    marginBottom: 6,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {post.titleVi}
                </div>

                {post.excerptVi && (
                  <div
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      marginBottom: 10,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.5',
                    }}
                  >
                    {post.excerptVi}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {catKey && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        background: CATEGORY_COLORS[catKey].bg,
                        color: CATEGORY_COLORS[catKey].color,
                      }}
                    >
                      {CATEGORY_LABELS[catKey]}
                    </span>
                  )}

                  <span style={getBadgeStyle(post.status as StatusKey)}>
                    {statusMap[post.status as StatusKey].label}
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: colors.textMuted,
                    }}
                  >
                    <Calendar size={12} />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>

                  {post.viewCount > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: colors.textMuted,
                      }}
                    >
                      <Eye size={12} />
                      {post.viewCount.toLocaleString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(post)}
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
                  onClick={() => handleDelete(post.id)}
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
          <FileText size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            Không có bài viết nào
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {statusFilter !== 'all'
              ? `Không có bài viết ở trạng thái "${STATUS_TABS.find((t) => t.key === statusFilter)?.label}"`
              : 'Bắt đầu viết bài mới'}
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
        maxWidth={640}
      >
        <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
          <Input
            label="Tiêu đề"
            placeholder="Nhập tiêu đề bài viết"
            value={form.titleVi}
            onChange={(e) => setForm({ ...form, titleVi: e.target.value })}
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
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as BlogCategory })
              }
            >
              {(Object.keys(CATEGORY_LABELS) as BlogCategory[]).map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Nội dung tóm tắt"
            placeholder="Tóm tắt ngắn cho bài viết (hiển thị ở danh sách)..."
            value={form.excerptVi}
            onChange={(e) => setForm({ ...form, excerptVi: e.target.value })}
          />

          <Textarea
            label="Nội dung chi tiết"
            placeholder="Viết nội dung bài viết..."
            value={form.contentVi}
            onChange={(e) => setForm({ ...form, contentVi: e.target.value })}
            style={{ minHeight: 200 }}
          />

          <Input
            label="Tags"
            placeholder="Nhập tags, phân cách bằng dấu phẩy (VD: zirconia, công nghệ, labo)"
            value={form.tagsText}
            onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
          />

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
              SEO
            </div>

            <Input
              label="SEO Title"
              placeholder="Tiêu đề tối ưu cho công cụ tìm kiếm"
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            />

            <Textarea
              label="SEO Description"
              placeholder="Mô tả meta cho công cụ tìm kiếm (tối đa 160 ký tự)"
              value={form.seoDescription}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            />
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
              Trạng thái
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as BlogStatus })
              }
            >
              <option value="draft">Nháp</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="published">Đã xuất bản</option>
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
            {saving ? 'Đang lưu...' : 'Lưu bài viết'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

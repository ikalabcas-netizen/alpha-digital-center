'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
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

// --- Types ---

type BlogStatus = 'draft' | 'scheduled' | 'published';
type BlogCategory = 'tin-tuc' | 'kien-thuc' | 'cong-nghe' | 'tuyen-dung';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  status: BlogStatus;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  date: string;
  views: number;
}

// --- Constants ---

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

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Xu hướng phục hình răng sứ Zirconia 2024 - Công nghệ CAD/CAM tối ưu',
    excerpt:
      'Phân tích chi tiết các công nghệ Zirconia mới nhất được ứng dụng trong labo nha khoa, từ multilayer đến ultra-translucent.',
    content: '',
    category: 'cong-nghe',
    status: 'published',
    tags: 'zirconia, cad/cam, công nghệ',
    seoTitle: 'Xu hướng Zirconia 2024 | Alpha Digital Center',
    seoDescription: 'Phân tích công nghệ Zirconia mới nhất trong labo nha khoa.',
    date: '2024-03-15',
    views: 1245,
  },
  {
    id: '2',
    title: 'Hướng dẫn chọn shade răng sứ chính xác cho bác sĩ nha khoa',
    excerpt:
      'Quy trình chọn shade chuẩn, so màu kỹ thuật số và các lưu ý quan trọng khi gửi case cho labo.',
    content: '',
    category: 'kien-thuc',
    status: 'published',
    tags: 'shade, hướng dẫn, bác sĩ',
    seoTitle: 'Hướng dẫn chọn shade răng sứ | Alpha Digital Center',
    seoDescription: 'Hướng dẫn chọn shade răng sứ chính xác cho bác sĩ.',
    date: '2024-03-10',
    views: 832,
  },
  {
    id: '3',
    title: 'Alpha Digital Center khai trương showroom mới tại TP.HCM',
    excerpt:
      'Sự kiện khai trương showroom trưng bày các sản phẩm phục hình nha khoa cao cấp tại quận 1.',
    content: '',
    category: 'tin-tuc',
    status: 'published',
    tags: 'sự kiện, showroom, tp.hcm',
    seoTitle: 'Khai trương showroom TP.HCM | Alpha Digital Center',
    seoDescription: 'Alpha Digital Center khai trương showroom mới tại TP.HCM.',
    date: '2024-02-28',
    views: 567,
  },
  {
    id: '4',
    title: 'Tuyển kỹ thuật viên labo nha khoa - Kinh nghiệm CAD/CAM ưu tiên',
    excerpt:
      'Alpha Digital Center tuyển dụng kỹ thuật viên labo có kinh nghiệm vận hành máy phay CAD/CAM.',
    content: '',
    category: 'tuyen-dung',
    status: 'draft',
    tags: 'tuyển dụng, kỹ thuật viên, cad/cam',
    seoTitle: 'Tuyển kỹ thuật viên labo | Alpha Digital Center',
    seoDescription: 'Tuyển kỹ thuật viên labo nha khoa tại Alpha Digital Center.',
    date: '2024-03-18',
    views: 0,
  },
  {
    id: '5',
    title: 'So sánh Emax và Zirconia: Khi nào nên chọn loại nào?',
    excerpt:
      'Bài viết phân tích ưu nhược điểm của hai loại sứ phổ biến nhất trong phục hình nha khoa hiện đại.',
    content: '',
    category: 'kien-thuc',
    status: 'scheduled',
    tags: 'emax, zirconia, so sánh',
    seoTitle: 'Emax vs Zirconia | Alpha Digital Center',
    seoDescription: 'So sánh Emax và Zirconia trong phục hình nha khoa.',
    date: '2024-03-25',
    views: 0,
  },
  {
    id: '6',
    title: 'Ứng dụng AI trong thiết kế phục hình nha khoa - Tương lai đã đến',
    excerpt:
      'Tìm hiểu cách trí tuệ nhân tạo đang thay đổi quy trình thiết kế trong labo nha khoa hiện đại.',
    content: '',
    category: 'cong-nghe',
    status: 'draft',
    tags: 'AI, thiết kế, tương lai',
    seoTitle: 'AI trong nha khoa | Alpha Digital Center',
    seoDescription: 'Ứng dụng AI trong thiết kế phục hình nha khoa.',
    date: '2024-03-20',
    views: 0,
  },
];

const EMPTY_FORM: Omit<BlogPost, 'id' | 'views'> = {
  title: '',
  excerpt: '',
  content: '',
  category: 'tin-tuc',
  status: 'draft',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  date: new Date().toISOString().split('T')[0],
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// --- Component ---

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<BlogPost, 'id' | 'views'>>(EMPTY_FORM);

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
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
      tags: post.tags,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      date: post.date,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (editingId) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...form,
        views: 0,
      };
      setPosts((prev) => [...prev, newPost]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
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
          <h1 style={pageTitle}>Quản lý Bài viết</h1>
          <p style={pageSubtitle}>{posts.length} bài viết trong hệ thống</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Viết bài mới
        </Button>
      </div>

      {/* Status tabs */}
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

      {/* Posts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((post) => (
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
            {/* Left content */}
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
                {post.title}
              </div>

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
                {post.excerpt}
              </div>

              {/* Badges & meta row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                {/* Category badge */}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: CATEGORY_COLORS[post.category].bg,
                    color: CATEGORY_COLORS[post.category].color,
                  }}
                >
                  {CATEGORY_LABELS[post.category]}
                </span>

                {/* Status badge */}
                <span style={getBadgeStyle(post.status as StatusKey)}>
                  {statusMap[post.status as StatusKey].label}
                </span>

                {/* Date */}
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
                  {formatDate(post.date)}
                </span>

                {/* Views */}
                {post.views > 0 && (
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
                    {post.views.toLocaleString('vi-VN')}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
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

      {/* Add/Edit Modal */}
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
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />

          <Textarea
            label="Nội dung chi tiết"
            placeholder="Viết nội dung bài viết... (Tiptap editor sẽ được tích hợp sau)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={{ minHeight: 200 }}
          />

          <Input
            label="Tags"
            placeholder="Nhập tags, phân cách bằng dấu phẩy (VD: zirconia, công nghệ, labo)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          {/* SEO section */}
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

          {/* Status */}
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
          <Button onClick={handleSave}>Lưu bài viết</Button>
        </div>
      </Modal>
    </div>
  );
}

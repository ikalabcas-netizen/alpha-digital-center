'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  UserCog,
  Shield,
  ShieldCheck,
  Pencil,
  Eye,
  Crown,
  Trash2,
  Search,
  Check,
  X,
  Clock,
  Ban,
  RotateCcw,
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
import { apiGet, apiPut, apiDelete, ApiError } from '@/lib/api-client';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
}

type Role = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'pending' | 'rejected';

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string; icon: React.ElementType; description: string }> = {
  super_admin: {
    label: 'Super Admin',
    color: '#dc2626',
    bg: '#fef2f2',
    icon: Crown,
    description: 'Toàn quyền hệ thống, quản lý thành viên & phân quyền',
  },
  admin: {
    label: 'Admin',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: ShieldCheck,
    description: 'Quản lý nội dung, duyệt bài, xem báo cáo',
  },
  editor: {
    label: 'Biên tập viên',
    color: '#0891b2',
    bg: '#ecfeff',
    icon: Pencil,
    description: 'Tạo & chỉnh sửa nội dung, bài viết, sản phẩm',
  },
  viewer: {
    label: 'Xem',
    color: '#6b7280',
    bg: '#f3f4f6',
    icon: Eye,
    description: 'Chỉ xem dữ liệu, không chỉnh sửa',
  },
  pending: {
    label: 'Chờ duyệt',
    color: '#d97706',
    bg: '#fffbeb',
    icon: Clock,
    description: 'Đang chờ Super Admin duyệt',
  },
  rejected: {
    label: 'Từ chối',
    color: '#e11d48',
    bg: '#fff1f2',
    icon: Ban,
    description: 'Đã bị từ chối truy cập hệ thống',
  },
};

const TABS: { key: 'pending' | 'active' | 'rejected' | 'all'; label: string; filter: (r: string) => boolean }[] = [
  { key: 'pending', label: 'Chờ duyệt', filter: (r) => r === 'pending' },
  { key: 'active', label: 'Đang hoạt động', filter: (r) => ['super_admin', 'admin', 'editor', 'viewer'].includes(r) },
  { key: 'rejected', label: 'Từ chối', filter: (r) => r === 'rejected' },
  { key: 'all', label: 'Tất cả', filter: () => true },
];

const ASSIGNABLE_ROLES: Role[] = ['super_admin', 'admin', 'editor'];

export default function UsersPage() {
  const { data: session } = useSession();
  const currentRole = (session?.user as any)?.role;
  const isSuperAdmin = currentRole === 'super_admin';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<Role>('viewer');
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<User[]>('/api/admin/users');
      setUsers(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được danh sách');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function updateRole(user: User, role: Role) {
    const previous = users;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)));
    try {
      await apiPut(`/api/admin/users/${user.id}`, { role });
    } catch (e) {
      setUsers(previous);
      setError(e instanceof ApiError ? e.message : 'Cập nhật thất bại');
    }
  }

  async function handleSaveRole() {
    if (!editUser) return;
    setSaving(true);
    try {
      await updateRole(editUser, editRole);
      setEditUser(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteUser) return;
    setSaving(true);
    try {
      await apiDelete(`/api/admin/users/${deleteUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Xoá thất bại');
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => ({
    pending: users.filter((u) => u.role === 'pending').length,
    active: users.filter((u) => ['super_admin', 'admin', 'editor', 'viewer'].includes(u.role)).length,
    rejected: users.filter((u) => u.role === 'rejected').length,
  }), [users]);

  const filtered = users.filter((u) => {
    const tab = TABS.find((t) => t.key === activeTab);
    if (tab && !tab.filter(u.role)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name?.toLowerCase().includes(q)) || (u.email?.toLowerCase().includes(q));
  });

  if (!isSuperAdmin && currentRole !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: colors.textMuted, fontFamily: fonts.body }}>
        <Shield size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
        <h2 style={{ ...pageTitle, fontSize: 20 }}>Không có quyền truy cập</h2>
        <p style={{ ...pageSubtitle }}>Chỉ Super Admin và Admin mới có thể quản lý thành viên.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={pageTitle}>
            <UserCog size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Quản trị hệ thống
          </h1>
          <p style={pageSubtitle}>Duyệt thành viên mới và phân quyền truy cập CMS</p>
        </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1 }}>{stats.pending}</div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Chờ duyệt</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: colors.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.success }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1 }}>{stats.active}</div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Đang hoạt động</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: colors.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.danger }}>
            <Ban size={20} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1 }}>{stats.rejected}</div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Từ chối</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 16,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tab.key === 'all' ? users.length : users.filter((u) => tab.filter(u.role)).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
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
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36, width: '100%' }}
          />
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body }}>
            Đang tải danh sách thành viên...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body }}>
            {activeTab === 'pending' ? 'Không có yêu cầu nào đang chờ duyệt' : 'Không tìm thấy thành viên'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body, fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.border}`, background: '#f8fafc' }}>
                  <th style={thStyle}>Thành viên</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Vai trò</th>
                  <th style={thStyle}>Ngày tham gia</th>
                  {isSuperAdmin && <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const role = user.role as Role;
                  const config = ROLE_CONFIG[role] || ROLE_CONFIG.pending;
                  const Icon = config.icon;
                  const isCurrentUser = (session?.user as any)?.id === user.id;
                  const isPending = user.role === 'pending';
                  const isRejected = user.role === 'rejected';

                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        transition: transitions.fast,
                        background: isCurrentUser ? '#f0fdfa' : 'transparent',
                      }}
                    >
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {user.image ? (
                            <img src={user.image} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                          ) : (
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color, fontWeight: 600, fontSize: 13 }}>
                              {(user.name || user.email || '?')[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: colors.textPrimary }}>
                              {user.name || 'Chưa đặt tên'}
                              {isCurrentUser && <span style={{ fontSize: 11, color: colors.textMuted, marginLeft: 6 }}>(Bạn)</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: colors.textSecondary }}>{user.email}</td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          color: config.color,
                          background: config.bg,
                        }}>
                          <Icon size={13} />
                          {config.label}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: colors.textMuted, fontSize: 13 }}>
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      {isSuperAdmin && (
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {isPending && (
                              <>
                                <button
                                  onClick={() => updateRole(user, 'admin')}
                                  style={{ ...actionBtnStyle, background: colors.successBg, color: colors.success, border: '1px solid rgba(22,163,74,0.2)' }}
                                  title="Duyệt (cấp quyền Admin)"
                                >
                                  <Check size={15} />
                                </button>
                                <button
                                  onClick={() => updateRole(user, 'rejected')}
                                  style={{ ...actionBtnStyle, background: colors.dangerBg, color: colors.danger, border: '1px solid rgba(225,29,72,0.2)' }}
                                  title="Từ chối"
                                >
                                  <X size={15} />
                                </button>
                              </>
                            )}
                            {isRejected && (
                              <button
                                onClick={() => updateRole(user, 'pending')}
                                style={{ ...actionBtnStyle, background: '#fffbeb', color: '#d97706', border: '1px solid rgba(217,119,6,0.2)' }}
                                title="Khôi phục về hàng đợi"
                              >
                                <RotateCcw size={15} />
                              </button>
                            )}
                            {!isPending && !isRejected && (
                              <button
                                onClick={() => { setEditUser(user); setEditRole(user.role as Role); }}
                                style={actionBtnStyle}
                                title="Đổi vai trò"
                              >
                                <Shield size={15} />
                              </button>
                            )}
                            {!isCurrentUser && (
                              <button
                                onClick={() => setDeleteUser(user)}
                                style={{ ...actionBtnStyle, color: colors.danger }}
                                title="Xóa thành viên"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ ...cardStyle, marginTop: 20, padding: '16px 20px', background: '#f0f9ff', borderLeft: `3px solid ${colors.primary}` }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary, marginBottom: 6, fontFamily: fonts.heading }}>
          Cách thêm thành viên mới
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
          1. Gửi link <code style={{ background: '#e0f2fe', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>https://www.alphacenter.vn/admin/login</code> cho người cần truy cập<br />
          2. Họ đăng nhập bằng Google → tài khoản vào hàng đợi "Chờ duyệt"<br />
          3. Super Admin vào tab này, nhấn ✓ để duyệt (cấp quyền Admin) hoặc ✗ để từ chối<br />
          4. Có thể đổi vai trò sau bằng icon khiên ở cột thao tác
        </div>
      </div>

      {editUser && (
        <Modal isOpen={true} onClose={() => setEditUser(null)} title="Đổi vai trò thành viên">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              {editUser.image ? (
                <img src={editUser.image} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                  {(editUser.name || editUser.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, color: colors.textPrimary }}>{editUser.name || 'Chưa đặt tên'}</div>
                <div style={{ fontSize: 13, color: colors.textMuted }}>{editUser.email}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary, marginBottom: 8 }}>Chọn vai trò:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ASSIGNABLE_ROLES.map((key) => {
                const config = ROLE_CONFIG[key];
                const Icon = config.icon;
                const selected = editRole === key;
                return (
                  <button
                    key={key}
                    onClick={() => setEditRole(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: `2px solid ${selected ? config.color : colors.border}`,
                      background: selected ? config.bg : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: transitions.fast,
                      fontFamily: fonts.body,
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color={config.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: config.color }}>{config.label}</div>
                      <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{config.description}</div>
                    </div>
                    {selected && (
                      <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color="#fff" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button variant="secondary" onClick={() => setEditUser(null)}>Hủy</Button>
            <Button onClick={handleSaveRole} disabled={saving || editRole === editUser.role}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </Modal>
      )}

      {deleteUser && (
        <Modal isOpen={true} onClose={() => setDeleteUser(null)} title="Xác nhận xóa thành viên">
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
              Bạn có chắc muốn xóa thành viên <strong>{deleteUser.name || deleteUser.email}</strong>?
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setDeleteUser(null)}>Hủy</Button>
            <Button variant="danger" onClick={handleDelete} disabled={saving}>
              {saving ? 'Đang xóa...' : 'Xóa thành viên'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 600,
  color: colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
};

const actionBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
  color: colors.textSecondary,
  transition: transitions.fast,
};

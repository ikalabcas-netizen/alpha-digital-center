'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  UserPlus,
  Copy,
  Check,
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

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
}

type Role = 'super_admin' | 'admin' | 'editor' | 'viewer';

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
};

export default function UsersPage() {
  const { data: session } = useSession();
  const currentRole = (session?.user as any)?.role;
  const isSuperAdmin = currentRole === 'super_admin';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<Role>('viewer');
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, role: editRole } : u));
        setEditUser(null);
      }
    } catch (e) {
      console.error('Failed to update role', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== deleteUser.id));
        setDeleteUser(null);
      }
    } catch (e) {
      console.error('Failed to delete user', e);
    } finally {
      setSaving(false);
    }
  };

  const copyInviteInfo = () => {
    const text = `Truy cập CMS: https://www.alphacenter.vn/admin/login\nĐăng nhập bằng tài khoản Google đã được duyệt.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUsers = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name?.toLowerCase().includes(q)) || (u.email?.toLowerCase().includes(q));
  });

  const roleStats = {
    super_admin: users.filter(u => u.role === 'super_admin').length,
    admin: users.filter(u => u.role === 'admin').length,
    editor: users.filter(u => u.role === 'editor').length,
    viewer: users.filter(u => u.role === 'viewer').length,
  };

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={pageTitle}>
            <UserCog size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Quản trị hệ thống
          </h1>
          <p style={pageSubtitle}>Quản lý thành viên và phân quyền truy cập CMS</p>
        </div>
        <Button variant="secondary" onClick={copyInviteInfo} style={{ fontSize: 13 }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Đã copy' : 'Copy link mời'}
        </Button>
      </div>

      {/* Role stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={config.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>
                  {roleStats[key]}
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{config.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36, width: '100%' }}
          />
        </div>
      </div>

      {/* Users table */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body }}>
            Đang tải danh sách thành viên...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body }}>
            <UserPlus size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p>Chưa có thành viên nào. Thêm email vào danh sách cho phép trên Coolify.</p>
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
                {filteredUsers.map(user => {
                  const role = user.role as Role;
                  const config = ROLE_CONFIG[role] || ROLE_CONFIG.viewer;
                  const Icon = config.icon;
                  const isCurrentUser = (session?.user as any)?.id === user.id;

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
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                            <button
                              onClick={() => { setEditUser(user); setEditRole(user.role as Role); }}
                              style={actionBtnStyle}
                              title="Đổi vai trò"
                            >
                              <Shield size={15} />
                            </button>
                            {!isCurrentUser && (
                              <button
                                onClick={() => setDeleteUser(user)}
                                style={{ ...actionBtnStyle, color: '#ef4444' }}
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

      {/* Add member guide */}
      <div style={{ ...cardStyle, marginTop: 20, padding: '16px 20px', background: '#f0f9ff', borderLeft: `3px solid ${colors.primary}` }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary, marginBottom: 6, fontFamily: fonts.heading }}>
          Thêm thành viên mới
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
          1. Vào Coolify → App ADC Marketing → Environment Variables<br />
          2. Sửa <code style={{ background: '#e0f2fe', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>ADMIN_ALLOWED_EMAILS</code> → thêm email mới (phân cách bằng dấu phẩy)<br />
          3. Redeploy app → thành viên mới đăng nhập bằng Google OAuth<br />
          4. Quay lại đây để phân quyền cho thành viên
        </div>
      </div>

      {/* Edit role modal */}
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
              {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([key, config]) => {
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
            <Button
              onClick={handleRoleChange}
              disabled={saving || editRole === editUser.role}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete confirmation modal */}
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

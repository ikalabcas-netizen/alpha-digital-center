'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  secondaryButton,
  inputStyle,
  pageTitle,
  pageSubtitle,
  transitions,
} from '@/lib/styles';
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  FileText,
  Calendar,
  Eye,
  ToggleLeft,
  ToggleRight,
  Plus,
  Edit,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { apiGet, apiPost, apiPut, ApiError } from '@/lib/api-client';

type ActiveTab = 'postings' | 'applications';

type EmploymentType = 'full-time' | 'part-time';

interface JobPosting {
  id: string;
  titleVi: string;
  department: string | null;
  location: string;
  employmentType: string | null;
  descriptionVi: string;
  requirementsVi: string | null;
  benefitsVi: string | null;
  salaryRange: string | null;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  _count?: { applications: number };
}

type AppStatus = 'received' | 'reviewing' | 'interview' | 'hired' | 'rejected';

interface Application {
  id: string;
  jobId: string | null;
  job: { id: string; titleVi: string } | null;
  applicantName: string;
  phone: string;
  email: string | null;
  cvUrl: string | null;
  status: AppStatus;
  createdAt: string;
}

interface JobForm {
  titleVi: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  isActive: boolean;
  descriptionVi: string;
  requirementsVi: string;
  benefitsVi: string;
  salaryRange: string;
}

const appStatusConfig: Record<AppStatus, { bg: string; color: string; label: string }> = {
  received: { bg: '#ecfeff', color: '#0891b2', label: 'Đã nhận' },
  reviewing: { bg: '#eff6ff', color: '#2563eb', label: 'Đang xem xét' },
  interview: { bg: '#fffbeb', color: '#d97706', label: 'Phỏng vấn' },
  hired: { bg: '#f0fdf4', color: '#16a34a', label: 'Đã tuyển' },
  rejected: { bg: '#fff1f2', color: '#e11d48', label: 'Từ chối' },
};

const typeLabels: Record<string, string> = {
  'full-time': 'Toàn thời gian',
  'part-time': 'Bán thời gian',
};

const EMPTY_JOB: JobForm = {
  titleVi: '',
  department: '',
  location: 'TP.HCM',
  employmentType: 'full-time',
  isActive: true,
  descriptionVi: '',
  requirementsVi: '',
  benefitsVi: '',
  salaryRange: '',
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('postings');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState<JobForm>(EMPTY_JOB);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [js, as] = await Promise.all([
        apiGet<JobPosting[]>('/api/admin/recruitment/jobs'),
        apiGet<Application[]>('/api/admin/recruitment/applications'),
      ]);
      setJobs(js);
      setApplications(as);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleActive(job: JobPosting) {
    const previous = jobs;
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, isActive: !j.isActive } : j))
    );
    try {
      await apiPut(`/api/admin/recruitment/jobs/${job.id}`, {
        isActive: !job.isActive,
      });
    } catch (e) {
      setJobs(previous);
      setError(e instanceof ApiError ? e.message : 'Cập nhật thất bại');
    }
  }

  function handleEditJob(job: JobPosting) {
    setEditingJobId(job.id);
    setJobForm({
      titleVi: job.titleVi,
      department: job.department || '',
      location: job.location,
      employmentType: (job.employmentType as EmploymentType) || 'full-time',
      isActive: job.isActive,
      descriptionVi: job.descriptionVi,
      requirementsVi: job.requirementsVi || '',
      benefitsVi: job.benefitsVi || '',
      salaryRange: job.salaryRange || '',
    });
    setShowJobModal(true);
  }

  function handleNewJob() {
    setEditingJobId(null);
    setJobForm(EMPTY_JOB);
    setShowJobModal(true);
  }

  async function handleSaveJob() {
    if (!jobForm.titleVi.trim() || !jobForm.descriptionVi.trim()) {
      setError('Tiêu đề và mô tả công việc là bắt buộc');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      titleVi: jobForm.titleVi,
      department: jobForm.department || null,
      location: jobForm.location,
      employmentType: jobForm.employmentType,
      descriptionVi: jobForm.descriptionVi,
      requirementsVi: jobForm.requirementsVi || null,
      benefitsVi: jobForm.benefitsVi || null,
      salaryRange: jobForm.salaryRange || null,
      isActive: jobForm.isActive,
    };
    try {
      if (editingJobId) {
        await apiPut(`/api/admin/recruitment/jobs/${editingJobId}`, payload);
      } else {
        await apiPost('/api/admin/recruitment/jobs', payload);
      }
      setShowJobModal(false);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  }

  async function handleAppStatusChange(appId: string, newStatus: AppStatus) {
    const previous = applications;
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    try {
      await apiPut(`/api/admin/recruitment/applications/${appId}`, {
        status: newStatus,
      });
    } catch (e) {
      setApplications(previous);
      setError(e instanceof ApiError ? e.message : 'Cập nhật thất bại');
    }
  }

  const activeJobCount = jobs.filter((j) => j.isActive).length;

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Quản lý Tuyển dụng</h1>
        <p style={pageSubtitle}>
          {activeJobCount} vị trí đang tuyển - {applications.length} hồ sơ ứng tuyển
        </p>
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
          gap: 0,
          marginBottom: 20,
          borderBottom: `2px solid ${colors.border}`,
        }}
      >
        {[
          { key: 'postings' as ActiveTab, label: 'Tin tuyển dụng', icon: Briefcase },
          { key: 'applications' as ActiveTab, label: 'Hồ sơ ứng tuyển', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                border: 'none',
                borderBottom: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
                marginBottom: -2,
                background: 'none',
                color: isActive ? colors.primary : colors.textSecondary,
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: fonts.body,
                transition: transitions.fast,
              }}
            >
              <Icon size={16} />
              {tab.label}
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

      {activeTab === 'postings' && !loading && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button onClick={handleNewJob}>
              <Plus size={16} />
              Tạo tin mới
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  ...cardStyle,
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: job.isActive ? 1 : 0.65,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: colors.primaryBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={20} color={colors.primary} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      fontFamily: fonts.body,
                      marginBottom: 4,
                    }}
                  >
                    {job.titleVi}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}
                  >
                    {job.department && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          color: colors.textMuted,
                          fontFamily: fonts.body,
                        }}
                      >
                        <Users size={12} />
                        {job.department}
                      </span>
                    )}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: colors.textMuted,
                        fontFamily: fonts.body,
                      }}
                    >
                      <MapPin size={12} />
                      {job.location}
                    </span>
                    {job.employmentType && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          color: colors.textMuted,
                          fontFamily: fonts.body,
                        }}
                      >
                        <Clock size={12} />
                        {typeLabels[job.employmentType] || job.employmentType}
                      </span>
                    )}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: colors.textMuted,
                        fontFamily: fonts.body,
                      }}
                    >
                      <Calendar size={12} />
                      {formatDate(job.publishedAt || job.createdAt)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.primary,
                        fontFamily: fonts.heading,
                      }}
                    >
                      {job._count?.applications ?? 0}
                    </div>
                    <div style={{ fontSize: 11, color: colors.textMuted, fontFamily: fonts.body }}>
                      ứng tuyển
                    </div>
                  </div>

                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: job.isActive ? '#f0fdf4' : '#f8fafc',
                      color: job.isActive ? '#16a34a' : '#94a3b8',
                      fontFamily: fonts.body,
                    }}
                  >
                    {job.isActive ? 'Đang tuyển' : 'Đã đóng'}
                  </span>

                  <button
                    onClick={() => handleEditJob(job)}
                    style={{
                      ...secondaryButton,
                      padding: '6px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Edit size={14} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleActive(job)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: job.isActive ? colors.success : colors.textMuted,
                      padding: 4,
                    }}
                    title={job.isActive ? 'Tắt tuyển dụng' : 'Bật tuyển dụng'}
                  >
                    {job.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div
                style={{
                  ...cardStyle,
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: colors.textMuted,
                }}
              >
                Chưa có tin tuyển dụng nào
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'applications' && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                ...cardStyle,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: colors.primaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: 15,
                  color: colors.primary,
                  fontFamily: fonts.heading,
                }}
              >
                {app.applicantName.charAt(0)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontFamily: fonts.body,
                    marginBottom: 4,
                  }}
                >
                  {app.applicantName}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: colors.textMuted,
                      fontFamily: fonts.body,
                    }}
                  >
                    <Phone size={12} />
                    {app.phone}
                  </span>
                  {app.email && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: colors.textMuted,
                        fontFamily: fonts.body,
                      }}
                    >
                      <Mail size={12} />
                      {app.email}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  fontFamily: fonts.body,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {app.job?.titleVi || 'Ứng tuyển tổng'}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: colors.textMuted,
                  fontFamily: fonts.body,
                  flexShrink: 0,
                }}
              >
                <Calendar size={12} />
                {formatDate(app.createdAt)}
              </div>

              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: appStatusConfig[app.status].bg,
                  color: appStatusConfig[app.status].color,
                  fontFamily: fonts.body,
                  flexShrink: 0,
                }}
              >
                {appStatusConfig[app.status].label}
              </span>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {app.cvUrl && (
                  <a
                    href={app.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...secondaryButton,
                      padding: '5px 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      textDecoration: 'none',
                    }}
                  >
                    <Eye size={13} />
                    Xem CV
                  </a>
                )}
                <select
                  value={app.status}
                  onChange={(e) =>
                    handleAppStatusChange(app.id, e.target.value as AppStatus)
                  }
                  style={{
                    ...inputStyle,
                    width: 'auto',
                    padding: '4px 24px 4px 8px',
                    fontSize: 12,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 6px center',
                    cursor: 'pointer',
                  }}
                >
                  <option value="received">Đã nhận</option>
                  <option value="reviewing">Đang xem xét</option>
                  <option value="interview">Phỏng vấn</option>
                  <option value="hired">Đã tuyển</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <div
              style={{
                ...cardStyle,
                textAlign: 'center',
                padding: '48px 24px',
                color: colors.textMuted,
              }}
            >
              Chưa có hồ sơ ứng tuyển nào
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        title={editingJobId ? 'Chỉnh sửa tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}
        maxWidth={600}
      >
        <div>
          <Input
            label="Tiêu đề"
            placeholder="VD: Kỹ thuật viên CAD/CAM"
            value={jobForm.titleVi}
            onChange={(e) => setJobForm({ ...jobForm, titleVi: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Phòng ban"
              placeholder="VD: Kỹ thuật"
              value={jobForm.department}
              onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
            />
            <Input
              label="Địa điểm"
              placeholder="VD: TP.HCM"
              value={jobForm.location}
              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
                Loại hình
              </label>
              <select
                value={jobForm.employmentType}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    employmentType: e.target.value as EmploymentType,
                  })
                }
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  paddingRight: 28,
                  cursor: 'pointer',
                }}
              >
                <option value="full-time">Toàn thời gian</option>
                <option value="part-time">Bán thời gian</option>
              </select>
            </div>
            <Input
              label="Mức lương"
              placeholder="VD: 12 - 20 triệu"
              value={jobForm.salaryRange}
              onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
            />
          </div>

          <Textarea
            label="Mô tả công việc"
            placeholder="Mô tả chi tiết công việc..."
            rows={3}
            value={jobForm.descriptionVi}
            onChange={(e) => setJobForm({ ...jobForm, descriptionVi: e.target.value })}
          />

          <Textarea
            label="Yêu cầu"
            placeholder="Mỗi yêu cầu trên một dòng..."
            rows={3}
            value={jobForm.requirementsVi}
            onChange={(e) => setJobForm({ ...jobForm, requirementsVi: e.target.value })}
          />

          <Textarea
            label="Quyền lợi"
            placeholder="Mỗi quyền lợi trên một dòng..."
            rows={3}
            value={jobForm.benefitsVi}
            onChange={(e) => setJobForm({ ...jobForm, benefitsVi: e.target.value })}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={() => setJobForm({ ...jobForm, isActive: !jobForm.isActive })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: jobForm.isActive ? colors.success : colors.textMuted,
                padding: 0,
              }}
            >
              {jobForm.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
            <span
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                fontFamily: fonts.body,
              }}
            >
              {jobForm.isActive ? 'Đang tuyển' : 'Tạm dừng'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowJobModal(false)} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={handleSaveJob} disabled={saving}>
              {saving ? 'Đang lưu...' : editingJobId ? 'Cập nhật' : 'Tạo tin'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

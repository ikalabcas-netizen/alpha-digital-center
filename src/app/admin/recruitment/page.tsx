'use client';

import React, { useState } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  primaryButton,
  secondaryButton,
  inputStyle,
  pageTitle,
  pageSubtitle,
  transitions,
  getBadgeStyle,
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

type ActiveTab = 'postings' | 'applications';

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time';
  active: boolean;
  applicationCount: number;
  publishDate: string;
  description: string;
  requirements: string;
  benefits: string;
  salaryRange: string;
}

type AppStatus = 'received' | 'reviewing' | 'interview' | 'hired' | 'rejected';

interface Application {
  id: number;
  applicantName: string;
  phone: string;
  email: string;
  appliedJob: string;
  status: AppStatus;
  date: string;
  cvUrl: string;
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

const initialJobs: JobPosting[] = [
  {
    id: 1,
    title: 'Kỹ thuật viên CAD/CAM',
    department: 'Kỹ thuật',
    location: 'TP.HCM',
    type: 'full-time',
    active: true,
    applicationCount: 8,
    publishDate: '01/04/2026',
    description: 'Thiết kế phục hình răng sứ bằng phần mềm CAD/CAM chuyên dụng. Làm việc với các hệ thống scan 3D và máy phay hiện đại.',
    requirements: 'Tốt nghiệp Trung cấp Nha khoa trở lên.\nCó kinh nghiệm sử dụng phần mềm Exocad, 3Shape.\nCó khả năng làm việc nhóm và chịu được áp lực.',
    benefits: 'Lương cạnh tranh, thưởng hiệu suất.\nBảo hiểm xã hội đầy đủ.\nĐược đào tạo các công nghệ mới.\nMôi trường làm việc chuyên nghiệp.',
    salaryRange: '12 - 20 triệu',
  },
  {
    id: 2,
    title: 'Kỹ thuật viên Labo',
    department: 'Sản xuất',
    location: 'TP.HCM',
    type: 'full-time',
    active: true,
    applicationCount: 12,
    publishDate: '05/04/2026',
    description: 'Gia công răng sứ, phục hình thẩm mỹ. Thao tác trên các loại vật liệu Zirconia, Emax, kim loại.',
    requirements: 'Tốt nghiệp Trung cấp Nha khoa.\nÍt nhất 1 năm kinh nghiệm làm việc tại labo.\nKhéo tay, tỉ mỉ, có mắt thẩm mỹ.',
    benefits: 'Lương theo năng lực.\nBảo hiểm xã hội.\nThưởng lễ, tết.\nCơ hội thăng tiến.',
    salaryRange: '10 - 18 triệu',
  },
  {
    id: 3,
    title: 'Nhân viên kinh doanh',
    department: 'Kinh doanh',
    location: 'TP.HCM',
    type: 'full-time',
    active: false,
    applicationCount: 5,
    publishDate: '20/03/2026',
    description: 'Tìm kiếm và phát triển khách hàng mới (phòng khám nha khoa, labo). Duy trì quan hệ khách hàng hiện tại.',
    requirements: 'Tốt nghiệp Cao đẳng trở lên.\nCó kinh nghiệm kinh doanh B2B.\nKỹ năng giao tiếp tốt.\nCó xe máy và GPLX.',
    benefits: 'Lương cơ bản + hoa hồng hấp dẫn.\nHỗ trợ chi phí đi lại.\nBảo hiểm xã hội.\nDu lịch hàng năm.',
    salaryRange: '10 - 25 triệu',
  },
];

const initialApplications: Application[] = [
  {
    id: 1,
    applicantName: 'Lê Thị Mai',
    phone: '0912 111 222',
    email: 'mai.le@gmail.com',
    appliedJob: 'Kỹ thuật viên CAD/CAM',
    status: 'received',
    date: '12/04/2026',
    cvUrl: '#',
  },
  {
    id: 2,
    applicantName: 'Nguyễn Quốc Đạt',
    phone: '0987 333 444',
    email: 'dat.nguyen@gmail.com',
    appliedJob: 'Kỹ thuật viên Labo',
    status: 'reviewing',
    date: '11/04/2026',
    cvUrl: '#',
  },
  {
    id: 3,
    applicantName: 'Trần Văn Tiến',
    phone: '0903 555 666',
    email: 'tien.tran@gmail.com',
    appliedJob: 'Nhân viên kinh doanh',
    status: 'interview',
    date: '10/04/2026',
    cvUrl: '#',
  },
  {
    id: 4,
    applicantName: 'Phạm Ngọc Anh',
    phone: '0976 777 888',
    email: 'anh.pham@gmail.com',
    appliedJob: 'Kỹ thuật viên CAD/CAM',
    status: 'hired',
    date: '05/04/2026',
    cvUrl: '#',
  },
  {
    id: 5,
    applicantName: 'Võ Hoàng Long',
    phone: '0918 999 000',
    email: 'long.vo@gmail.com',
    appliedJob: 'Kỹ thuật viên Labo',
    status: 'rejected',
    date: '03/04/2026',
    cvUrl: '#',
  },
];

const emptyJob: Omit<JobPosting, 'id' | 'applicationCount' | 'publishDate'> = {
  title: '',
  department: '',
  location: 'TP.HCM',
  type: 'full-time',
  active: true,
  description: '',
  requirements: '',
  benefits: '',
  salaryRange: '',
};

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('postings');
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobForm, setJobForm] = useState(emptyJob);

  const handleToggleActive = (jobId: number) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, active: !j.active } : j))
    );
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      active: job.active,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      salaryRange: job.salaryRange,
    });
    setShowJobModal(true);
  };

  const handleNewJob = () => {
    setEditingJob(null);
    setJobForm({ ...emptyJob });
    setShowJobModal(true);
  };

  const handleSaveJob = () => {
    if (!jobForm.title.trim()) return;
    if (editingJob) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id
            ? { ...j, ...jobForm }
            : j
        )
      );
    } else {
      const newJob: JobPosting = {
        ...jobForm,
        id: Date.now(),
        applicationCount: 0,
        publishDate: new Date().toLocaleDateString('vi-VN'),
      };
      setJobs((prev) => [newJob, ...prev]);
    }
    setShowJobModal(false);
  };

  const handleAppStatusChange = (appId: number, newStatus: AppStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Quản lý Tuyển dụng</h1>
        <p style={pageSubtitle}>
          {jobs.filter((j) => j.active).length} vị trí đang tuyển -{' '}
          {applications.length} hồ sơ ứng tuyển
        </p>
      </div>

      {/* Tabs */}
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

      {/* Tab 1: Job Postings */}
      {activeTab === 'postings' && (
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
                  opacity: job.active ? 1 : 0.65,
                }}
              >
                {/* Icon */}
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

                {/* Main Info */}
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
                    {job.title}
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
                      <Users size={12} />
                      {job.department}
                    </span>
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
                      {typeLabels[job.type]}
                    </span>
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
                      {job.publishDate}
                    </span>
                  </div>
                </div>

                {/* Right Info */}
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
                      {job.applicationCount}
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
                      background: job.active ? '#f0fdf4' : '#f8fafc',
                      color: job.active ? '#16a34a' : '#94a3b8',
                      fontFamily: fonts.body,
                    }}
                  >
                    {job.active ? 'Đang tuyển' : 'Đã đóng'}
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
                    onClick={() => handleToggleActive(job.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: job.active ? colors.success : colors.textMuted,
                      padding: 4,
                    }}
                    title={job.active ? 'Tắt tuyển dụng' : 'Bật tuyển dụng'}
                  >
                    {job.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Applications */}
      {activeTab === 'applications' && (
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
              {/* Avatar */}
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

              {/* Main Info */}
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
                </div>
              </div>

              {/* Job Applied */}
              <div
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  fontFamily: fonts.body,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {app.appliedJob}
              </div>

              {/* Date */}
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
                {app.date}
              </div>

              {/* Status Badge */}
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

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => {
                    /* CV viewer placeholder */
                  }}
                  style={{
                    ...secondaryButton,
                    padding: '5px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                  }}
                >
                  <Eye size={13} />
                  Xem CV
                </button>
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
        </div>
      )}

      {/* Add/Edit Job Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        title={editingJob ? 'Chỉnh sửa tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}
        maxWidth={600}
      >
        <div>
          <Input
            label="Tiêu đề"
            placeholder="VD: Kỹ thuật viên CAD/CAM"
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
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
                value={jobForm.type}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    type: e.target.value as 'full-time' | 'part-time',
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
            value={jobForm.description}
            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
          />

          <Textarea
            label="Yêu cầu"
            placeholder="Mỗi yêu cầu trên một dòng..."
            rows={3}
            value={jobForm.requirements}
            onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
          />

          <Textarea
            label="Quyền lợi"
            placeholder="Mỗi quyền lợi trên một dòng..."
            rows={3}
            value={jobForm.benefits}
            onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
          />

          {/* Active toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => setJobForm({ ...jobForm, active: !jobForm.active })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: jobForm.active ? colors.success : colors.textMuted,
                padding: 0,
              }}
            >
              {jobForm.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
            <span
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                fontFamily: fonts.body,
              }}
            >
              {jobForm.active ? 'Đang tuyển' : 'Tạm dừng'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowJobModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveJob}>
              {editingJob ? 'Cập nhật' : 'Tạo tin'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

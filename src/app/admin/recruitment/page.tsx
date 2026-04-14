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
  received: { bg: '#ecfeff', color: '#0891b2', label: 'Da nhan' },
  reviewing: { bg: '#eff6ff', color: '#2563eb', label: 'Dang xem xet' },
  interview: { bg: '#fffbeb', color: '#d97706', label: 'Phong van' },
  hired: { bg: '#f0fdf4', color: '#16a34a', label: 'Da tuyen' },
  rejected: { bg: '#fff1f2', color: '#e11d48', label: 'Tu choi' },
};

const typeLabels: Record<string, string> = {
  'full-time': 'Toan thoi gian',
  'part-time': 'Ban thoi gian',
};

const initialJobs: JobPosting[] = [
  {
    id: 1,
    title: 'Ky thuat vien CAD/CAM',
    department: 'Ky thuat',
    location: 'TP.HCM',
    type: 'full-time',
    active: true,
    applicationCount: 8,
    publishDate: '01/04/2026',
    description: 'Thiet ke phuc hinh rang su bang phan mem CAD/CAM chuyen dung. Lam viec voi cac he thong scan 3D va may phay hien dai.',
    requirements: 'Tot nghiep Trung cap Nha khoa tro len.\nCo kinh nghiem su dung phan mem Exocad, 3Shape.\nCo kha nang lam viec nhom va chiu duoc ap luc.',
    benefits: 'Luong canh tranh, thuong hieu suat.\nBao hiem xa hoi day du.\nDuoc dao tao cac cong nghe moi.\nMoi truong lam viec chuyen nghiep.',
    salaryRange: '12 - 20 trieu',
  },
  {
    id: 2,
    title: 'Ky thuat vien Labo',
    department: 'San xuat',
    location: 'TP.HCM',
    type: 'full-time',
    active: true,
    applicationCount: 12,
    publishDate: '05/04/2026',
    description: 'Gia cong rang su, phuc hinh tham my. Thao tac tren cac loai vat lieu Zirconia, Emax, kim loai.',
    requirements: 'Tot nghiep Trung cap Nha khoa.\nIt nhat 1 nam kinh nghiem lam viec tai labo.\nKheo tay, ti mi, co mat tham my.',
    benefits: 'Luong theo nang luc.\nBao hiem xa hoi.\nThuong le, tet.\nCo hoi thang tien.',
    salaryRange: '10 - 18 trieu',
  },
  {
    id: 3,
    title: 'Nhan vien kinh doanh',
    department: 'Kinh doanh',
    location: 'TP.HCM',
    type: 'full-time',
    active: false,
    applicationCount: 5,
    publishDate: '20/03/2026',
    description: 'Tim kiem va phat trien khach hang moi (phong kham nha khoa, labo). Duy tri quan he khach hang hien tai.',
    requirements: 'Tot nghiep Cao dang tro len.\nCo kinh nghiem kinh doanh B2B.\nKy nang giao tiep tot.\nCo xe may va GPLX.',
    benefits: 'Luong co ban + hoa hong hap dan.\nHo tro chi phi di lai.\nBao hiem xa hoi.\nDu lich hang nam.',
    salaryRange: '10 - 25 trieu',
  },
];

const initialApplications: Application[] = [
  {
    id: 1,
    applicantName: 'Le Thi Mai',
    phone: '0912 111 222',
    email: 'mai.le@gmail.com',
    appliedJob: 'Ky thuat vien CAD/CAM',
    status: 'received',
    date: '12/04/2026',
    cvUrl: '#',
  },
  {
    id: 2,
    applicantName: 'Nguyen Quoc Dat',
    phone: '0987 333 444',
    email: 'dat.nguyen@gmail.com',
    appliedJob: 'Ky thuat vien Labo',
    status: 'reviewing',
    date: '11/04/2026',
    cvUrl: '#',
  },
  {
    id: 3,
    applicantName: 'Tran Van Tien',
    phone: '0903 555 666',
    email: 'tien.tran@gmail.com',
    appliedJob: 'Nhan vien kinh doanh',
    status: 'interview',
    date: '10/04/2026',
    cvUrl: '#',
  },
  {
    id: 4,
    applicantName: 'Pham Ngoc Anh',
    phone: '0976 777 888',
    email: 'anh.pham@gmail.com',
    appliedJob: 'Ky thuat vien CAD/CAM',
    status: 'hired',
    date: '05/04/2026',
    cvUrl: '#',
  },
  {
    id: 5,
    applicantName: 'Vo Hoang Long',
    phone: '0918 999 000',
    email: 'long.vo@gmail.com',
    appliedJob: 'Ky thuat vien Labo',
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
        <h1 style={pageTitle}>Quan ly Tuyen dung</h1>
        <p style={pageSubtitle}>
          {jobs.filter((j) => j.active).length} vi tri dang tuyen -{' '}
          {applications.length} ho so ung tuyen
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
          { key: 'postings' as ActiveTab, label: 'Tin tuyen dung', icon: Briefcase },
          { key: 'applications' as ActiveTab, label: 'Ho so ung tuyen', icon: FileText },
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
              Tao tin moi
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
                      ung tuyen
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
                    {job.active ? 'Dang tuyen' : 'Da dong'}
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
                    Sua
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
                    title={job.active ? 'Tat tuyen dung' : 'Bat tuyen dung'}
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
                  <option value="received">Da nhan</option>
                  <option value="reviewing">Dang xem xet</option>
                  <option value="interview">Phong van</option>
                  <option value="hired">Da tuyen</option>
                  <option value="rejected">Tu choi</option>
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
        title={editingJob ? 'Chinh sua tin tuyen dung' : 'Tao tin tuyen dung moi'}
        maxWidth={600}
      >
        <div>
          <Input
            label="Tieu de"
            placeholder="VD: Ky thuat vien CAD/CAM"
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Phong ban"
              placeholder="VD: Ky thuat"
              value={jobForm.department}
              onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
            />
            <Input
              label="Dia diem"
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
                Loai hinh
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
                <option value="full-time">Toan thoi gian</option>
                <option value="part-time">Ban thoi gian</option>
              </select>
            </div>
            <Input
              label="Muc luong"
              placeholder="VD: 12 - 20 trieu"
              value={jobForm.salaryRange}
              onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
            />
          </div>

          <Textarea
            label="Mo ta cong viec"
            placeholder="Mo ta chi tiet cong viec..."
            rows={3}
            value={jobForm.description}
            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
          />

          <Textarea
            label="Yeu cau"
            placeholder="Moi yeu cau tren mot dong..."
            rows={3}
            value={jobForm.requirements}
            onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
          />

          <Textarea
            label="Quyen loi"
            placeholder="Moi quyen loi tren mot dong..."
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
              {jobForm.active ? 'Dang tuyen' : 'Tam dung'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowJobModal(false)}>
              Huy
            </Button>
            <Button onClick={handleSaveJob}>
              {editingJob ? 'Cap nhat' : 'Tao tin'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

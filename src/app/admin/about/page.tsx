'use client';

import React, { useState, useCallback } from 'react';
import {
  colors,
  fonts,
  cardStyle,
  pageTitle,
  pageSubtitle,
  transitions,
} from '@/lib/styles';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Target,
  Clock,
  Cpu,
  Users,
  Plus,
  Trash2,
  Save,
  Check,
} from 'lucide-react';

// ---- Types ----

interface MissionData {
  mission: string;
  vision: string;
  values: string;
}

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface Equipment {
  id: string;
  name: string;
  description: string;
  specs: string;
}

interface TeamStats {
  cadcam: number;
  labo: number;
  sales: number;
  admin: number;
}

// ---- Section Header Component ----

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 18,
        paddingBottom: 12,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: colors.primaryBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={16} color={colors.primary} />
      </div>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: colors.textPrimary,
          fontFamily: fonts.heading,
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// ---- Toast Component ----

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: colors.success,
        color: colors.white,
        padding: '12px 20px',
        borderRadius: 8,
        fontSize: 13,
        fontFamily: fonts.body,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
      }}
    >
      <Check size={16} />
      {message}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: colors.white,
          cursor: 'pointer',
          marginLeft: 8,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ---- Default Data ----

let idCounter = 100;
function nextId() {
  return String(++idCounter);
}

const defaultMission: MissionData = {
  mission:
    'Trở thành đối tác gia công nha khoa tin cậy nhất tại Việt Nam, mang đến sản phẩm chất lượng quốc tế với giá thành hợp lý.',
  vision:
    'Dẫn đầu ngành gia công nha khoa số tại Việt Nam và vươn tầm khu vực Đông Nam Á vào năm 2030.',
  values:
    'Chất lượng - Chính xác - Đổi mới - Tận tâm. Chúng tôi luôn đặt chất lượng sản phẩm lên hàng đầu, không ngừng cải tiến công nghệ và phục vụ khách hàng bằng sự tận tâm.',
};

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    year: '2014',
    title: 'Thành lập',
    description:
      'Alpha Digital Center được thành lập tại TP.HCM với đội ngũ 5 kỹ thuật viên.',
  },
  {
    id: '2',
    year: '2016',
    title: 'Đầu tư CAD/CAM',
    description:
      'Đầu tư hệ thống CAD/CAM đầu tiên, nâng cấp năng lực sản xuất số.',
  },
  {
    id: '3',
    year: '2018',
    title: 'Mở rộng quy mô',
    description:
    'Mở rộng nhà xưởng lên 300m², đạt 200+ labo đối tác.',
  },
  {
    id: '4',
    year: '2021',
    title: 'CNC 5 trục',
    description:
      'Đầu tư máy CNC 5 trục và scanner 3D thế hệ mới.',
  },
  {
    id: '5',
    year: '2023',
    title: 'Chuyển đổi số',
    description:
      'Triển khai hệ thống quản lý số toàn diện, đạt 500+ labo đối tác.',
  },
];

const defaultEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Máy CNC 5 trục',
    description:
      'Máy phay CNC 5 trục chuyên dụng cho gia công Zirconia và kim loại nha khoa.',
    specs: 'Độ chính xác: ±5μm\nTốc độ trục chính: 60,000 rpm\nSố trục: 5 trục đồng thời',
  },
  {
    id: '2',
    name: 'Scanner 3D',
    description:
      'Máy quét 3D độ phân giải cao cho scan mẫu và scan trong miệng.',
    specs: 'Độ phân giải: 7μm\nTốc độ quét: 10 giây/cầu\nCông nghệ: Ánh sáng cấu trúc',
  },
  {
    id: '3',
    name: 'Máy in 3D',
    description:
      'Máy in 3D SLA cho in mẫu, hướng dẫn phẫu thuật và khám hàm.',
    specs: 'Độ phân giải lớp: 25μm\nĐộ chính xác XY: 50μm\nVật liệu: Resin nha khoa',
  },
];

const defaultTeamStats: TeamStats = {
  cadcam: 8,
  labo: 12,
  sales: 6,
  admin: 4,
};

// ---- Main Component ----

export default function AboutManager() {
  const [mission, setMission] = useState<MissionData>(defaultMission);
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [equipment, setEquipment] = useState<Equipment[]>(defaultEquipment);
  const [team, setTeam] = useState<TeamStats>(defaultTeamStats);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    // Placeholder: simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    showToast('Đã lưu tất cả nội dung thành công!');
  }, [showToast]);

  // Milestones
  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { id: nextId(), year: '', title: '', description: '' },
    ]);
  };

  const removeMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMilestone = (
    id: string,
    field: keyof Omit<Milestone, 'id'>,
    value: string
  ) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Equipment
  const addEquipment = () => {
    setEquipment((prev) => [
      ...prev,
      { id: nextId(), name: '', description: '', specs: '' },
    ]);
  };

  const removeEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEquipment = (
    id: string,
    field: keyof Omit<Equipment, 'id'>,
    value: string
  ) => {
    setEquipment((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Quản lý Giới thiệu</h1>
        <p style={pageSubtitle}>
          Chỉnh sửa nội dung trang Giới thiệu của website
        </p>
      </div>

      {/* Section 1: Mission / Vision / Values */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Target} title="Sứ mệnh / Tầm nhìn / Giá trị" />

        <Textarea
          label="Sứ mệnh"
          value={mission.mission}
          onChange={(e) => setMission({ ...mission, mission: e.target.value })}
          placeholder="Nhập sứ mệnh của công ty..."
          style={{ minHeight: 100 }}
        />
        <Textarea
          label="Tầm nhìn"
          value={mission.vision}
          onChange={(e) => setMission({ ...mission, vision: e.target.value })}
          placeholder="Nhập tầm nhìn của công ty..."
          style={{ minHeight: 100 }}
        />
        <Textarea
          label="Giá trị cốt lõi"
          value={mission.values}
          onChange={(e) => setMission({ ...mission, values: e.target.value })}
          placeholder="Nhập giá trị cốt lõi..."
          style={{ minHeight: 100 }}
        />
      </div>

      {/* Section 2: Timeline / Milestones */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Clock} title="Lịch sử phát triển" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {milestones.map((milestone, idx) => (
            <div
              key={milestone.id}
              style={{
                padding: 14,
                background: colors.pageBg,
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.textMuted,
                    fontFamily: fonts.body,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Mốc {idx + 1}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeMilestone(milestone.id)}
                  style={{ padding: '4px 8px' }}
                >
                  <Trash2 size={13} />
                  Xóa
                </Button>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: 12,
                }}
              >
                <Input
                  label="Năm"
                  value={milestone.year}
                  onChange={(e) =>
                    updateMilestone(milestone.id, 'year', e.target.value)
                  }
                  placeholder="VD: 2014"
                />
                <Input
                  label="Tiêu đề"
                  value={milestone.title}
                  onChange={(e) =>
                    updateMilestone(milestone.id, 'title', e.target.value)
                  }
                  placeholder="Nhập tiêu đề mốc..."
                />
              </div>
              <Textarea
                label="Mô tả"
                value={milestone.description}
                onChange={(e) =>
                  updateMilestone(milestone.id, 'description', e.target.value)
                }
                placeholder="Mô tả chi tiết..."
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Button variant="secondary" onClick={addMilestone}>
            <Plus size={14} />
            Thêm mốc mới
          </Button>
        </div>
      </div>

      {/* Section 3: Equipment & Technology */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Cpu} title="Thiết bị & Công nghệ" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {equipment.map((eq, idx) => (
            <div
              key={eq.id}
              style={{
                padding: 14,
                background: colors.pageBg,
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.textMuted,
                    fontFamily: fonts.body,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Thiết bị {idx + 1}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeEquipment(eq.id)}
                  style={{ padding: '4px 8px' }}
                >
                  <Trash2 size={13} />
                  Xóa
                </Button>
              </div>
              <Input
                label="Tên thiết bị"
                value={eq.name}
                onChange={(e) =>
                  updateEquipment(eq.id, 'name', e.target.value)
                }
                placeholder="Nhập tên thiết bị..."
              />
              <Textarea
                label="Mô tả"
                value={eq.description}
                onChange={(e) =>
                  updateEquipment(eq.id, 'description', e.target.value)
                }
                placeholder="Mô tả thiết bị..."
              />
              <Textarea
                label="Thông số kỹ thuật"
                value={eq.specs}
                onChange={(e) =>
                  updateEquipment(eq.id, 'specs', e.target.value)
                }
                placeholder="Thông số kỹ thuật (mỗi dòng một thông số)..."
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Button variant="secondary" onClick={addEquipment}>
            <Plus size={14} />
            Thêm thiết bị mới
          </Button>
        </div>
      </div>

      {/* Section 4: Team Stats */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Users} title="Đội ngũ" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <div
            style={{
              padding: 14,
              background: colors.pageBg,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Input
              label="KTV CAD/CAM"
              type="number"
              value={String(team.cadcam)}
              onChange={(e) =>
                setTeam({ ...team, cadcam: Number(e.target.value) || 0 })
              }
              placeholder="Số lượng"
            />
          </div>
          <div
            style={{
              padding: 14,
              background: colors.pageBg,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Input
              label="KTV Labo"
              type="number"
              value={String(team.labo)}
              onChange={(e) =>
                setTeam({ ...team, labo: Number(e.target.value) || 0 })
              }
              placeholder="Số lượng"
            />
          </div>
          <div
            style={{
              padding: 14,
              background: colors.pageBg,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Input
              label="Kinh doanh"
              type="number"
              value={String(team.sales)}
              onChange={(e) =>
                setTeam({ ...team, sales: Number(e.target.value) || 0 })
              }
              placeholder="Số lượng"
            />
          </div>
          <div
            style={{
              padding: 14,
              background: colors.pageBg,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Input
              label="Hành chính"
              type="number"
              value={String(team.admin)}
              onChange={(e) =>
                setTeam({ ...team, admin: Number(e.target.value) || 0 })
              }
              placeholder="Số lượng"
            />
          </div>
        </div>
      </div>

      {/* Save All Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: 32,
        }}
      >
        <Button size="lg" loading={saving} onClick={handleSaveAll}>
          <Save size={16} />
          Lưu tất cả
        </Button>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

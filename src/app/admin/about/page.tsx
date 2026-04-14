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
        \u00d7
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
    'Tr\u1edf th\u00e0nh \u0111\u1ed1i t\u00e1c gia c\u00f4ng nha khoa tin c\u1eady nh\u1ea5t t\u1ea1i Vi\u1ec7t Nam, mang \u0111\u1ebfn s\u1ea3n ph\u1ea9m ch\u1ea5t l\u01b0\u1ee3ng qu\u1ed1c t\u1ebf v\u1edbi gi\u00e1 th\u00e0nh h\u1ee3p l\u00fd.',
  vision:
    'D\u1eabn \u0111\u1ea7u ng\u00e0nh gia c\u00f4ng nha khoa s\u1ed1 t\u1ea1i Vi\u1ec7t Nam v\u00e0 v\u01b0\u01a1n t\u1ea7m khu v\u1ef1c \u0110\u00f4ng Nam \u00c1 v\u00e0o n\u0103m 2030.',
  values:
    'Ch\u1ea5t l\u01b0\u1ee3ng - Ch\u00ednh x\u00e1c - \u0110\u1ed5i m\u1edbi - T\u1eadn t\u00e2m. Ch\u00fang t\u00f4i lu\u00f4n \u0111\u1eb7t ch\u1ea5t l\u01b0\u1ee3ng s\u1ea3n ph\u1ea9m l\u00ean h\u00e0ng \u0111\u1ea7u, kh\u00f4ng ng\u1eebng c\u1ea3i ti\u1ebfn c\u00f4ng ngh\u1ec7 v\u00e0 ph\u1ee5c v\u1ee5 kh\u00e1ch h\u00e0ng b\u1eb1ng s\u1ef1 t\u1eadn t\u00e2m.',
};

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    year: '2014',
    title: 'Th\u00e0nh l\u1eadp',
    description:
      'Alpha Digital Center \u0111\u01b0\u1ee3c th\u00e0nh l\u1eadp t\u1ea1i TP.HCM v\u1edbi \u0111\u1ed9i ng\u0169 5 k\u1ef9 thu\u1eadt vi\u00ean.',
  },
  {
    id: '2',
    year: '2016',
    title: '\u0110\u1ea7u t\u01b0 CAD/CAM',
    description:
      '\u0110\u1ea7u t\u01b0 h\u1ec7 th\u1ed1ng CAD/CAM \u0111\u1ea7u ti\u00ean, n\u00e2ng c\u1ea5p n\u0103ng l\u1ef1c s\u1ea3n xu\u1ea5t s\u1ed1.',
  },
  {
    id: '3',
    year: '2018',
    title: 'M\u1edf r\u1ed9ng quy m\u00f4',
    description:
    'M\u1edf r\u1ed9ng nh\u00e0 x\u01b0\u1edfng l\u00ean 300m\u00b2, \u0111\u1ea1t 200+ labo \u0111\u1ed1i t\u00e1c.',
  },
  {
    id: '4',
    year: '2021',
    title: 'CNC 5 tr\u1ee5c',
    description:
      '\u0110\u1ea7u t\u01b0 m\u00e1y CNC 5 tr\u1ee5c v\u00e0 scanner 3D th\u1ebf h\u1ec7 m\u1edbi.',
  },
  {
    id: '5',
    year: '2023',
    title: 'Chuy\u1ec3n \u0111\u1ed5i s\u1ed1',
    description:
      'Tri\u1ec3n khai h\u1ec7 th\u1ed1ng qu\u1ea3n l\u00fd s\u1ed1 to\u00e0n di\u1ec7n, \u0111\u1ea1t 500+ labo \u0111\u1ed1i t\u00e1c.',
  },
];

const defaultEquipment: Equipment[] = [
  {
    id: '1',
    name: 'M\u00e1y CNC 5 tr\u1ee5c',
    description:
      'M\u00e1y phay CNC 5 tr\u1ee5c chuy\u00ean d\u1ee5ng cho gia c\u00f4ng Zirconia v\u00e0 kim lo\u1ea1i nha khoa.',
    specs: '\u0110\u1ed9 ch\u00ednh x\u00e1c: \u00b15\u03bcm\nT\u1ed1c \u0111\u1ed9 tr\u1ee5c ch\u00ednh: 60,000 rpm\nS\u1ed1 tr\u1ee5c: 5 tr\u1ee5c \u0111\u1ed3ng th\u1eddi',
  },
  {
    id: '2',
    name: 'Scanner 3D',
    description:
      'M\u00e1y qu\u00e9t 3D \u0111\u1ed9 ph\u00e2n gi\u1ea3i cao cho scan m\u1eabu v\u00e0 scan trong mi\u1ec7ng.',
    specs: '\u0110\u1ed9 ph\u00e2n gi\u1ea3i: 7\u03bcm\nT\u1ed1c \u0111\u1ed9 qu\u00e9t: 10 gi\u00e2y/c\u1ea7u\nC\u00f4ng ngh\u1ec7: \u00c1nh s\u00e1ng c\u1ea5u tr\u00fac',
  },
  {
    id: '3',
    name: 'M\u00e1y in 3D',
    description:
      'M\u00e1y in 3D SLA cho in m\u1eabu, h\u01b0\u1edbng d\u1eabn ph\u1eabu thu\u1eadt v\u00e0 kh\u00e1m h\u00e0m.',
    specs: '\u0110\u1ed9 ph\u00e2n gi\u1ea3i l\u1edbp: 25\u03bcm\n\u0110\u1ed9 ch\u00ednh x\u00e1c XY: 50\u03bcm\nV\u1eadt li\u1ec7u: Resin nha khoa',
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
    showToast('\u0110\u00e3 l\u01b0u t\u1ea5t c\u1ea3 n\u1ed9i dung th\u00e0nh c\u00f4ng!');
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
        <h1 style={pageTitle}>Qu\u1ea3n l\u00fd Gi\u1edbi thi\u1ec7u</h1>
        <p style={pageSubtitle}>
          Ch\u1ec9nh s\u1eeda n\u1ed9i dung trang Gi\u1edbi thi\u1ec7u c\u1ee7a website
        </p>
      </div>

      {/* Section 1: Mission / Vision / Values */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Target} title="S\u1ee9 m\u1ec7nh / T\u1ea7m nh\u00ecn / Gi\u00e1 tr\u1ecb" />

        <Textarea
          label="S\u1ee9 m\u1ec7nh"
          value={mission.mission}
          onChange={(e) => setMission({ ...mission, mission: e.target.value })}
          placeholder="Nh\u1eadp s\u1ee9 m\u1ec7nh c\u1ee7a c\u00f4ng ty..."
          style={{ minHeight: 100 }}
        />
        <Textarea
          label="T\u1ea7m nh\u00ecn"
          value={mission.vision}
          onChange={(e) => setMission({ ...mission, vision: e.target.value })}
          placeholder="Nh\u1eadp t\u1ea7m nh\u00ecn c\u1ee7a c\u00f4ng ty..."
          style={{ minHeight: 100 }}
        />
        <Textarea
          label="Gi\u00e1 tr\u1ecb c\u1ed1t l\u00f5i"
          value={mission.values}
          onChange={(e) => setMission({ ...mission, values: e.target.value })}
          placeholder="Nh\u1eadp gi\u00e1 tr\u1ecb c\u1ed1t l\u00f5i..."
          style={{ minHeight: 100 }}
        />
      </div>

      {/* Section 2: Timeline / Milestones */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Clock} title="L\u1ecbch s\u1eed ph\u00e1t tri\u1ec3n" />

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
                  M\u1ed1c {idx + 1}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeMilestone(milestone.id)}
                  style={{ padding: '4px 8px' }}
                >
                  <Trash2 size={13} />
                  X\u00f3a
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
                  label="N\u0103m"
                  value={milestone.year}
                  onChange={(e) =>
                    updateMilestone(milestone.id, 'year', e.target.value)
                  }
                  placeholder="VD: 2014"
                />
                <Input
                  label="Ti\u00eau \u0111\u1ec1"
                  value={milestone.title}
                  onChange={(e) =>
                    updateMilestone(milestone.id, 'title', e.target.value)
                  }
                  placeholder="Nh\u1eadp ti\u00eau \u0111\u1ec1 m\u1ed1c..."
                />
              </div>
              <Textarea
                label="M\u00f4 t\u1ea3"
                value={milestone.description}
                onChange={(e) =>
                  updateMilestone(milestone.id, 'description', e.target.value)
                }
                placeholder="M\u00f4 t\u1ea3 chi ti\u1ebft..."
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Button variant="secondary" onClick={addMilestone}>
            <Plus size={14} />
            Th\u00eam m\u1ed1c m\u1edbi
          </Button>
        </div>
      </div>

      {/* Section 3: Equipment & Technology */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Cpu} title="Thi\u1ebft b\u1ecb & C\u00f4ng ngh\u1ec7" />

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
                  Thi\u1ebft b\u1ecb {idx + 1}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeEquipment(eq.id)}
                  style={{ padding: '4px 8px' }}
                >
                  <Trash2 size={13} />
                  X\u00f3a
                </Button>
              </div>
              <Input
                label="T\u00ean thi\u1ebft b\u1ecb"
                value={eq.name}
                onChange={(e) =>
                  updateEquipment(eq.id, 'name', e.target.value)
                }
                placeholder="Nh\u1eadp t\u00ean thi\u1ebft b\u1ecb..."
              />
              <Textarea
                label="M\u00f4 t\u1ea3"
                value={eq.description}
                onChange={(e) =>
                  updateEquipment(eq.id, 'description', e.target.value)
                }
                placeholder="M\u00f4 t\u1ea3 thi\u1ebft b\u1ecb..."
              />
              <Textarea
                label="Th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt"
                value={eq.specs}
                onChange={(e) =>
                  updateEquipment(eq.id, 'specs', e.target.value)
                }
                placeholder="Th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt (m\u1ed7i d\u00f2ng m\u1ed9t th\u00f4ng s\u1ed1)..."
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Button variant="secondary" onClick={addEquipment}>
            <Plus size={14} />
            Th\u00eam thi\u1ebft b\u1ecb m\u1edbi
          </Button>
        </div>
      </div>

      {/* Section 4: Team Stats */}
      <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader icon={Users} title="\u0110\u1ed9i ng\u0169" />

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
              placeholder="S\u1ed1 l\u01b0\u1ee3ng"
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
              placeholder="S\u1ed1 l\u01b0\u1ee3ng"
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
              placeholder="S\u1ed1 l\u01b0\u1ee3ng"
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
              label="H\u00e0nh ch\u00ednh"
              type="number"
              value={String(team.admin)}
              onChange={(e) =>
                setTeam({ ...team, admin: Number(e.target.value) || 0 })
              }
              placeholder="S\u1ed1 l\u01b0\u1ee3ng"
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
          L\u01b0u t\u1ea5t c\u1ea3
        </Button>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

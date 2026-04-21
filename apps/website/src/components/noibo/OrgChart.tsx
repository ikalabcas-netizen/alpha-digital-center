'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Building2 } from 'lucide-react';
import { colors, fonts, cardStyle } from '@/lib/styles';

export interface OrgEmployee {
  id: string;
  fullName: string;
  workEmail: string;
  avatarUrl: string | null;
  positionTitle: string;
  employmentStatus: string;
}

export interface OrgDepartment {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  isActive: boolean;
  employees: OrgEmployee[];
  children: OrgDepartment[];
}

export function OrgChart({ tree }: { tree: OrgDepartment[] }) {
  if (tree.length === 0) {
    return (
      <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: colors.textLight }}>
        Chưa có phòng ban nào.
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {tree.map((dept) => (
        <DeptNode key={dept.id} dept={dept} depth={0} />
      ))}
    </div>
  );
}

function DeptNode({ dept, depth }: { dept: OrgDepartment; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  const totalChildren = dept.children.length;
  const totalEmps = dept.employees.length;

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div
        style={{
          ...cardStyle,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: totalChildren + totalEmps > 0 ? 'pointer' : 'default',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <div style={{ color: colors.textLight, width: 16 }}>
          {totalChildren + totalEmps > 0 ? open ? <ChevronDown size={16} /> : <ChevronRight size={16} /> : null}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${colors.accent}15`,
            color: colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Building2 size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
              {dept.name}
            </span>
            <code style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.mono }}>{dept.code}</code>
          </div>
          <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
            {totalEmps} nhân viên{totalChildren > 0 && ` · ${totalChildren} phòng con`}
          </div>
        </div>
      </div>

      {open && (totalEmps > 0 || totalChildren > 0) && (
        <div
          style={{
            borderLeft: `2px solid ${colors.borderSoft}`,
            marginLeft: 16,
            paddingLeft: 18,
            paddingTop: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {dept.employees.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 8,
                marginBottom: 6,
              }}
            >
              {dept.employees.map((emp) => (
                <EmployeeChip key={emp.id} emp={emp} />
              ))}
            </div>
          )}
          {dept.children.map((child) => (
            <DeptNode key={child.id} dept={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmployeeChip({ emp }: { emp: OrgEmployee }) {
  const isActive = emp.employmentStatus === 'active';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        opacity: emp.employmentStatus === 'terminated' ? 0.5 : 1,
      }}
    >
      {emp.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={emp.avatarUrl} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: `${isActive ? colors.accent : colors.textLight}22`,
            color: isActive ? colors.accent : colors.textLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: fonts.heading,
            flexShrink: 0,
          }}
        >
          {emp.fullName[0]?.toUpperCase()}
        </div>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: colors.textPrimary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {emp.fullName}
        </div>
        <div
          style={{
            fontSize: 11,
            color: colors.textLight,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {emp.positionTitle}
        </div>
      </div>
    </div>
  );
}

// Build cây từ flat list
export function buildOrgTree(
  departments: Array<{
    id: string;
    code: string;
    name: string;
    parentId: string | null;
    isActive: boolean;
  }>,
  employees: Array<{
    id: string;
    fullName: string;
    workEmail: string;
    avatarUrl: string | null;
    departmentId: string;
    employmentStatus: string;
    position?: { title: string };
  }>
): OrgDepartment[] {
  const map = new Map<string, OrgDepartment>();
  departments.forEach((d) => {
    map.set(d.id, {
      id: d.id,
      code: d.code,
      name: d.name,
      parentId: d.parentId,
      isActive: d.isActive,
      employees: [],
      children: [],
    });
  });
  // Gán employee
  employees.forEach((e) => {
    const node = map.get(e.departmentId);
    if (!node) return;
    if (e.employmentStatus === 'terminated') return;
    node.employees.push({
      id: e.id,
      fullName: e.fullName,
      workEmail: e.workEmail,
      avatarUrl: e.avatarUrl,
      positionTitle: e.position?.title ?? '',
      employmentStatus: e.employmentStatus,
    });
  });
  // Build cây
  const roots: OrgDepartment[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

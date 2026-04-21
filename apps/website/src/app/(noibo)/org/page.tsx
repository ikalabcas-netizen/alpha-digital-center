import { prisma } from '@/lib/prisma';
import { requireNoibo } from '@/lib/noibo/auth';
import { redirect } from 'next/navigation';
import { OrgChart, buildOrgTree } from '@/components/noibo/OrgChart';
import { pageTitle, pageSubtitle, colors, fonts } from '@/lib/styles';

export default async function OrgPage() {
  const ctx = await requireNoibo();
  if (!ctx) redirect('/admin/login');

  const [departments, employees] = await Promise.all([
    prisma.hrmDepartment.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, code: true, name: true, parentId: true, isActive: true },
    }),
    prisma.hrmEmployee.findMany({
      where: { employmentStatus: { not: 'terminated' } },
      orderBy: { fullName: 'asc' },
      select: {
        id: true,
        fullName: true,
        workEmail: true,
        avatarUrl: true,
        departmentId: true,
        employmentStatus: true,
        position: { select: { title: true } },
      },
    }),
  ]);

  const tree = buildOrgTree(departments, employees);
  const totalEmps = employees.length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Sơ đồ tổ chức</h1>
        <div style={pageSubtitle}>
          Tổng cộng <strong style={{ color: colors.textPrimary, fontFamily: fonts.heading }}>{totalEmps}</strong> nhân viên
          đang làm việc trong <strong style={{ color: colors.textPrimary, fontFamily: fonts.heading }}>{departments.length}</strong> phòng ban.
        </div>
      </div>
      <OrgChart tree={tree} />
    </div>
  );
}

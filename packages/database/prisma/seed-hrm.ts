/**
 * Seed Phase 1 HRM — chạy: pnpm --filter @adc/database exec tsx prisma/seed-hrm.ts
 *
 * Tạo:
 * - 3 phòng ban mẫu (Ban Giám đốc, Sản xuất Lab, Kinh doanh)
 * - 3 chức vụ mẫu
 * - 1 hồ sơ HR Admin cho founder (vuvanthanh1986@gmail.com), tự link với User nếu đã đăng nhập Google.
 *
 * An toàn re-run: dùng upsert theo `code` / `workEmail`.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FOUNDER_EMAIL = 'vuvanthanh1986@gmail.com';

async function main() {
  console.log('▶ Seed HRM Phase 1...');

  // 1. Departments
  const bgd = await prisma.hrmDepartment.upsert({
    where: { code: 'BGD' },
    update: {},
    create: { code: 'BGD', name: 'Ban Giám đốc', displayOrder: 1 },
  });

  const lab = await prisma.hrmDepartment.upsert({
    where: { code: 'LAB' },
    update: {},
    create: { code: 'LAB', name: 'Sản xuất Lab', parentId: bgd.id, displayOrder: 2 },
  });

  await prisma.hrmDepartment.upsert({
    where: { code: 'SALES' },
    update: {},
    create: { code: 'SALES', name: 'Kinh doanh', parentId: bgd.id, displayOrder: 3 },
  });

  console.log('  ✓ 3 phòng ban');

  // 2. Positions
  const ceoPos = await prisma.hrmPosition.upsert({
    where: { code: 'CEO' },
    update: {},
    create: { code: 'CEO', title: 'Tổng Giám đốc', departmentId: bgd.id, level: 5 },
  });

  await prisma.hrmPosition.upsert({
    where: { code: 'KTV_SR' },
    update: {},
    create: { code: 'KTV_SR', title: 'Kỹ thuật viên Senior', departmentId: lab.id, level: 3 },
  });

  await prisma.hrmPosition.upsert({
    where: { code: 'KTV' },
    update: {},
    create: { code: 'KTV', title: 'Kỹ thuật viên', departmentId: lab.id, level: 2 },
  });

  console.log('  ✓ 3 chức vụ');

  // 3. Founder employee — link với User nếu đã có
  const founderUser = await prisma.user.findUnique({ where: { email: FOUNDER_EMAIL } });

  await prisma.hrmEmployee.upsert({
    where: { workEmail: FOUNDER_EMAIL },
    update: {
      // Nếu lần đầu founder login Google AFTER lần seed đầu → re-link
      ...(founderUser && { userId: founderUser.id }),
    },
    create: {
      employeeCode: 'ADC-0001',
      fullName: 'Vũ Văn Thanh',
      workEmail: FOUNDER_EMAIL,
      userId: founderUser?.id ?? null,
      departmentId: bgd.id,
      positionId: ceoPos.id,
      hireDate: new Date('2020-01-01'),
      employmentStatus: 'active',
      employmentType: 'full_time',
      hrRole: 'hr_admin',
    },
  });

  console.log(`  ✓ Founder employee (${founderUser ? 'đã link User' : 'chưa link — sẽ link khi founder login Google'})`);

  // 4. Phase 2 — 2 mẫu ca mặc định
  await prisma.hrmShiftTemplate.upsert({
    where: { code: 'SHIFT_HC' },
    update: {},
    create: {
      code: 'SHIFT_HC',
      name: 'Ca hành chính',
      startTime: '08:00',
      endTime: '17:00',
      breakMinutes: 60,
      shiftType: 'day',
      lateAfterMin: 15,
    },
  });

  await prisma.hrmShiftTemplate.upsert({
    where: { code: 'SHIFT_LAB' },
    update: {},
    create: {
      code: 'SHIFT_LAB',
      name: 'Ca sản xuất Lab',
      startTime: '07:30',
      endTime: '16:30',
      breakMinutes: 60,
      shiftType: 'day',
      lateAfterMin: 10,
    },
  });

  console.log('  ✓ 2 mẫu ca làm việc');
  console.log('✓ Seed xong.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

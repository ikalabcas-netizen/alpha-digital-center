import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, notFound } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden, HR_ROLES } from '@/lib/noibo/auth';

const EMPLOYMENT_STATUS = ['probation', 'active', 'on_leave', 'terminated'];
const EMPLOYMENT_TYPE = ['full_time', 'part_time', 'contractor', 'intern'];
const GENDERS = ['male', 'female', 'other'];

function parseDate(v: any): Date | null | undefined {
  if (v === undefined) return undefined; // không cập nhật
  if (v === null || v === '') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const { id } = await params;
  const employee = await prisma.hrmEmployee.findUnique({
    where: { id },
    include: {
      department: true,
      position: true,
      manager: { select: { id: true, fullName: true, workEmail: true } },
      reports: { select: { id: true, fullName: true, workEmail: true, position: { select: { title: true } } } },
      user: { select: { id: true, email: true, image: true } },
    },
  });

  if (!employee) return notFound('Nhân viên');
  return NextResponse.json(employee);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;
  const body = await req.json();
  const {
    employeeCode,
    fullName,
    workEmail,
    departmentId,
    positionId,
    managerId,
    hireDate,
    dob,
    gender,
    phone,
    personalEmail,
    nationalId,
    address,
    avatarUrl,
    probationEndDate,
    terminationDate,
    employmentStatus,
    employmentType,
    hrRole,
    note,
  } = body;

  if (managerId && managerId === id) return badRequest('Nhân viên không thể là quản lý của chính mình');
  if (gender !== undefined && gender && !GENDERS.includes(gender)) return badRequest('gender không hợp lệ');
  if (employmentStatus !== undefined && !EMPLOYMENT_STATUS.includes(employmentStatus)) return badRequest('employmentStatus không hợp lệ');
  if (employmentType !== undefined && !EMPLOYMENT_TYPE.includes(employmentType)) return badRequest('employmentType không hợp lệ');
  if (hrRole !== undefined && !HR_ROLES.includes(hrRole)) return badRequest('hrRole không hợp lệ');

  // Nếu đổi workEmail → tự re-link user
  let userIdPatch: { userId: string | null } | {} = {};
  if (workEmail !== undefined) {
    const user = await prisma.user.findUnique({ where: { email: workEmail } });
    userIdPatch = { userId: user?.id ?? null };
  }

  const dobParsed = parseDate(dob);
  const hireParsed = hireDate !== undefined ? parseDate(hireDate) : undefined;
  const probParsed = parseDate(probationEndDate);
  const termParsed = parseDate(terminationDate);

  const updated = await prisma.hrmEmployee.update({
    where: { id },
    data: {
      ...(employeeCode !== undefined && { employeeCode }),
      ...(fullName !== undefined && { fullName }),
      ...(workEmail !== undefined && { workEmail }),
      ...userIdPatch,
      ...(departmentId !== undefined && { departmentId }),
      ...(positionId !== undefined && { positionId }),
      ...(managerId !== undefined && { managerId: managerId || null }),
      ...(hireParsed !== undefined && { hireDate: hireParsed as Date }),
      ...(dobParsed !== undefined && { dob: dobParsed }),
      ...(gender !== undefined && { gender: gender || null }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(personalEmail !== undefined && { personalEmail: personalEmail || null }),
      ...(nationalId !== undefined && { nationalId: nationalId || null }),
      ...(address !== undefined && { address: address || null }),
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
      ...(probParsed !== undefined && { probationEndDate: probParsed }),
      ...(termParsed !== undefined && { terminationDate: termParsed }),
      ...(employmentStatus !== undefined && { employmentStatus }),
      ...(employmentType !== undefined && { employmentType }),
      ...(hrRole !== undefined && { hrRole }),
      ...(note !== undefined && { note: note || null }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;
  // Không hard-delete để giữ lịch sử — chuyển sang terminated
  const reportCount = await prisma.hrmEmployee.count({ where: { managerId: id } });
  if (reportCount > 0) {
    return badRequest(
      `Không thể xóa — còn ${reportCount} nhân viên đang báo cáo trực tiếp. Hãy đổi quản lý của họ trước.`
    );
  }

  await prisma.hrmEmployee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

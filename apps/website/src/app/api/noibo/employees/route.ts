import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden, HR_ROLES } from '@/lib/noibo/auth';

const EMPLOYMENT_STATUS = ['probation', 'active', 'on_leave', 'terminated'];
const EMPLOYMENT_TYPE = ['full_time', 'part_time', 'contractor', 'intern'];
const GENDERS = ['male', 'female', 'other'];

function parseDate(v: any): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req: NextRequest) {
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const sp = req.nextUrl.searchParams;
  const departmentId = sp.get('departmentId') || undefined;
  const positionId = sp.get('positionId') || undefined;
  const status = sp.get('status') || undefined;
  const search = sp.get('q')?.trim() || undefined;

  const employees = await prisma.hrmEmployee.findMany({
    where: {
      ...(departmentId && { departmentId }),
      ...(positionId && { positionId }),
      ...(status && { employmentStatus: status }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { employeeCode: { contains: search, mode: 'insensitive' } },
          { workEmail: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    },
    include: {
      department: { select: { id: true, code: true, name: true } },
      position: { select: { id: true, code: true, title: true, level: true } },
      manager: { select: { id: true, fullName: true } },
      user: { select: { id: true, email: true, image: true } },
    },
    orderBy: [{ employmentStatus: 'asc' }, { fullName: 'asc' }],
  });

  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const body = await req.json();
  const {
    employeeCode,
    fullName,
    workEmail,
    departmentId,
    positionId,
    hireDate,
    managerId,
    dob,
    gender,
    phone,
    personalEmail,
    nationalId,
    address,
    avatarUrl,
    probationEndDate,
    employmentStatus,
    employmentType,
    hrRole,
    note,
  } = body;

  if (!employeeCode || !fullName || !workEmail || !departmentId || !positionId || !hireDate) {
    return badRequest('Thiếu trường bắt buộc: employeeCode, fullName, workEmail, departmentId, positionId, hireDate');
  }
  if (gender && !GENDERS.includes(gender)) return badRequest('gender không hợp lệ');
  if (employmentStatus && !EMPLOYMENT_STATUS.includes(employmentStatus)) return badRequest('employmentStatus không hợp lệ');
  if (employmentType && !EMPLOYMENT_TYPE.includes(employmentType)) return badRequest('employmentType không hợp lệ');
  if (hrRole && !HR_ROLES.includes(hrRole)) return badRequest('hrRole không hợp lệ');

  const dupCode = await prisma.hrmEmployee.findUnique({ where: { employeeCode } });
  if (dupCode) return badRequest('Mã nhân viên đã tồn tại');

  const dupEmail = await prisma.hrmEmployee.findUnique({ where: { workEmail } });
  if (dupEmail) return badRequest('Email công việc đã tồn tại');

  // Tự động link với User nếu có account Google trùng workEmail
  const user = await prisma.user.findUnique({ where: { email: workEmail } });

  const created = await prisma.hrmEmployee.create({
    data: {
      employeeCode,
      fullName,
      workEmail,
      userId: user?.id ?? null,
      departmentId,
      positionId,
      managerId: managerId || null,
      hireDate: new Date(hireDate),
      dob: parseDate(dob),
      gender: gender || null,
      phone: phone || null,
      personalEmail: personalEmail || null,
      nationalId: nationalId || null,
      address: address || null,
      avatarUrl: avatarUrl || null,
      probationEndDate: parseDate(probationEndDate),
      employmentStatus: employmentStatus || 'probation',
      employmentType: employmentType || 'full_time',
      hrRole: hrRole || 'employee',
      note: note || null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

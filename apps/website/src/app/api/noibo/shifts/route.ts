import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

const SHIFT_TYPES = ['day', 'night', 'flexible'];
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function GET() {
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const items = await prisma.hrmShiftTemplate.findMany({
    orderBy: [{ isActive: 'desc' }, { startTime: 'asc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const body = await req.json();
  const { code, name, startTime, endTime, breakMinutes, shiftType, lateAfterMin, isActive } = body;

  if (!code || !name || !startTime || !endTime) return badRequest('code, name, startTime, endTime là bắt buộc');
  if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) return badRequest('startTime/endTime phải định dạng HH:mm');
  if (shiftType && !SHIFT_TYPES.includes(shiftType)) return badRequest('shiftType không hợp lệ');

  const dup = await prisma.hrmShiftTemplate.findUnique({ where: { code } });
  if (dup) return badRequest('Mã ca đã tồn tại');

  const created = await prisma.hrmShiftTemplate.create({
    data: {
      code,
      name,
      startTime,
      endTime,
      breakMinutes: breakMinutes ?? 60,
      shiftType: shiftType ?? 'day',
      lateAfterMin: lateAfterMin ?? 15,
      isActive: isActive ?? true,
    },
  });
  return NextResponse.json(created, { status: 201 });
}

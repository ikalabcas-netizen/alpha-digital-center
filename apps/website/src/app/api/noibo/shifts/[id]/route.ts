import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, notFound } from '@/lib/api-auth';
import { requireHrAdmin, noiboForbidden } from '@/lib/noibo/auth';

const SHIFT_TYPES = ['day', 'night', 'flexible'];
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;
  const body = await req.json();
  const { code, name, startTime, endTime, breakMinutes, shiftType, lateAfterMin, isActive } = body;

  if (startTime !== undefined && !TIME_RE.test(startTime)) return badRequest('startTime phải HH:mm');
  if (endTime !== undefined && !TIME_RE.test(endTime)) return badRequest('endTime phải HH:mm');
  if (shiftType !== undefined && !SHIFT_TYPES.includes(shiftType)) return badRequest('shiftType không hợp lệ');

  const updated = await prisma.hrmShiftTemplate.update({
    where: { id },
    data: {
      ...(code !== undefined && { code }),
      ...(name !== undefined && { name }),
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      ...(breakMinutes !== undefined && { breakMinutes }),
      ...(shiftType !== undefined && { shiftType }),
      ...(lateAfterMin !== undefined && { lateAfterMin }),
      ...(isActive !== undefined && { isActive }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const { id } = await params;
  const counts = await prisma.hrmShiftTemplate.findUnique({
    where: { id },
    select: { _count: { select: { assignments: true } } },
  });
  if (!counts) return notFound('Mẫu ca');
  if (counts._count.assignments > 0)
    return badRequest(`Không thể xóa — đã có ${counts._count.assignments} ngày được gán ca này`);

  await prisma.hrmShiftTemplate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest } from '@/lib/api-auth';
import { requireNoibo, requireHrAdmin, noiboUnauthorized, noiboForbidden } from '@/lib/noibo/auth';

/**
 * GET /api/noibo/shifts/assign?from=YYYY-MM-DD&to=YYYY-MM-DD&departmentId=...
 * Trả mảng shift assignments + thông tin employee + template trong khoảng ngày.
 */
export async function GET(req: NextRequest) {
  const ctx = await requireNoibo();
  if (!ctx) return noiboUnauthorized();

  const sp = req.nextUrl.searchParams;
  const from = sp.get('from');
  const to = sp.get('to');
  const departmentId = sp.get('departmentId') || undefined;
  const employeeId = sp.get('employeeId') || undefined;

  if (!from || !to) return badRequest('Cần from và to (YYYY-MM-DD)');

  const assignments = await prisma.hrmShiftAssignment.findMany({
    where: {
      workDate: { gte: new Date(from), lte: new Date(to) },
      ...(employeeId && { employeeId }),
      ...(departmentId && { employee: { departmentId } }),
    },
    include: {
      employee: { select: { id: true, fullName: true, employeeCode: true, departmentId: true } },
      template: { select: { id: true, code: true, name: true, startTime: true, endTime: true, shiftType: true } },
    },
    orderBy: [{ workDate: 'asc' }, { employeeId: 'asc' }],
  });

  return NextResponse.json(assignments);
}

/**
 * POST /api/noibo/shifts/assign
 * Body: { items: [{ employeeId, templateId, workDate (YYYY-MM-DD), note? }] }
 * Bulk upsert (đè theo unique [employeeId, workDate]).
 */
export async function POST(req: NextRequest) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const body = await req.json();
  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) return badRequest('items rỗng');

  const created: any[] = [];
  for (const it of items) {
    const { employeeId, templateId, workDate, note } = it || {};
    if (!employeeId || !templateId || !workDate) continue;
    const date = new Date(workDate);
    if (isNaN(date.getTime())) continue;

    const row = await prisma.hrmShiftAssignment.upsert({
      where: { employeeId_workDate: { employeeId, workDate: date } },
      update: { templateId, note: note || null },
      create: { employeeId, templateId, workDate: date, note: note || null },
    });
    created.push(row);
  }

  return NextResponse.json({ count: created.length, items: created }, { status: 201 });
}

/**
 * DELETE /api/noibo/shifts/assign?employeeId=...&workDate=YYYY-MM-DD
 * Xóa 1 assignment cụ thể.
 */
export async function DELETE(req: NextRequest) {
  const ctx = await requireHrAdmin();
  if (!ctx) return noiboForbidden('Cần quyền HR Admin');

  const sp = req.nextUrl.searchParams;
  const employeeId = sp.get('employeeId');
  const workDate = sp.get('workDate');
  if (!employeeId || !workDate) return badRequest('Cần employeeId + workDate');

  await prisma.hrmShiftAssignment.deleteMany({
    where: { employeeId, workDate: new Date(workDate) },
  });
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

const DELEGATES: Record<string, any> = {
  techCard: () => prisma.cmsTechCard,
  material: () => prisma.cmsMaterial,
  coreValue: () => prisma.cmsCoreValue,
  timelineEntry: () => prisma.cmsTimelineEntry,
  contactChannel: () => prisma.cmsContactChannel,
  jobPerk: () => prisma.cmsJobPerk,
  warrantyPolicyGroup: () => prisma.cmsWarrantyPolicyGroup,
  warrantyPolicyItem: () => prisma.cmsWarrantyPolicyItem,
};

const REVALIDATE_PATHS: Record<string, string> = {
  techCard: '/',
  material: '/',
  coreValue: '/gioi-thieu',
  timelineEntry: '/gioi-thieu',
  contactChannel: '/lien-he',
  jobPerk: '/tuyen-dung',
  warrantyPolicyGroup: '/bao-hanh',
  warrantyPolicyItem: '/bao-hanh',
};

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await req.json();
  const { model, items } = body as { model: string; items: Array<{ id: string; displayOrder: number }> };
  if (!model || !Array.isArray(items)) return badRequest('Thiếu model hoặc items');
  const delegate = DELEGATES[model]?.();
  if (!delegate) return badRequest(`Model không hỗ trợ: ${model}`);

  await prisma.$transaction(
    items.map((it) => delegate.update({ where: { id: it.id }, data: { displayOrder: it.displayOrder } })),
  );

  const path = REVALIDATE_PATHS[model];
  if (path) revalidatePath(path);
  return NextResponse.json({ ok: true });
}

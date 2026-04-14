import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const group = searchParams.get('group');

  const where: any = {};
  if (group) where.group = group;

  const settings = await prisma.siteSetting.findMany({
    where,
    orderBy: { key: 'asc' },
  });

  // Group settings by group name
  const grouped: Record<string, Record<string, string>> = {};
  for (const s of settings) {
    if (!grouped[s.group]) grouped[s.group] = {};
    grouped[s.group][s.key] = s.value;
  }

  return NextResponse.json(group ? settings : grouped);
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  // Accept either { key, value, group } or { settings: [{ key, value, group }] }
  const items = body.settings || [body];

  const results = [];
  for (const item of items) {
    const { key, value, group } = item;
    if (!key || !group) continue;

    const result = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value), group },
      create: { key, value: String(value), group },
    });
    results.push(result);
  }

  return NextResponse.json(results);
}

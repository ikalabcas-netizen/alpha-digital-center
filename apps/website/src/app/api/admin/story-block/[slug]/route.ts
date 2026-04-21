import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { slug } = await params;
  const block = await prisma.cmsStoryBlock.findUnique({ where: { pageSlug: slug } });
  if (!block) {
    return NextResponse.json({
      pageSlug: slug,
      imageUrl1: null,
      imageUrl2: null,
      paragraph1: '',
      paragraph2: '',
      foundedYear: '',
    });
  }
  return NextResponse.json(block);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { slug } = await params;
  const body = await req.json();
  const { imageUrl1, imageUrl2, paragraph1, paragraph2, foundedYear } = body;
  if (!paragraph1 || !paragraph2) return badRequest('Thiếu paragraph1/paragraph2');
  try {
    const block = await prisma.cmsStoryBlock.upsert({
      where: { pageSlug: slug },
      create: { pageSlug: slug, imageUrl1, imageUrl2, paragraph1, paragraph2, foundedYear: foundedYear || '' },
      update: { imageUrl1, imageUrl2, paragraph1, paragraph2, foundedYear: foundedYear || '' },
    });
    if (slug === 'about') revalidatePath('/gioi-thieu');
    logger.info('StoryBlock saved', { slug });
    return NextResponse.json(block);
  } catch (err) {
    logger.error('StoryBlock save failed', err, { slug });
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

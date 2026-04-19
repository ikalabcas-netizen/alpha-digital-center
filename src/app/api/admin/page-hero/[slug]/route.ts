import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

const SLUG_TO_PATH: Record<string, string> = {
  home: '/',
  about: '/gioi-thieu',
  products: '/san-pham',
  news: '/tin-tuc',
  warranty: '/bao-hanh',
  careers: '/tuyen-dung',
  contact: '/lien-he',
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { slug } = await params;
  const hero = await prisma.cmsPageHero.findUnique({ where: { pageSlug: slug } });
  if (!hero) {
    return NextResponse.json({
      pageSlug: slug,
      eyebrow: '',
      titleLead: '',
      titleAccent: null,
      titleTail: null,
      subtitle: null,
      imageUrl: null,
    });
  }
  return NextResponse.json(hero);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { slug } = await params;
  const body = await req.json();
  const { eyebrow, titleLead, titleAccent, titleTail, subtitle, imageUrl } = body;
  if (!eyebrow || !titleLead) return badRequest('eyebrow và titleLead bắt buộc');
  try {
    const hero = await prisma.cmsPageHero.upsert({
      where: { pageSlug: slug },
      create: { pageSlug: slug, eyebrow, titleLead, titleAccent, titleTail, subtitle, imageUrl },
      update: { eyebrow, titleLead, titleAccent, titleTail, subtitle, imageUrl },
    });
    const path = SLUG_TO_PATH[slug];
    if (path) revalidatePath(path);
    logger.info('PageHero saved', { slug });
    return NextResponse.json(hero);
  } catch (err) {
    logger.error('PageHero save failed', err, { slug });
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

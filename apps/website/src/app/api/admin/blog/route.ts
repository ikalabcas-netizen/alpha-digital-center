import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest, slugify } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (category && category !== 'all') where.category = category;
  if (search) {
    where.OR = [
      { titleVi: { contains: search, mode: 'insensitive' } },
      { excerptVi: { contains: search, mode: 'insensitive' } },
    ];
  }

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await req.json();
  const {
    titleVi, titleEn, excerptVi, contentVi, contentEn,
    featuredImageUrl, category, tags, status,
    scheduledAt, seoTitle, seoDescription,
    aiGenerated, aiProvider,
  } = body;

  if (!titleVi || !contentVi) return badRequest('titleVi and contentVi are required');

  const slug = slugify(titleVi);
  const publishedAt = status === 'published' ? new Date() : null;

  const post = await prisma.blogPost.create({
    data: {
      titleVi,
      titleEn: titleEn || null,
      slug,
      excerptVi: excerptVi || null,
      contentVi,
      contentEn: contentEn || null,
      featuredImageUrl: featuredImageUrl || null,
      category: category || null,
      tags: tags || [],
      status: status || 'draft',
      publishedAt,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      aiGenerated: aiGenerated || false,
      aiProvider: aiProvider || null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}

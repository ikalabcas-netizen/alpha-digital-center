import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, notFound, slugify } from '@/lib/api-auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return notFound('BlogPost');
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const {
    titleVi, titleEn, excerptVi, contentVi, contentEn,
    featuredImageUrl, category, tags, status,
    scheduledAt, seoTitle, seoDescription,
  } = body;

  const data: any = {};
  if (titleVi !== undefined) { data.titleVi = titleVi; data.slug = slugify(titleVi); }
  if (titleEn !== undefined) data.titleEn = titleEn;
  if (excerptVi !== undefined) data.excerptVi = excerptVi;
  if (contentVi !== undefined) data.contentVi = contentVi;
  if (contentEn !== undefined) data.contentEn = contentEn;
  if (featuredImageUrl !== undefined) data.featuredImageUrl = featuredImageUrl;
  if (category !== undefined) data.category = category;
  if (tags !== undefined) data.tags = tags;
  if (status !== undefined) {
    data.status = status;
    if (status === 'published') data.publishedAt = new Date();
  }
  if (scheduledAt !== undefined) data.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
  if (seoTitle !== undefined) data.seoTitle = seoTitle;
  if (seoDescription !== undefined) data.seoDescription = seoDescription;

  const updated = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

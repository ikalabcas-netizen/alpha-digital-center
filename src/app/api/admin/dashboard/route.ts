import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized } from '@/lib/api-auth';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const [
    totalProducts,
    activeProducts,
    totalCategories,
    totalBlogPosts,
    publishedPosts,
    totalLeads,
    newLeads,
    totalWarranties,
    activeWarranties,
    totalJobs,
    activeJobs,
    totalApplications,
    totalTestimonials,
    recentLeads,
    recentPosts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.productCategory.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: 'published' } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.warrantyRecord.count(),
    prisma.warrantyRecord.count({ where: { status: 'active' } }),
    prisma.jobPosting.count(),
    prisma.jobPosting.count({ where: { isActive: true } }),
    prisma.jobApplication.count(),
    prisma.testimonial.count(),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, contactName: true, labName: true, source: true, status: true, createdAt: true },
    }),
    prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, titleVi: true, status: true, viewCount: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    stats: {
      products: { total: totalProducts, active: activeProducts },
      categories: { total: totalCategories },
      blog: { total: totalBlogPosts, published: publishedPosts },
      leads: { total: totalLeads, new: newLeads },
      warranties: { total: totalWarranties, active: activeWarranties },
      jobs: { total: totalJobs, active: activeJobs },
      applications: { total: totalApplications },
      testimonials: { total: totalTestimonials },
    },
    recent: {
      leads: recentLeads,
      posts: recentPosts,
    },
  });
}

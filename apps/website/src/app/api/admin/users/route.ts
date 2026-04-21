import { NextResponse } from 'next/server';
import { prisma, UserRole } from '@adc/database';
import { requireAdmin, unauthorized } from '@/lib/api-auth';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  // Only SUPER_ADMIN and ADMIN can view the user list
  if (session.user.role !== UserRole.SUPER_ADMIN && session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}

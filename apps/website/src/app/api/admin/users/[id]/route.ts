import { NextRequest, NextResponse } from 'next/server';
import { prisma, UserRole } from '@adc/database';
import { requireAdmin, unauthorized, badRequest, notFound } from '@/lib/api-auth';

const VALID_ROLES = Object.values(UserRole);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  // Only SUPER_ADMIN can change roles
  if (session.user.role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json({ error: 'Forbidden — only SUPER_ADMIN can manage roles' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role } = body as { role?: UserRole };

  if (!role || !VALID_ROLES.includes(role)) {
    return badRequest(`role must be one of: ${VALID_ROLES.join(', ')}`);
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return notFound('User');

  // Approving a user also activates their account; rejecting deactivates.
  const isActive = role === UserRole.REJECTED ? false : role === UserRole.PENDING ? user.isActive : true;

  const updated = await prisma.user.update({
    where: { id },
    data: { role, isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  if (session.user.role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  if (session.user.id === id) {
    return badRequest('Cannot delete your own account');
  }

  await prisma.account.deleteMany({ where: { userId: id } });
  await prisma.session.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

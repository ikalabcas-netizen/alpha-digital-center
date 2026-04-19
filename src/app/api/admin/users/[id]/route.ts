import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorized, badRequest, notFound } from '@/lib/api-auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  // Only super_admin can change roles
  const currentRole = (session.user as any)?.role;
  if (currentRole !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden - only super_admin can manage roles' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role } = body;

  const validRoles = ['super_admin', 'admin', 'editor', 'viewer', 'pending', 'rejected'];
  if (!role || !validRoles.includes(role)) {
    return badRequest(`role must be one of: ${validRoles.join(', ')}`);
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return notFound('User');

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const currentRole = (session.user as any)?.role;
  if (currentRole !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  // Prevent deleting yourself
  if ((session.user as any)?.id === id) {
    return badRequest('Cannot delete your own account');
  }

  await prisma.account.deleteMany({ where: { userId: id } });
  await prisma.session.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

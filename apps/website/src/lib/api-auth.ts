import { NextResponse } from 'next/server';
import { auth } from '@adc/auth';
import { UserRole } from '@adc/database';

export async function getSession() {
  return auth();
}

const APPROVED_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR];
const ADMIN_OR_ABOVE: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) return null;
  if (!session.user.isActive) return null;
  if (!APPROVED_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function requireAdminOrAbove() {
  const session = await getSession();
  if (!session?.user) return null;
  if (!session.user.isActive) return null;
  if (!ADMIN_OR_ABOVE.includes(session.user.role)) return null;
  return session;
}

export async function requireSuperAdmin() {
  const session = await getSession();
  if (!session?.user) return null;
  if (!session.user.isActive) return null;
  if (session.user.role !== UserRole.SUPER_ADMIN) return null;
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(resource = 'Resource') {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

import { NextResponse } from 'next/server';

export async function getSession() {
  const { auth } = await import('@/lib/auth');
  return auth();
}

const APPROVED_ROLES = ['super_admin', 'admin', 'editor', 'viewer'];

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) return null;
  const role = (session.user as any)?.role;
  if (!APPROVED_ROLES.includes(role)) return null;
  return session;
}

export async function requireSuperAdmin() {
  const session = await getSession();
  if (!session?.user) return null;
  const role = (session.user as any)?.role;
  if (role !== 'super_admin') return null;
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

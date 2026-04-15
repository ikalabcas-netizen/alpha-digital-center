import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

const SUPER_ADMIN_EMAIL = 'vuvanthanh1986@gmail.com';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  events: {
    async createUser({ user }) {
      // Auto-assign super_admin role on first login
      if (user.email === SUPER_ADMIN_EMAIL) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'super_admin' },
        });
      }
    },
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
      const allowedDomains = (process.env.ADMIN_ALLOWED_DOMAINS || '').split(',').map(d => d.trim()).filter(Boolean);

      if (!user.email) return false;
      if (allowedEmails.length === 0 && allowedDomains.length === 0) return true;
      if (allowedEmails.includes(user.email)) return true;
      const domain = user.email.split('@')[1];
      if (allowedDomains.includes(domain)) return true;
      return false;
    },
    async session({ session, user }: any) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role || 'viewer';
      }
      return session;
    },
  },
});

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
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
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          session.user.role = dbUser?.role || 'viewer';
        } catch {
          session.user.role = 'viewer';
        }
      }
      return session;
    },
  },
});

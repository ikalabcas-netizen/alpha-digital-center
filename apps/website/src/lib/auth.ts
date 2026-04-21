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
      // Super admin email: auto-upgrade. All other new users: pending — await super admin approval.
      const role = user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'pending';
      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
    },
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      // Block re-login for rejected users
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true },
      });
      if (existing?.role === 'rejected') return false;
      return true;
    },
    async session({ session, user }: any) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role || 'pending';
      }
      return session;
    },
  },
});

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma, UserRole } from "@adc/database";

const SUPER_ADMIN_EMAIL = "vuvanthanh1986@gmail.com";

declare module "next-auth" {
  interface User {
    role: UserRole;
    isActive: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      image?: string | null;
      isActive: boolean;
    };
  }
}

const isProd = process.env.NODE_ENV === "production";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
        // Share session cookie across *.alphacenter.vn in production only.
        // Local dev stays host-only (undefined) so cookies work on localhost.
        domain: isProd ? ".alphacenter.vn" : undefined,
      },
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      const email = user.email;
      if (!email) return false;

      let dbUser = await prisma.user.findUnique({ where: { email } });
      if (!dbUser) {
        // First-time login: super admin email auto-activates; everyone else waits for approval.
        const isSuperAdmin = email === SUPER_ADMIN_EMAIL;
        dbUser = await prisma.user.create({
          data: {
            email,
            name: user.name || email.split("@")[0],
            image: user.image || null,
            role: isSuperAdmin ? UserRole.SUPER_ADMIN : UserRole.PENDING,
            isActive: isSuperAdmin,
          },
        });
      } else {
        // Block rejected users.
        if (dbUser.role === UserRole.REJECTED) return false;
        // Refresh Google profile image if changed.
        if (user.image && user.image !== dbUser.image) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { image: user.image },
          });
        }
      }

      // Best-effort login audit — never block login on logging failure.
      try {
        await prisma.loginLog.create({
          data: { userId: dbUser.id, provider: account.provider },
        });
      } catch {
        // ignore
      }
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      // On fresh sign-in, hydrate token from DB.
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true, isActive: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;
        }
      }
      // Re-check role/isActive on every subsequent request so admin approval
      // or revocation takes effect without waiting for JWT expiry.
      if (trigger !== "signIn" && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, isActive: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.isActive = dbUser.isActive;
          }
        } catch {
          // Keep existing token values if DB check fails.
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as UserRole) ?? UserRole.PENDING;
        session.user.isActive = Boolean(token.isActive);
      }
      return session;
    },
  },
});

// src/pages/api/auth/[...nextauth].ts  (или app/api/auth/[...nextauth]/route.ts)

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { clientRoutes } from '@/lib/routes/client-routes';

// ← ЭТО ВСЁ, ЧТО НУЖНО ДЛЯ V4 (никаких NextAuthConfig!)
import type { NextAuthOptions } from 'next-auth';
import customPrismaAdapter from './custom-prisma-adapter';

import type { DefaultSession } from 'next-auth';
import { prisma } from './prisma';

// Правильно — используем DefaultSession, а НЕ Session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user']; // ← DefaultSession, а не Session!
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userExists?: boolean;
  }
}
// ======================================================================

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: clientRoutes.authLoginPage(),
    error: clientRoutes.authErrorPage(),
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password || !user.emailVerified) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          name:
            [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // ← ОДИН ЕДИНСТВЕННЫЙ jwt callback
    async jwt({ token, user }) {
      // user есть только при первом логине
      if (user) {
        token.id = user.id;
      }

      // Проверяем, существует ли пользователь (делаем только раз за сессию)
      if (token.id && token.userExists === undefined) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true },
        });
        token.userExists = !!dbUser;
      }

      return token;
    },

    async session({ session, token }) {
      // Если пользователь удалён из БД — логаут
      if (token.userExists === false) {
        session.expires === '1970-01-01T00:00:00.000Z';
        return session;
      }

      if (token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { clientRoutes } from '@/lib/routes/client-routes';
import type { AuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import customPrismaAdapter from './custom-prisma-adapter';
import { prisma } from './prisma';
import { AppError } from './errors';

const callbacks: AuthOptions['callbacks'] = {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }

    if (token.id && token.userExists === undefined) {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { id: true },
      });
      token.userExists = !!dbUser;
    }

    return token as JWT;
  },

  async session({ session, token }) {
    if (token.userExists === false) {
      session.expires = '1970-01-01T00:00:00.000Z';
      return session as Session;
    }

    if (token.id) {
      session.user.id = token.id as string;
    }

    return session as Session;
  },
};

export const authOptions: AuthOptions = {
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
        if (!credentials?.email || !credentials?.password)
          throw new AppError(400, 'INVALID_CREDENTIALS', 'Неверные данные');

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password || !user.emailVerified)
          throw new AppError(400, 'USER_NOT_FOUND', 'Пользователь не найден');

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok)
          throw new AppError(400, 'INCORRECT_PASSWORD', 'Неверный пароль');

        return {
          id: String(user.id),
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
          image: user.image,
        };
      },
    }),
  ],
  callbacks,
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;

import NextAuth, { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import customPrismaAdapter from './custom-prisma-adapter';
import { clientRoutes } from './routes/client-routes';

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  adapter: customPrismaAdapter, // устраняем конфликт между prisma и next-auth создав кастомный адаптер
  session: { strategy: 'jwt' },
  pages: {
    error: clientRoutes.authErrorPage(),
    signIn: clientRoutes.authLoginPage(),
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error('CREDENTIALS_REQUIRED');

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error('NO_USER');
        }

        if (!user.password) throw new Error('OAUTH_ONLY');

        const ok = await bcrypt.compare(credentials.password, user.password);

        if (!ok) {
          throw new Error('WRONG_PASSWORD');
        }

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
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id;
      return session;
    },

    async signIn({ user, account, profile }) {
      return true;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

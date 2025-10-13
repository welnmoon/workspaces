import NextAuth, { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import customPrismaAdapter from './custom-prisma-adapter';

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  adapter: customPrismaAdapter, // устраняем конфликт между prisma и next-auth создав кастомный адаптер
  session: { strategy: 'jwt' },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
        if (!user || !user.password)
          throw new Error(
            'Вы регистрировались через внешний сервис. Пожалуйста, войдите через соответствующую кнопку.'
          );

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) {
          throw new Error('Неверный email или пароль');
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

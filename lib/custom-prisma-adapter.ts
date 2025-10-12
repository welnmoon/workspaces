import type { Adapter, AdapterUser } from 'next-auth/adapters';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { User as PrismaUser } from '@prisma/client';

import prisma from '@/lib/prisma';

const baseAdapter = PrismaAdapter(prisma);

const mapUser = (user: PrismaUser): AdapterUser => ({
  id: user.id,
  email: user.email || '',
  emailVerified: user.emailVerified,
  image: user.image,
  name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
});

const parseName = (name?: string | null) => {
  if (!name) return { firstName: null, lastName: null };

  const parts = name.trim().split(/\s+/);
  const firstName = parts.shift() ?? null;
  const lastName = parts.length ? parts.join(' ') : null;

  return { firstName, lastName };
};

const removeUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as T;

export const customPrismaAdapter: Adapter = {
  ...baseAdapter,
  async getUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? mapUser(user) : null;
  },
  
  async getUserByEmail(email) {
    if (!email) return null;

    const user = await prisma.user.findUnique({ where: { email } });
    return user ? mapUser(user) : null;
  },
  async getUserByAccount({ provider, providerAccountId }) {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: true },
    });

    return account?.user ? mapUser(account.user) : null;
  },
  async createUser(user: Omit<AdapterUser, 'id'>) {
    const { name, ...rest } = user;
    const { firstName, lastName } = parseName(name);

    const createdUser = await prisma.user.create({
      data: removeUndefined({
        ...rest,
        firstName,
        lastName,
      }),
    });

    return mapUser(createdUser);
  },
  async updateUser(user) {
    const { name, id, ...rest } = user;
    if (!id) throw new Error('User id is required for update');

    const { firstName, lastName } = parseName(name);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: removeUndefined({
        ...rest,
        firstName,
        lastName,
      }),
    });

    return mapUser(updatedUser);
  },
  async getSessionAndUser(sessionToken) {
    const userAndSession = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!userAndSession) return null;

    const { user, ...session } = userAndSession;
    return { session, user: mapUser(user) };
  },
};

export default customPrismaAdapter;

import { prisma } from '@/lib/prisma';
import { requireUser } from './require-user';
import { AppError } from '@/lib/errors';
import { PlatformRole } from '@prisma/client';

export const requirePlatformRole = async (allowedRoles: PlatformRole[]) => {
  const user = await requireUser();

  const userDb = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      platformRole: true,
    },
  });

  if (!userDb) {
    throw new AppError(403, 'FORBIDDEN', 'User not found');
  }

  if (!allowedRoles.includes(userDb.platformRole)) {
    throw new AppError(
      403,
      'FORBIDDEN',
      'You do not have the required platform role'
    );
  }

  return { ...user, platformRole: userDb.platformRole };
};

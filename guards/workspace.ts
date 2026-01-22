import { requireUser } from '@/guards/require-user';
import { AppError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export const requireWorkspaceMember = async ({
  workspaceId,
  allowed,
}: {
  workspaceId: number;
  allowed?: Role[];
}) => {
  const user = await requireUser();

  const membership = await prisma.membership.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
    select: {
      role: true,
      workspaceId: true,
    },
  });

  if (!membership) {
    throw new AppError(
      403,
      'FORBIDDEN',
      'You are not a member of this workspace'
    );
  }

  if (allowed && !allowed.includes(membership.role)) {
    throw new AppError(403, 'FORBIDDEN', 'You are not allowed to do this');
  }

  return { user, role: membership.role as Role };
};

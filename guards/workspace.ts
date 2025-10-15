import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
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
    throw new Error('You are not a member of this workspace');
  }

  if (allowed && !allowed.includes(membership.role)) {
    throw new Error('You are not allowed to perform this action');
  }

  return { user, role: membership.role as Role };
};

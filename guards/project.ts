import { requireUser } from '@/helpers/require-user';
import { Role } from '@prisma/client';

export const requireProjectMember = async ({
  projectId,
  allowedRoles,
}: {
  projectId: number;
  allowedRoles?: Role[];
}) => {
  const user = await requireUser();

  
};

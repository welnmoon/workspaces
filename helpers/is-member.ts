import { MembershipService } from '@/lib/services/membership';
import { FullRoleDTO } from '@/types/prisma/DTO/role';

type isMember = { isMember: boolean; role?: FullRoleDTO };
export const isMember = async (workspaceId: number, userId: string) => {
  const role = await MembershipService.getUserRoleInWorkspace(
    userId,
    workspaceId
  );
  if (!role) {
    return { isMember: false } as isMember;
  }

  return { isMember: true, role: role } as isMember;
};

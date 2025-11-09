import { MembershipStatus } from '@prisma/client';
import prisma from '../prisma';

export class MembershipService {
  static async getUserRoleInWorkspace(userId: string, workspaceId: number) {
    const m = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      select: {
        role: true,
        status: true,
      },
    });

    if (!m) return null;
    if (m.status !== MembershipStatus.ACTIVE) return null;
    return m.role;
  }

  static async getWorkspaceMembersCount(workspaceId: number) {
    return await prisma.membership.count({
      where: {
        workspaceId,
        status: MembershipStatus.ACTIVE,
      },
    });
  }
}

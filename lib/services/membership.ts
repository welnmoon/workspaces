import { MembershipStatus } from '@prisma/client';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { AppError } from '../errors';
import { WorkspaceService } from './workspace';
import { prisma } from '../prisma';

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

  static async editMemberRole(
    memberId: number,
    role: RoleWithoutOwnerDTO,
    currentUserId: string
  ) {
    const member = await prisma.membership.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new AppError(404, 'MEMBER_NOT_FOUND', 'Member not found');
    }

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: member.workspaceId,
      },
    });

    if (!workspace) {
      throw new AppError(404, 'WORKSPACE_NOT_FOUND', 'Workspace not found');
    }

    if (workspace.ownerId !== currentUserId) {
      throw new AppError(
        403,
        'FORBIDDEN',
        'You do not have permission to edit member roles in this workspace'
      );
    }

    const updatedMember = await prisma.membership.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    });

    return updatedMember;
  }

  static async deleteMember(memberId: number, currentUserId: string) {
    const member = await prisma.membership.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new AppError(404, 'MEMBER_NOT_FOUND', 'Member not found');
    }

    const workspace = await WorkspaceService.getWorkspaceById(
      member.workspaceId
    );
    if (!workspace) {
      throw new AppError(404, 'WORKSPACE_NOT_FOUND', 'Workspace not found');
    }

    if (workspace.ownerId !== currentUserId) {
      throw new AppError(
        403,
        'FORBIDDEN',
        'You do not have permission to delete members in this workspace'
      );
    }

    const deleted = await prisma.membership.delete({
      where: {
        id: memberId,
      },
    });

    return deleted;
  }
}

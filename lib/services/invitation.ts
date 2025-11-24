import { sendInviteEmail } from '@/components/mails/invitations/send-invitation';
import { requireWorkspaceMember } from '@/guards/workspace';
import { generateToken } from '@/helpers/generate-token';
import { prisma, TxClient } from '../prisma';
import { AuditLogService } from '@/lib/services/audit-log';
import { WorkspaceService } from '@/lib/services/workspace';
import { MembershipStatus, Prisma, Role } from '@prisma/client';
import { addHours } from 'date-fns';
import { AppError } from '../errors';

type CreateInvitationResult =
  | { kind: 'created'; id: number }
  | { kind: 'already_pending'; id: number }
  | { kind: 'already_member' };



export class InvitationService {
  //-------------------------------------//
  //--------- CRUD ---------------//
  //-------------------------------------//
  static async createInvitation({
    workspaceId,
    id,
    email,
    newUserRole,
    expiresInHours = 168,
  }: {
    workspaceId: number;
    id: string;
    email: string;
    newUserRole?: Role;
    expiresInHours?: number;
  }): Promise<CreateInvitationResult> {
    await requireWorkspaceMember({ workspaceId, allowed: [Role.OWNER] });
    email = email.toLowerCase().trim();

    const workspaceMembers =
      await WorkspaceService.getWorkspaceMembers(workspaceId);
    const isAlreadyMember = workspaceMembers.some(
      (m) => m.user.email === email
    );

    if (isAlreadyMember) return { kind: 'already_member' };

    const pending = await prisma.invitation.findFirst({
      where: { workspaceId, invitedUserEmail: email, status: 'PENDING' },
    });
    if (pending) return { kind: 'already_pending', id: pending.id };

    const token = generateToken();
    const expiresAt = addHours(new Date(), expiresInHours);

    const invitedUser = await prisma.user
      .findFirst({
        where: {
          email,
        },
      })
      .catch(() => null);

    const inv = await prisma.invitation.create({
      data: {
        invitedUserEmail: email,
        invitedRole: newUserRole ?? Role.MEMBER,
        inviterId: id,
        invitedUserId: invitedUser?.id ?? null,
        workspaceId,
        token,
        expiresAt,
      },
    });

    const workspaceName = (await WorkspaceService.getWorkspaceName(workspaceId))
      ?.name;
    const workspaceIdName = `Workspace ${workspaceId}`;

    await sendInviteEmail({
      to: email,
      workspaceName: workspaceName || workspaceIdName,
      token: inv.token,
    });

    await AuditLogService.create({
      userId: id,
      workspaceId,
      invitationId: inv.id,
      email,
      role: inv.invitedRole,
    });

    return { kind: 'created', id: inv.id };
  }

  static async getInvitation(invId: number) {
    return prisma.invitation.findUnique({ where: { id: invId } });
  }

  static async getReceivedInvitations(userId: string) {
    return prisma.invitation.findMany({
      where: { invitedUserId: userId },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        inviter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  static async getSendInvitations(userId: string) {
    return prisma.invitation.findMany({ where: { inviterId: userId } });
  }

  static async acceptInvitationById({
    invId,
    userId,
  }: {
    invId: number;
    userId: string;
  }) {
    const invitation = await InvitationService.getInvitation(invId);
    if (!invitation)
      throw new AppError(404, 'INVITATION_NOT_FOUND', 'Приглашение не найдено');

    if (invitation.status !== 'PENDING')
      throw new AppError(403, 'INVITATION_NOT_FOUND', 'Приглашение не найдено');

    if (invitation.invitedUserId !== userId)
      throw new AppError(403, 'INVITATION_NOT_FOUND', 'Приглашение не найдено');

    if (invitation.expiresAt < new Date())
      throw new AppError(403, 'INVITATION_EXPIRED', 'Приглашение истекло');

    const result = await prisma.$transaction(async (tx: TxClient) => {
      const membership = await tx.membership.create({
        data: {
          userId,
          workspaceId: invitation.workspaceId,
          role: invitation.invitedRole,
          status: MembershipStatus.ACTIVE,
        },
      });

      await tx.invitation.update({
        where: {
          id: invId,
        },
        data: {
          status: 'ACCEPTED',
        },
      });

      return membership;
    });

    await AuditLogService.create({
      userId,
      workspaceId: invitation.workspaceId,
      invitationId: invId,
      email: invitation.invitedUserEmail,
      role: invitation.invitedRole,
    });

    return result.id; // Membership ID
  }
}

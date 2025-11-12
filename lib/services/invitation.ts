import { sendInviteEmail } from '@/components/mails/inviations/send-inviation';
import { requireWorkspaceMember } from '@/guards/workspace';
import { generateToken } from '@/helpers/generate-token';
import { conflict } from '@/lib/http';
import prisma from '@/lib/prisma';
import { AuditLogService } from '@/lib/services/audit-log';
import { WorkspaceService } from '@/lib/services/workspace';
import { Role } from '@prisma/client';
import { addHours } from 'date-fns';

type CreateInvitationResult =
  | { kind: 'created'; id: number }
  | { kind: 'already_pending'; id: number };

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
    // Нормализация
    email = email.toLowerCase().trim();

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

  static async getReceivedInvitations(userId: string) {
    return prisma.invitation.findMany({ where: { invitedUserId: userId } });
  }
  static async getSendInvitations(userId: string) {
    return prisma.invitation.findMany({ where: { inviterId: userId } });
  }
}

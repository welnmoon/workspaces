import prisma from '../prisma';

export class AuditLogService {
  static async create({
    userId,
    workspaceId,
    invitationId,
    email,
    role,
  }: {
    userId: string;
    workspaceId: number;
    invitationId: number;
    email: string;
    role: string;
  }) {
    await prisma.auditLog.create({
      data: {
        userId,
        workspaceId,
        action: 'INVITE_SENT',
        entityType: 'INVITATION',
        entityId: String(invitationId),
        details: JSON.stringify({ email, role }),
      },
    });
  }
}

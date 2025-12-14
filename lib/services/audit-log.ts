import { prisma } from '../prisma';

export class AuditLogService {
  static async getWorkspaceLogs(workspaceId: number, limit = 100) {
    return prisma.auditLog.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

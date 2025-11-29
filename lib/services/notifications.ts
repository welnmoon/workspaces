import { NotificationType } from '@prisma/client';
import { AppError } from '../errors';
import { prisma } from '../prisma';

export class NotificationService {
  static async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: {
        userId,
      },
    });
  }

  static async markAsRead(notificationId: number) {
    return await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  static async hiddenNotification(notificationId: number) {
    return await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isHidden: true,
      },
    });
  }

  static async sendNotificationToWMembers(
    workspaceId: number,
    title: string,
    body: string,

    userId: string
  ) {
    const members = await prisma.membership.findMany({
      where: { workspaceId },
    });

    if (members.length === 1 || members.length === 0)
      throw new AppError(
        409,
        'NO_MEMBERS_IN_WORKSPACE',
        'В рабочем пространстве нет участников'
      );

    return await prisma.notification.createMany({
      data: members.map((member) => ({
        userId: member.userId,
        type: NotificationType.WORKSPACE_INVITE,
        workspaceId,
        title,
        message: body,
        metadata: {
          sendBy: userId,
        },
      })),
    });
  }
}

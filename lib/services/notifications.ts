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

  static async deleteNotification(notificationId: number) {
    return await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });
  }
}

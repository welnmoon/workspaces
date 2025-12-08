import { Notification } from '@prisma/client';

export type NotificationPages = {
  pagesCount: number;
  notifications: Notification[];
  currentPage: number;
  totalNotificationsCount: number;
};

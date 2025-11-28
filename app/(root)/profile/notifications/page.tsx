import NotificationsClient from '@/components/entities/notifications/notifications-client';
import { requireUser } from '@/helpers/require-user';
import { NotificationService } from '@/lib/services/notifications';

const NotificationsPage = async () => {
  const { id } = await requireUser();
  const notifications = await NotificationService.getNotifications(id);

  return <NotificationsClient notifications={notifications} userId={id} />;
};

export default NotificationsPage;

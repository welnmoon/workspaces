import { NotificationFullDTO } from '@/types/prisma/DTO/notification';
import NotificationCard from './notifications-card';

const NotificationsClient = ({
  notifications,
  userId,
}: {
  notifications: NotificationFullDTO[];
  userId: string;
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Новых уведомлений нет
      </div>
    );
  }

  return (
    <section className="grid gap-4">
      {notifications.map((n) => (
        <NotificationCard
          key={n.id}
          id={n.id}
          userId={userId}
          type={n.type}
          title={n.title}
          message={n.message}
          workspaceId={n.workspaceId}
          isRead={n.isRead}
          createdAt={n.createdAt}
        />
      ))}
    </section>
  );
};

export default NotificationsClient;

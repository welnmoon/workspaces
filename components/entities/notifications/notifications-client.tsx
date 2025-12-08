'use client';

import { NotificationFullDTO } from '@/types/prisma/DTO/notification';
import NotificationCard from './notifications-card';
import { useNotificationPages } from '@/hooks/notifications/use-notification-pages';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NotificationPages } from '@/types/notification-pages';
import NotificationsPagination from './notifications-pagination';
import Description from '@/components/ui/desc';

const NotificationsClient = ({
  // notifications,
  userId,
}: {
  notifications: NotificationFullDTO[];
  userId: string;
}) => {
  const searchParams = useSearchParams();
  // const router = useRouter();
  const currentPage = Number(searchParams.get('page') || '1');
  // router.push(`?page=${currentPage}`);

  const {
    data: notificationPages,
    isError,
    isLoading,
  } = useNotificationPages(userId, {
    limit: 2,
    pageNumber: currentPage,
  });

  if (isLoading) {
    return <div>Загружаем уведомления...</div>;
  }

  if (isError || !notificationPages) {
    return <div>Ошибка при загрузке уведомлений</div>;
  }

  const { notifications, pagesCount, totalNotificationsCount } =
    notificationPages as NotificationPages;

  if (notifications.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Новых уведомлений нет
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <Description text={`У вас ${totalNotificationsCount} уведомлении`} />
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
          isTrashButtonVisible={false}
        />
      ))}
      <NotificationsPagination
        currentPage={currentPage}
        pagesCount={pagesCount}
      />
    </section>
  );
};

export default NotificationsClient;

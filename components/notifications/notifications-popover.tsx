'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import {
  InvitationNotificationData,
  InvitationNotification,
} from './invitation-notification';
import { useInvitations } from '@/hooks/notifications/invitations/use-invitations';
import { useNotifications } from '@/hooks/notifications/use-notifications';
import Notification from './notification';

// type InvitationsPopoverProps = {
//   invitations: InvitationNotificationData[];
// };

const NotificationsPopover = ({ userId }: { userId: string }) => {
  const { data: invitations = [], isLoading: isLoadingInvitations } =
    useInvitations(userId);

  const { data: notifications = [], isLoading: isLoadingNotifications } =
    useNotifications(userId);

  const unreadInvitations = invitations.filter(
    (inv) => inv.status !== 'ACCEPTED'
  );
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadTotal = unreadInvitations.length + unreadNotifications.length;

  const hasInvitations = invitations.length > 0;
  const hasNotifications = notifications.length > 0;
  const isLoading = isLoadingInvitations || isLoadingNotifications;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Открыть уведомления"
        >
          <Bell className="h-5 w-5" />
          {unreadTotal > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white">
              {unreadTotal}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 h-[50vh] flex flex-col" // <- половина экрана, флекс-колонка
      >
        {/* фиксированный заголовок */}
        <div className="border-b px-4 py-3 shrink-0">
          <p className="text-sm font-semibold">Уведомления</p>
        </div>

        {/* скролящийся контент */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-6 text-sm text-muted-foreground">
              Загрузка...
            </div>
          )}

          {!isLoading && (
            <>
              {hasInvitations && (
                <ul>
                  {invitations.map((invitation) => (
                    <InvitationNotification
                      invitation={invitation}
                      userId={userId}
                      key={invitation.id}
                    />
                  ))}
                </ul>
              )}

              {hasNotifications && (
                <ul>
                  {notifications.map((notification) => (
                    <Notification
                      key={notification.id}
                      id={notification.id}
                      createdAt={notification.createdAt}
                      updatedAt={notification.updatedAt}
                      isRead={notification.isRead}
                      type={notification.type}
                      title={notification.title}
                      message={notification.message}
                      workspaceId={notification.workspaceId}
                      userId={userId}
                    />
                  ))}
                </ul>
              )}

              {!hasInvitations && !hasNotifications && (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  Новых уведомлений нет
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export type { InvitationNotificationData };
export default NotificationsPopover;

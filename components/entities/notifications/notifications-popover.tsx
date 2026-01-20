'use client';

import { InvitationNotification } from '@/components/entities/notifications/invitation-notification';
import { Notification } from '@/components/entities/notifications/notification';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useInvitations } from '@/hooks/notifications/invitations/use-invitations';
import { useNotifications } from '@/hooks/notifications/use-notifications';
import { clientRoutes } from '@/lib/routes/client-routes';
import { LinkArrow } from '@/ui/icons/link-arrow';
import { Bell } from 'lucide-react';

const NotificationsPopover = ({ userId }: { userId: string }) => {
  const { data: invitations = [], isLoading: isLoadingInvitations } =
    useInvitations(userId);

  const { data: notifications = [], isLoading: isLoadingNotifications } =
    useNotifications(userId);

  const visibleNotifications = notifications.filter(
    (n) => n.isHidden === false
  );

  const unreadInvitations = invitations.filter(
    (inv) => inv.status !== 'ACCEPTED'
  );
  const unreadNotifications = visibleNotifications.filter((n) => !n.isRead);
  const unreadTotal = unreadInvitations.length + unreadNotifications.length;

  const hasInvitations = invitations.length > 0;
  const hasNotifications = visibleNotifications.length > 0;
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
        className="w-80 p-0 h-[50vh] flex flex-col"
      >
        
        <div className="border-b px-4 py-3 shrink-0 flex justify-between">
          <p className="text-sm font-semibold">Уведомления</p>
          <LinkArrow href={clientRoutes.notificationsPage()}>
            Смотреть все
          </LinkArrow>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-6 text-sm text-muted-foreground">
              Загрузка...
            </div>
          )}

          {!isLoading && (
            <>
              {hasNotifications && (
                <ul>
                  {visibleNotifications.map((notification) => (
                    <Notification
                      key={notification.id}
                      id={notification.id}
                      createdAt={notification.createdAt}
                      updatedAt={notification.updatedAt}
                      isRead={notification.isRead}
                      isHidden={notification.isHidden}
                      type={notification.type}
                      title={notification.title}
                      message={notification.message}
                      workspaceId={notification.workspaceId}
                      userId={userId}
                    />
                  ))}
                </ul>
              )}

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

export default NotificationsPopover;

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

// type InvitationsPopoverProps = {
//   invitations: InvitationNotificationData[];
// };

const InvitationsPopover = ({
  // invitations,
  userId,
}: {
  // invitations: InvitationNotificationData[];
  userId: string;
}) => {
  const {
    data: invitations,
    isLoading,
    isError,
    error,
  } = useInvitations(userId);
  const notReadInvitations = invitations.filter(
    (inv) => inv.status !== 'ACCEPTED'
  );
  const hasInvitations = notReadInvitations.length > 0;

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
          {hasInvitations && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white">
              {notReadInvitations.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Уведомления</p>
          <p className="text-xs text-muted-foreground">
            Приглашения в рабочие пространства
          </p>
        </div>
        {hasInvitations ? (
          <ul className="max-h-80 divide-y overflow-y-auto">
            {invitations.map((invitation) => (
              <InvitationNotification
                invitation={invitation}
                userId={userId}
                key={invitation.id}
              />
            ))}
          </ul>
        ) : (
          <div className="px-4 py-6 text-sm text-muted-foreground">
            Новых приглашений нет
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export type { InvitationNotificationData };
export default InvitationsPopover;

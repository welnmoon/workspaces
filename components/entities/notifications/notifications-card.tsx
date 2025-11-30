'use client';

import { formatTime } from '@/helpers/format-time';
import { NotificationTypes } from '@/types/prisma/DTO/notification';
import { CheckCircle2, Trash2, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useMarkReadNotification } from '@/hooks/notifications/use-mark-read-notification';
import { Button } from '@/components/ui/button';

type Props = {
  id: number;
  userId: string;
  type: NotificationTypes;
  title: string;
  message: string;
  workspaceId: number | null;
  isRead: boolean;
  createdAt: Date | string;
};

const NotificationCard = ({
  id,
  userId,
  type,
  title,
  message,
  workspaceId,
  isRead,
  createdAt,
}: Props) => {
  const { mutate: markRead, isPending } = useMarkReadNotification(userId);

  const onRead = () => {
    if (isRead) return;
    markRead(id);
  };

  return (
    <article
      className={cn(
        'rounded-xl border p-4 shadow-sm transition-colors',
        isRead ? 'bg-white' : 'bg-blue-50'
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-500" />
          <div className="font-semibold leading-tight">{title}</div>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatTime(createdAt)}
        </div>
      </header>

      <p className="mt-2 text-sm text-muted-foreground">{message}</p>

      {workspaceId && (
        <Link
          href={`/w/${workspaceId}`}
          className="mt-2 inline-block text-xs text-blue-600 hover:underline"
        >
          Открыть рабочее пространство →
        </Link>
      )}

      <footer className="mt-3 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={onRead}
          disabled={isRead || isPending}
        >
          <CheckCircle2 className="h-4 w-4" />
          {isRead ? 'Прочитано' : 'Отметить как прочитанное'}
        </Button>
        <Button variant="ghost" size="sm" className="gap-1 text-destructive">
          <Trash2 className="h-4 w-4" />
          Скрыть
        </Button>
      </footer>
    </article>
  );
};

export default NotificationCard;

import { formatTime } from '@/helpers/time/format-time';
import { useHiddenNotification } from '@/hooks/notifications/use-delete-notification';
import { useMarkReadNotification } from '@/hooks/notifications/use-mark-read-notification';
import { cn } from '@/lib/utils';
import { NotificationTypes } from '@/types/prisma/DTO/notification';
import { CheckCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

type Props = {
  id: number;
  userId: string;
  type: NotificationTypes;
  title: string;
  message: string;
  workspaceId: number | null;
  isRead: boolean;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const Notification = ({
  title,
  message,
  workspaceId,
  isRead,
  createdAt,
  userId,
  id,
}: Props) => {
  const { mutate: onReadMutate } = useMarkReadNotification(userId);
  const { mutate: onHiddenMutate } = useHiddenNotification(userId);

  const onRead = () => {
    console.log('ON READ', id, title);
    onReadMutate(id);
  };

  const onHidden = () => {
    onHiddenMutate(id);
  };
  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-3 rounded-lg border transition-all cursor-pointer',
        isRead
          ? 'bg-white/40 border-gray-200 hover:bg-gray-50'
          : 'bg-blue-50 border-blue-300 hover:bg-blue-100 shadow-sm'
      )}
    >
      <div className="flex justify-between items-start">
        <div className="font-semibold text-sm">{title}</div>

        <div className="text-xs opacity-70">{formatTime(createdAt)}</div>
      </div>

      <div className="text-sm text-gray-600">{message}</div>

      {workspaceId && (
        <Link
          href={`/w/${workspaceId}`}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          Открыть Workspace →
        </Link>
      )}

      <div className="flex justify-end gap-3 text-xs pt-1 mt-1 border-t">
        {!isRead && (
          <button
            onClick={() => onRead()}
            className="flex items-center gap-1 text-green-600 hover:text-green-800"
          >
            <CheckCircle size={14} /> Прочитано
          </button>
        )}

        <button
          onClick={() => onHidden()}
          className="flex items-center gap-1 text-red-600 hover:text-red-800"
        >
          <Trash2 size={14} /> Убрать
        </button>
      </div>
    </div>
  );
};

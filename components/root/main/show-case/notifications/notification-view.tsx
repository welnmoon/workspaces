'use client';

import { Badge } from '@/components/ui/badge';
import { Bell, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NotificationViewProps = {
  title: string;
  message: string;
  createdAt: string | Date;
  isRead?: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
  workspaceLabel?: string | null;
  workspaceHref?: string | null;
  showActions?: boolean;
  onMarkRead?: () => void;
  onHide?: () => void;
};

export function NotificationView({
  title,
  message,
  createdAt,
  isRead = false,
  type = 'info',
  workspaceLabel,
  workspaceHref,
  showActions = false,
  onMarkRead,
  onHide,
}: NotificationViewProps) {
  const dateLabel = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt));

  const tone =
    type === 'warning'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : type === 'error'
        ? 'bg-red-50 border-red-200 text-red-900'
        : type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-blue-50 border-blue-200 text-blue-900';

  return (
    <TooltipProvider>
      <li
        className={cn(
          'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm',
          isRead ? 'bg-white' : tone
        )}
      >
        <span className="rounded-full bg-amber-100 p-2 text-amber-700">
          <Bell className="h-4 w-4" />
        </span>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold leading-tight">{title}</p>
            <Badge variant="outline" className="text-[11px]">
              {isRead ? 'Прочитано' : 'Новое'}
            </Badge>
          </div>

          <p className="text-xs leading-snug text-muted-foreground">{message}</p>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{dateLabel}</span>
            {workspaceHref && workspaceLabel && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 text-primary underline-anim cursor-pointer">
                    <LinkIcon className="h-3.5 w-3.5" />
                    {workspaceLabel}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Ссылка ведет в рабочее пространство
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {showActions && (
            <div className="flex gap-2 pt-1">
              <button
                className="rounded border border-zinc-200 px-2 py-1 text-[11px] text-foreground hover:bg-zinc-50"
                onClick={onMarkRead}
                disabled={!onMarkRead}
              >
                Отметить как прочитанное
              </button>
              <button
                className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-700 hover:bg-red-100"
                onClick={onHide}
                disabled={!onHide}
              >
                Убрать
              </button>
            </div>
          )}
        </div>
      </li>
    </TooltipProvider>
  );
}

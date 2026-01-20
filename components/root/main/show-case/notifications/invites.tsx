import { Badge } from '@/components/ui/badge';
import { Loader, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getDayYearTime } from '@/helpers/time/day-year-time';

                                        

const statusMap: Record<string, string> = {
  PENDING: 'Ожидание',
  ACCEPTED: 'Принято',
  REVOKED: 'Отозвано',
  EXPIRED: 'Просрочено',
};

export type InvitationNotificationViewProps = {
  workspaceLabel: string;
  invitedRole: string;
  status: string;

                  
  inviterLabel?: string | null;

                          
  workspaceHref?: string | null;

                       
  showActions?: boolean;
  isPending?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
};

export function InvitationNotificationView({
  workspaceLabel,
  invitedRole,
  status,
  inviterLabel = null,
  workspaceHref = null,
  showActions = true,
  isPending = false,
  onAccept,
  onReject,
}: InvitationNotificationViewProps) {
  const dateLabel = getDayYearTime(new Date());

  const statusLabel = statusMap[status] ?? status;

  return (
    <li className="flex items-start gap-3 px-4 py-3 text-sm">
      <span className="rounded-full bg-primary/10 p-2 text-primary">
        <Users className="h-4 w-4" />
      </span>

      <div className="flex-1 space-y-1">
        <p className="font-medium leading-tight">{workspaceLabel}</p>

        <p className="text-xs text-muted-foreground">
          Приглашение на роль{' '}
          <span className="font-semibold">{invitedRole}</span>
          {inviterLabel ? ` · от ${inviterLabel}` : ''}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
          <Badge variant="outline" className="text-[11px]">
            {statusLabel}
          </Badge>
        </div>

        {status === 'ACCEPTED' && workspaceHref && (
          <Link
            href={workspaceHref}
            className="inline-flex text-[12px] font-medium text-primary-600 hover:text-primary-700 underline-anim"
          >
            Перейти в рабочее пространство
          </Link>
        )}

        {status === 'PENDING' && showActions && (
          <div className="space-x-2">
            <Button
              onClick={onAccept}
              variant="outline"
              className="text-[11px] px-2 py-0"
              disabled={isPending || !onAccept}
              title={!onAccept ? 'Действие недоступно' : undefined}
            >
              {isPending ? <Loader className="animate-spin" /> : 'Принять'}
            </Button>

            <Button
              onClick={onReject}
              variant="destructive"
              className="text-[11px] text-white px-2 py-1"
              disabled={!onReject}
              title={!onReject ? 'Действие недоступно' : undefined}
            >
              Отклонить
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}

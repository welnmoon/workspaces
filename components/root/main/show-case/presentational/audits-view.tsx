'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getDayYearTime } from '@/helpers/time/day-year-time';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type AuditViewItem = {
  id: number | string;
  userName?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: number | string | null;
  createdAt: string | Date;
};

const entityLabel = (entity?: string | null) =>
  entity ? entity.toLowerCase() : 'item';

function formatAuditText(a: AuditViewItem) {
  switch (a.action) {
    case 'CREATE':
      return `created ${entityLabel(a.entityType)}`;
    case 'UPDATE':
      return `updated ${entityLabel(a.entityType)}`;
    case 'DELETE':
      return `deleted ${entityLabel(a.entityType)}`;
    case 'INVITE_SENT':
      return 'sent an invitation';
    case 'INVITE_ACCEPTED':
      return 'accepted invitation';
    case 'TASK_STATUS_CHANGED':
      return 'changed task status';
    case 'TASK_ASSIGNEE_CHANGED':
      return 'changed task assignee';
    case 'PROJECT_RENAMED':
      return 'renamed project';
    case 'LOGIN':
      return 'logged in';
    case 'LOGOUT':
      return 'logged out';
    default:
      return a.action.toLowerCase();
  }
}

const AuditsView = ({ audits }: { audits: AuditViewItem[] }) => {
  return (
    <TooltipProvider>
      <section className="flex flex-col rounded-lg border border-zinc-100 bg-white shadow-sm">
      {audits && audits.length > 0 ? (
        audits.map((a, idx) => {
          const initials = (a.userName || 'System')
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          const dateLabel = getDayYearTime(a.createdAt);

          return (
            <div key={a.id} className="flex flex-col px-4">
              <div className="flex gap-4 py-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium">
                      {a.userName ?? 'System'}
                    </span>{' '}
                    {formatAuditText(a)}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {a.entityType && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline">{a.entityType}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>Тип сущности</TooltipContent>
                      </Tooltip>
                    )}
                    {a.entityId && (
                      <span className="truncate">#{a.entityId}</span>
                    )}
                    <span className="text-zinc-400">•</span>
                    <span>{dateLabel}</span>
                  </div>
                </div>
              </div>

              {idx < audits.length - 1 && <Separator />}
            </div>
          );
        })
      ) : (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
          Лента аудита пуста — покажите, кто что делал.
        </div>
      )}
      </section>
    </TooltipProvider>
  );
};

export default AuditsView;

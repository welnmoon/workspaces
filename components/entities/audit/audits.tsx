'use client';

import { AuditWithUser } from '@/types/prisma/DTO/audit';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import getFullName from '@/helpers/profile.ts/get-full-name';
import EmptyState from '@/components/empty-state';

const entityLabel = (entity?: string | null) =>
  entity ? entity.toLowerCase() : 'item';

function formatAuditText(a: AuditWithUser) {
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
  }
}

const Audits = ({ audits }: { audits: AuditWithUser[] }) => {
  return (
    <section className="flex flex-col">
      {audits &&
        audits.length > 0 &&
        audits.map((a, idx) => (
          <div key={a.id} className="flex flex-col">
            <div className="flex gap-4 py-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={undefined} />
                <AvatarFallback>
                  {getFullName({
                    firstName: a.user?.firstName,
                    lastName: a.user?.lastName,
                  })
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1 flex-1">
                <p className="text-sm leading-relaxed">
                  <span className="font-medium">
                    {getFullName({
                      firstName: a.user?.firstName,
                      lastName: a.user?.lastName,
                    }) ?? 'System'}
                  </span>{' '}
                  {formatAuditText(a)}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{a.entityType}</Badge>
                  {a.entityId && (
                    <span className="truncate">#{a.entityId}</span>
                  )}
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(a.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {idx < audits.length - 1 && <Separator />}
          </div>
        ))}
      {audits.length === 0 && (
        <div>
          <EmptyState
            title="Пока пусто"
            subtitle="Смотрите что происходит в вашем пространстве."
            iconIsImage
            imageSrc="/images/audit/audit.png"
            imageAlt="Audit logs"
            imageClassName="w-auto h-auto rounded-md shadow-md pointer-events-none select-none"
          />
        </div>
      )}
    </section>
  );
};

export default Audits;

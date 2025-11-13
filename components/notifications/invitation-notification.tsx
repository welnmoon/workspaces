'use client';

import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export type InvitationNotificationData = {
  id: number;
  workspaceId: number;
  workspaceName?: string | null;
  invitedRole: string;
  status: string;
  createdAt: string;
  inviterName?: string | null;
};

const statusMap: Record<string, string> = {
  PENDING: 'Ожидание',
  ACCEPTED: 'Принято',
  REVOKED: 'Отозвано',
  EXPIRED: 'Просрочено',
};

export function InvitationNotification({
  invitation,
}: {
  invitation: InvitationNotificationData;
}) {
  const workspaceLabel =
    invitation.workspaceName ?? `Workspace #${invitation.workspaceId}`;

  const dateLabel = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(invitation.createdAt));

  const statusLabel = statusMap[invitation.status] ?? invitation.status;

  return (
    <li className="flex items-start gap-3 px-4 py-3 text-sm">
      <span className="rounded-full bg-primary/10 p-2 text-primary">
        <Users className="h-4 w-4" />
      </span>
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-tight">{workspaceLabel}</p>
        <p className="text-xs text-muted-foreground">
          Приглашение на роль <span className="font-semibold">{invitation.invitedRole}</span>
          {invitation.inviterName ? ` · от ${invitation.inviterName}` : ''}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
          <Badge variant="outline" className="text-[11px]">
            {statusLabel}
          </Badge>
        </div>
      </div>
    </li>
  );
}

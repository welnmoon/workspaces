import { Badge } from '@/components/ui/badge';
import { Loader, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { InvitationDTO } from '@/types/prisma/DTO/invitations';
import { useAcceptInvitation } from '@/hooks/notifications/invitations/use-accept-inviation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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
  userId,
  invitation,
}: {
  userId: string;
  invitation: InvitationDTO;
}) {
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useAcceptInvitation(userId);
  const workspaceLabel =
    invitation.workspaceId ?? `Workspace #${invitation.workspaceId}`;

  const dateLabel = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(invitation.createdAt));

  const statusLabel = statusMap[invitation.status] ?? invitation.status;

  const handleAccept = () => {
    try {
      mutate(
        { workspaceId: invitation.workspaceId, invId: invitation.id },
        {
          onSuccess: () => {
            toast.success('Приглашение принято');
            router.refresh();
          },
          onError: () => {
            toast.error('Приглашение не принято');
          },
        }
      );
    } catch (e) {}
  };

  return (
    <li className="flex items-start gap-3 px-4 py-3 text-sm">
      <span className="rounded-full bg-primary/10 p-2 text-primary">
        <Users className="h-4 w-4" />
      </span>
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-tight">{workspaceLabel}</p>
        <p className="text-xs text-muted-foreground">
          Приглашение на роль{' '}
          <span className="font-semibold">{invitation.invitedRole}</span>
          {invitation.invitedUserEmail ? ` · от ${invitation.inviterId}` : ''}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
          <Badge variant="outline" className="text-[11px]">
            {statusLabel}
          </Badge>
        </div>
        {invitation.status === 'PENDING' && (
          <div>
            <Button
              onClick={() => handleAccept()}
              variant="outline"
              className="text-[11px]"
              disabled={isPending}
            >
              {isPending ? <Loader className="animate-spin" /> : 'Принять'}
            </Button>
            <Button variant="destructive" className="text-[11px]">
              Отклонить
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}

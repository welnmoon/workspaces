import { Badge, type BadgeProps } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvitationDTO } from '@/types/prisma/DTO/invitations';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type StatusConfig = {
  label: string;
  variant: NonNullable<BadgeProps['variant']>;
};

const statusConfig: Record<InvitationDTO['status'], StatusConfig> = {
  PENDING: { label: 'Ожидание', variant: 'warning' },
  ACCEPTED: { label: 'Принято', variant: 'success' },
  REVOKED: { label: 'Отозвано', variant: 'destructive' },
  EXPIRED: { label: 'Истекло', variant: 'destructive' },
};

const expiredStatus: StatusConfig = {
  label: 'Просрочено',
  variant: 'destructive',
};

const dateFormat = 'dd MMM yyyy, HH:mm';

const InvitesSection = ({ invites }: { invites: InvitationDTO[] }) => {
  if (invites.length === 0) {
    return (
      <section className="py-8 text-center text-muted-foreground">
        <p>Приглашения пока не отправлялись</p>
      </section>
    );
  }

  const now = new Date();

  return (
    <section>
      <Table>
        <TableCaption>
          Отправленные приглашения в рабочее пространство
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действительно до</TableHead>
            <TableHead>Отправлено</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => {
            const isExpired =
              invite.status === 'PENDING' && invite.expiresAt < now;
            const status = isExpired
              ? expiredStatus
              : statusConfig[invite.status];

            return (
              <TableRow key={invite.id}>
                <TableCell className="font-medium">
                  {invite.invitedUserEmail}
                </TableCell>
                <TableCell>{invite.invitedRole}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
                <TableCell>
                  {format(invite.expiresAt, dateFormat, { locale: ru })}
                </TableCell>
                <TableCell>
                  {format(invite.createdAt, dateFormat, { locale: ru })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default InvitesSection;

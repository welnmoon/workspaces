// components/entities/workspaces/payments-section.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Decimal } from '@prisma/client/runtime/client';
import { PaymentDTO } from '@/types/prisma/DTO/payment';

type PaymentsSectionProps = {
  payments: PaymentDTO[];
  currentUserId: string;
};

const tariffConfig = {
  FREE: { name: 'Free', color: 'bg-zinc-100 text-zinc-700' },
  PRO: { name: 'Pro', color: 'bg-blue-100 text-blue-700' },
  BUSINESS: { name: 'Business', color: 'bg-purple-100 text-purple-700' },
} as const;

const statusConfig = {
  COMPLETED: {
    label: 'Оплачено',

    color: 'text-green-600',
  },
  FAILED: { label: 'Ошибка', color: 'text-red-600' },
  CANCELLED: {
    label: 'Отменено',

    color: 'text-orange-600',
  },
  PENDING: { label: 'В обработке', color: 'text-yellow-600' },
  REFUNDED: {
    label: 'Возврат',

    color: 'text-gray-600',
  },
} as const;

export default function PaymentsSection({
  payments,
  currentUserId,
}: PaymentsSectionProps) {
  if (payments.length === 0) {
    return (
      <section className="py-8 text-center text-muted-foreground">
        <p>История платежей пуста</p>
      </section>
    );
  }

  return (
    <section>
      <Table>
        <TableCaption>История платежей по пространству</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            {/* <TableHead>Кто оплатил</TableHead> */}
            <TableHead>Тариф</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действует до</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            // const StatusIcon = statusConfig[payment.status].icon;
            const isCurrentUser = payment.userId === currentUserId;

            return (
              <TableRow
                key={payment.id}
                className={isCurrentUser ? 'bg-primary-50/50' : ''}
              >
                {/* Дата оплаты */}
                <TableCell className="font-medium">
                  {payment.paidAt
                    ? format(payment.paidAt, 'dd MMM yyyy, HH:mm', {
                        locale: ru,
                      })
                    : format(payment.createdAt, 'dd MMM yyyy, HH:mm', {
                        locale: ru,
                      })}
                </TableCell>

                {/* Кто оплатил */}
                {/* <TableCell>
                  {payment.user ? (
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {payment.user.firstName} {payment.user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payment.user.email}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="primary" className="w-fit mt-1 text-xs">
                          Вы
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell> */}

                {/* Тариф */}
                <TableCell>
                  <Badge className={tariffConfig[payment.tariff].color}>
                    {tariffConfig[payment.tariff].name}
                  </Badge>
                </TableCell>

                {/* Сумма */}
                <TableCell className="font-semibold">
                  {Number(payment.amount).toLocaleString('ru-KZ')}{' '}
                  {payment.currency}
                </TableCell>

                {/* Статус */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* <StatusIcon
                      className={`w-4 h-4 ${statusConfig[payment.status].color}`}
                    /> */}
                    <span className={statusConfig[payment.status].color}>
                      {statusConfig[payment.status].label}
                    </span>
                  </div>
                  {payment.reason && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {payment.reason}
                    </p>
                  )}
                </TableCell>

                {/* Действует до */}
                <TableCell>
                  {payment.validUntil ? (
                    <span
                      className={
                        new Date(payment.validUntil) < new Date()
                          ? 'text-red-600'
                          : 'text-green-600'
                      }
                    >
                      {format(payment.validUntil, 'dd MMM yyyy', {
                        locale: ru,
                      })}
                    </span>
                  ) : (
                    '—'
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

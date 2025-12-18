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
import { PaymentDTO } from '@/types/prisma/DTO/payment';

type PaymentsSectionProps = {
  payments: Array<
    Omit<
      PaymentDTO,
      'paidAt' | 'createdAt' | 'updatedAt' | 'validUntil' | 'amount'
    > & {
      amount: number | string;
      paidAt: Date | string | null;
      createdAt: Date | string;
      updatedAt: Date | string;
      validUntil: Date | string | null;
    }
  >;
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
        <TableCaption>История платежей</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
          
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
            const tariff = payment.tariff as keyof typeof tariffConfig;
            const status = payment.status as keyof typeof statusConfig;
            const paidAt = payment.paidAt ? new Date(payment.paidAt) : null;
            const createdAt = new Date(payment.createdAt);
            const validUntil = payment.validUntil
              ? new Date(payment.validUntil)
              : null;

            return (
              <TableRow
                key={payment.id}
                className={isCurrentUser ? 'bg-primary-50/50' : ''}
              >
                {/* Дата оплаты */}
                <TableCell className="font-medium">
                  {paidAt
                    ? format(paidAt, 'dd MMM yyyy, HH:mm', {
                        locale: ru,
                      })
                    : format(createdAt, 'dd MMM yyyy, HH:mm', {
                        locale: ru,
                      })}
                </TableCell>

 

                {/* Тариф */}
                <TableCell>
                  <Badge className={tariffConfig[tariff].color}>
                    {tariffConfig[tariff].name}
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
                    <span className={statusConfig[status].color}>
                      {statusConfig[status].label}
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
                  {validUntil ? (
                    <span
                      className={
                        validUntil < new Date()
                          ? 'text-red-600'
                          : 'text-green-600'
                      }
                    >
                      {format(validUntil, 'dd MMM yyyy', {
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

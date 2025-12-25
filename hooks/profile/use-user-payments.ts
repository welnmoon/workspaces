import { apiRoutes } from '@/lib/routes/api-routes';
import { PaymentDTO } from '@/types/prisma/DTO/payment';
import { useQuery } from '@tanstack/react-query';

export type UserPaymentClientDTO = Omit<
  PaymentDTO,
  'paidAt' | 'createdAt' | 'updatedAt' | 'validUntil' | 'amount'
> & {
  amount: number;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  validUntil: Date | null;
};

type PaymentsResponse = {
  data?: PaymentDTO[];
};

export const useUserPayments = (userId: string) => {
  return useQuery({
    queryKey: ['user-payments', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const res = await fetch(`${apiRoutes.getUser(userId)}/payments`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch payments: ${res.status}`);
      }

      const json = (await res.json()) as PaymentsResponse;
      const rows = (json.data ?? []) as unknown as Array<
        PaymentDTO & {
          amount: string | number;
          paidAt: string | null;
          createdAt: string;
          updatedAt: string;
          validUntil: string | null;
        }
      >;

      return rows.map(
        (p): UserPaymentClientDTO => ({
          ...p,
          amount: Number(p.amount),
          paidAt: p.paidAt ? new Date(p.paidAt) : null,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          validUntil: p.validUntil ? new Date(p.validUntil) : null,
        })
      );
    },
    staleTime: 1000 * 60,
  });
};


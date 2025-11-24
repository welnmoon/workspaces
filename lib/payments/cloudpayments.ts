// lib/payments/cloudpayments.ts
'use client';

import toast from 'react-hot-toast';
import { TariffDTO } from '@/types/prisma/DTO/payment';
import { tariffs } from '@/const/tariffs';
import { CloudPaymentsData } from '@/types/cloudpayments';

export const payWithCloudPayments = (
  tariff: TariffDTO,
  email: string | null | undefined,
  workspaceId: number,
  options?: {
    onSuccess?: () => void;
    onFail?: () => void;
    onComplete?: (success: boolean) => void;
  }
) => {
  if (!email) {
    toast.error('Вы не авторизованы');
    options?.onComplete?.(false);
    return;
  }

  const config = tariffs[tariff];

  if (!window.cp?.CloudPayments) {
    toast.error('Платёжный виджет не загружен');
    options?.onComplete?.(false);
    return;
  }

  const widget = new window.cp.CloudPayments({ language: 'ru-RU' });

  widget.pay(
    'charge',
    {
      publicId: 'test_api_00000000000000000000002', // потом замени на pk_...
      description: config.description,
      amount: config.amount,
      currency: config.currency,
      invoiceId: `${config.invoiceId}-${workspaceId}-${Date.now()}`, // уникальный!
      accountId: email,
      skin: 'mini',
      data: {
        workspaceId,
        tariff,
      } satisfies CloudPaymentsData, // полная типизация!
    },
    {
      onSuccess: () => {
        toast.success('Оплата прошла успешно!');
        options?.onSuccess?.();
        options?.onComplete?.(true);
      },
      onFail: (error: Error) => {
        console.error('CloudPayments error:', error);
        toast.error('Оплата не удалась или была отменена');
        options?.onFail?.();
        options?.onComplete?.(false);
      },
    }
  );
};

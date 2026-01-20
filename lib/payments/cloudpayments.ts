                                
'use client';

import toast from 'react-hot-toast';
import { TariffDTO } from '@/types/prisma/DTO/payment';
import { tariffs } from '@/const/tariffs';
import { CloudPaymentsData } from '@/types/cloudpayments';

export const payWithCloudPayments = (
  tariff: TariffDTO,
  email: string | null | undefined,
  userId: string,
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
      publicId: 'test_api_00000000000000000000002',                          
      description: config.description,
      amount: config.amount,
      currency: config.currency,
      invoiceId: `${config.invoiceId}-${userId}-${Date.now()}`,
      accountId: email,
      skin: 'mini',
      data: {
        userId,
        tariff,
      } satisfies CloudPaymentsData,                     
    },
    {
      onSuccess: () => {
        toast.success('Оплата прошла успешно!');
        options?.onSuccess?.();
        options?.onComplete?.(true);
      },
      onFail: (error: string | undefined) => {
        console.error('CloudPayments error:', error);
        toast.error('Оплата не удалась или была отменена');
        options?.onFail?.();
        options?.onComplete?.(false);
      },
    }
  );
};

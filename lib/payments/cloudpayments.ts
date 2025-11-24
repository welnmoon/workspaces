'use client';

import toast from 'react-hot-toast';
import { TariffDTO } from '../../types/prisma/DTO/payment';
import { tariffs } from '@/const/tariffs';

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
  }
  const config = tariffs[tariff];

  const cp = window as unknown as { cp: { CloudPayments: any } };
  const widget = new cp.cp.CloudPayments();
  widget.pay(
    'charge',
    {
      publicId: 'test_api_00000000000000000000002',
      description: config.description,
      amount: config.amount,
      currency: config.currency,
      invoiceId: config.invoiceId,
      workspaceId,
      accountId: email,
      skin: 'mini', // mini / classic / modern
    },
    {
      onSuccess: () => {
        toast.success('Оплата прошла успешно!');
        options?.onSuccess?.();
        options?.onComplete?.(true);
      },
      onFail: () => {
        toast.error('Оплата не удалась или была отменена');
        options?.onFail?.();
        options?.onComplete?.(false);
      },
    }
  );
};

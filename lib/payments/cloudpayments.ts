'use client';

import toast from 'react-hot-toast';
import { TariffDTO } from '../../types/prisma/DTO/payment';
import { redirect, useRouter } from 'next/navigation';
import { clientRoutes } from '../routes/client-routes';
import { useSession } from 'next-auth/react';

interface TariffConfig {
  amount: number;
  currency: 'KZT';
  description: string;
  invoiceId: string;
  name: string;
  features: string[];
}

export const tariffs: Record<TariffDTO, TariffConfig> = {
  FREE: {
    amount: 0,
    currency: 'KZT',
    description: 'Бесплатный тариф',
    invoiceId: 'free-001',
    name: 'Free',
    features: [
      '1 воркспейс и 2 участника',
      'До 3 проектов без оплаты',
      'Базовые задачи без приоритетов и сроков',
      'История активности недоступна',
    ],
  },
  PRO: {
    amount: 2990,
    currency: 'KZT',
    description: 'PRO — 1 месяц',
    invoiceId: 'pro-monthly',
    name: 'Pro',
    features: [
      'Неограниченные воркспейсы и участники',
      'Проекты и задачи с дедлайнами и приоритетами',
      'Приглашения/роли (ADMIN, MEMBER)',
      'Экспорт и история активности за 6 месяцев',
    ],
  },
  BUSINESS: {
    amount: 9990,
    currency: 'KZT',
    description: 'BUSINESS — 1 месяц',
    invoiceId: 'business-monthly',
    name: 'Business',
    features: [
      'Все из PRO плюс контроль доступов для команд/отделов',
      'Отчёты и статистика за любой период',
      'Приоритетная поддержка и SLA',
      'Брендирование: логотипы, цвета, домен',
    ],
  },
};

export const payWithCloudPayments = (
  tariff: TariffDTO,
  email: string | null | undefined,
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

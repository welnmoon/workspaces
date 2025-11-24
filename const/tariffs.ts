import type { TariffConfig, TariffDTO } from '@/types/prisma/DTO/payment';

export const tariffs: Record<string, TariffConfig> = {
  FREE: {
    amount: 0,
    currency: 'KZT',
    description: 'Бесплатный тариф',
    invoiceId: 'free-001',
    name: 'FREE',
    features: [
      '1 воркспейс и 2 участника',
      'До 3 проектов без оплаты',
      'Базовые задачи без приоритетов и сроков',
      'История активности недоступна',
    ],
    color: '#13c2c2',
    textColor: '#fff',
  },
  PRO: {
    amount: 2990,
    currency: 'KZT',
    description: 'PRO — 1 месяц',
    invoiceId: 'pro-monthly',
    name: 'PRO',
    features: [
      'Неограниченные воркспейсы и участники',
      'Проекты и задачи с дедлайнами и приоритетами',
      'Приглашения/роли (ADMIN, MEMBER)',
      'Экспорт и история активности за 6 месяцев',
    ],
    color: '#fbbf24',
    textColor: '#000',
  },
  BUSINESS: {
    amount: 9990,
    currency: 'KZT',
    description: 'BUSINESS — 1 месяц',
    invoiceId: 'business-monthly',
    name: 'BUSINESS',
    features: [
      'Все из PRO плюс контроль доступов для команд/отделов',
      'Отчёты и статистика за любой период',
      'Приоритетная поддержка и SLA',
      'Брендирование: логотипы, цвета, домен',
    ],
    color: '#ff4d4f',
    textColor: '#fff',
  },
};

import {
  Leaf,
  Rocket,
  Building2,
  Users,
  FolderKanban,
  CalendarClock,
  Shield,
  FileDown,
  Clock,
  BarChart3,
  Headset,
  Palette,
  LayoutGrid,
  Layers,
  UserCog,
  History,
  FileBarChart,
  ShieldCheck,
} from 'lucide-react';
import type { TariffConfig } from '@/types/prisma/DTO/payment';

export type TariffKey = 'FREE' | 'PRO' | 'BUSINESS';
export const TariffKeys = {
  FREE: 'FREE' as TariffKey,
  PRO: 'PRO' as TariffKey,
  BUSINESS: 'BUSINESS' as TariffKey,
};

export const tariffBottomCards = {
  [TariffKeys.FREE]: [
    {
      title: 'Воркспейсы',
      value: '1 активный',
      icon: LayoutGrid,
    },
    {
      title: 'Участники',
      value: 'До 2 человек',
      icon: Users,
    },
    {
      title: 'Поддержка',
      value: 'Только база знаний',
      icon: Headset,
    },
  ],

  [TariffKeys.PRO]: [
    {
      title: 'Воркспейсы',
      value: 'Без ограничений',
      icon: Layers,
    },
    {
      title: 'Команда',
      value: 'Роли и приглашения',
      icon: UserCog,
    },
    {
      title: 'История',
      value: 'До 6 месяцев',
      icon: History,
    },
  ],

  [TariffKeys.BUSINESS]: [
    {
      title: 'Структура',
      value: 'Отделы и команды',
      icon: Building2,
    },
    {
      title: 'Отчёты',
      value: 'За любой период',
      icon: FileBarChart,
    },
    {
      title: 'Поддержка',
      value: 'SLA + приоритет',
      icon: ShieldCheck,
    },
  ],
};

export const tariffs: Record<string, TariffConfig> = {
  [TariffKeys.FREE]: {
    amount: 0,
    currency: 'KZT',
    description: 'Бесплатный тариф',
    invoiceId: 'free-001',
    name: 'FREE',
    label: 'Бесплатно',
    icon: Leaf,
    features: [
      { label: '1 воркспейс и 2 участника', icon: Users },
      { label: 'До 3 проектов без оплаты', icon: FolderKanban },
      {
        label: 'Базовые задачи без приоритетов и сроков',
        icon: CalendarClock,
      },
      { label: 'История активности недоступна', icon: Clock },
    ],
    color: '#13c2c2',
    textColor: '#fff',
  },

  [TariffKeys.PRO]: {
    amount: 2990,
    currency: 'KZT',
    description: 'PRO — 1 месяц',
    invoiceId: 'pro-monthly',
    name: 'PRO',
    label: 'Про',
    icon: Rocket,
    features: [
      { label: 'Неограниченные воркспейсы', icon: Users },
      {
        label: 'Задачи с дедлайнами и приоритетами',
        icon: CalendarClock,
      },

      {
        label: 'Экспорт и история активности за 6 месяцев',
        icon: FileDown,
      },
    ],
    color: '#fbbf24',
    textColor: '#000',
  },

  [TariffKeys.BUSINESS]: {
    amount: 9990,
    currency: 'KZT',
    description: 'BUSINESS — 1 месяц',
    invoiceId: 'business-monthly',
    name: 'BUSINESS',
    label: 'Бизнес',
    icon: Building2,
    features: [
      {
        label: 'Контроль доступов для команд и отделов',
        icon: Shield,
      },
      {
        label: 'Отчёты и статистика за любой период',
        icon: BarChart3,
      },
      {
        label: 'Приоритетная поддержка и SLA',
        icon: Headset,
      },
      {
        label: 'Брендирование: логотипы, цвета, домен',
        icon: Palette,
      },
    ],
    color: '#ff4d4f',
    textColor: '#fff',
  },
};

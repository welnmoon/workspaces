import type { Payment } from '@prisma/client';

export type TariffDTO = 'FREE' | 'PRO' | 'BUSINESS';

export interface TariffConfig {
  amount: number;
  currency: 'KZT';
  description: string;
  invoiceId: string;
  name: string;
  features: string[];
  color: string;
  textColor: string;
}

export type PaymentDTO = Payment;

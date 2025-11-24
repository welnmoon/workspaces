import type { Payment, Tariff } from '@prisma/client';

export type TariffDTO = Tariff;

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
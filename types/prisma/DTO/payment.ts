import { type Payment } from '@prisma/client';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type TariffDTO = 'FREE' | 'PRO' | 'BUSINESS';

export interface TariffConfig {
  amount: number;
  currency: 'KZT';
  description: string;
  invoiceId: string;
  name: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  features: {
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
  }[];
  color: string;
  textColor: string;
}

export type PaymentDTO = Payment;

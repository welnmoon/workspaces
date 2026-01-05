import 'server-only';
import { TariffKeys } from '@/const/tariffs';

export const STRIPE_PLANS = {
  [TariffKeys.PRO]: {
    priceId: process.env.STRIPE_PRICE_PRO!,
    mode: 'subscription',
  },
  [TariffKeys.BUSINESS]: {
    priceId: process.env.STRIPE_PRICE_BUSINESS!,
    mode: 'subscription',
  },
} as const;

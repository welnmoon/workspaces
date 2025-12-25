import { Tariff } from '@prisma/client';
import z from 'zod';

export const paymentSchema = z.object({
  name: z.enum(Tariff),
});

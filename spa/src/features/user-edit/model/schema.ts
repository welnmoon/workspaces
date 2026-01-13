import { z } from 'zod';

const emptyToUndefined = (v: unknown) => (v === '' ? undefined : v);

export const editUserSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be at most 50 characters long')
      .optional(),
    lastName: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be at most 50 characters long')
      .optional(),
    email: z.email('Invalid email').optional(),
    password: z
      .preprocess(
        emptyToUndefined,
        z.string().min(4, 'Password must be at least 4 characters long')
      )
      .optional(),
    confirmPassword: z
      .preprocess(
        emptyToUndefined,
        z.string().min(4, 'Password must be at least 4 characters long')
      )
      .optional(),
    avatarUrl: z.string().optional(),
    currentTariff: z.enum(['FREE', 'PRO', 'BUSINESS']),
    platformRole: z.enum(['USER', 'SYSADMIN']),
    emailVerified: z.date().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type EditUserSchemaType = z.input<typeof editUserSchema>;

import { z } from 'zod';


const emptyToUndefined = (value: string) =>
  value === '' ? undefined : value;
const optionalPasswordSchema = z
  .union([
    z.string().min(4, 'Password must be at least 4 characters long'),
    z.literal(''),
  ])
  .transform(emptyToUndefined)
  .optional();

// User edit schema
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
    password: optionalPasswordSchema,
    confirmPassword: optionalPasswordSchema,
    avatarUrl: z.string().optional(),
    currentTariff: z.enum(['FREE', 'PRO', 'BUSINESS']),
    platformRole: z.enum(['USER', 'SYSADMIN']),
    emailVerified: z.date().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type EditUserSchemaType = z.infer<typeof editUserSchema>;

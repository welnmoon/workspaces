import z from 'zod';

export const profileSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Имя обязательно').optional().or(z.literal('')),
    lastName: z.string().trim().max(50).optional().or(z.literal('')),
    email: z.string().trim().email('Неверный email').optional().or(z.literal('')),
    avatarUrl: z.string().trim().max(300).optional().or(z.literal('')),
    image: z.string().trim().max(300).optional().or(z.literal('')),
    img: z.string().trim().max(300).optional().or(z.literal('')),
    currentTariff: z.enum(['FREE', 'PRO', 'BUSINESS']).optional(),
    platformRole: z.enum(['USER', 'SYSADMIN']).optional(),
    password: z.string().min(6, 'Минимум 6 символов').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    emailVerified: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) => !data.password || data.password === data.confirmPassword,
    {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    }
  );

export type ProfileSchema = z.infer<typeof profileSchema>;

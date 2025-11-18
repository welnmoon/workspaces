import { Role } from '@prisma/client';
import z from 'zod';

const expiresInHoursSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => {
    if (!value) return true;
    const numeric = Number(value);
    return !Number.isNaN(numeric) && numeric > 0 && numeric <= 24 * 30;
  }, 'Укажите срок действия в часах (1–720)');

export const inviteUserFormSchema = z.object({
  email: z.email('Введите корректный email'),
  role: z.enum(Role, { error: () => ({ message: 'Выберите роль' }) }),
  expiresInHours: expiresInHoursSchema,
});

export type InviteUserFormValues = z.infer<typeof inviteUserFormSchema>;

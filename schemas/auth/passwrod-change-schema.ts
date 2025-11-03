import z from 'zod';

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Требуется текущий пароль'),
  newPassword: z.string().min(6, 'Минимум 6 символов'),
  // .regex(/[A-Z]/, 'Нужна заглавная буква')
  // .regex(/[a-z]/, 'Нужна строчная буква')
  // .regex(/[0-9]/, 'Нужна цифра')
  // .regex(/[^A-Za-z0-9]/, 'Нужен спецсимвол'),
});

export type PasswordChangeSchemaDTO = z.infer<typeof passwordChangeSchema>;

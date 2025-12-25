import z from 'zod';

export const registerSchema = z.object({
  lastName: z
    .string()
    .min(2, 'Фамилия должно содержать минимум 2 символа')
    .optional(),
  firstName: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .optional(),
  email: z.email('Некорректный email'), // юзаем новую версию зод 4
  password: z.string().min(4, 'Пароль должен содержать минимум 4 символа'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

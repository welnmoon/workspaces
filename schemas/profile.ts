import z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Имя обязательно'),
  lastName: z.string().trim().max(50).optional().or(z.literal('')),
  img: z.string().trim().max(300).optional(),
});

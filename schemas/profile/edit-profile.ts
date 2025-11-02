import z from 'zod';

export const editProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'Имя обязательно').optional(),
  lastName: z.string().trim().max(50).optional().or(z.literal('')),
  image: z.string().trim().max(300).optional(),
});

export type EditProfileValue = z.infer<typeof editProfileSchema>;

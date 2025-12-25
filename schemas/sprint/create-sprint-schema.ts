import z from 'zod';

export const createSprintSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Укажите название спринта')
    .max(100, 'Название не должно превышать 100 символов'),
  goal: z.string().trim().max(500).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateSprintSchema = z.infer<typeof createSprintSchema>;

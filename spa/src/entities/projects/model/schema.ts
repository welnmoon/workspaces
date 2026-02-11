import z from 'zod';

export const editProjectSchema = z.object({
  name: z.string().min(2, '').max(200, '').optional(),
  description: z.string().max(2000, '').optional(),
  // endedAt: z.string().optional(),
});

export type EditProjectType = z.infer<typeof editProjectSchema>;

import z from 'zod';

export const createTaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be at most 200 characters'),
  description: z.string().trim().max(1000).optional(),
  dueDate: z.string().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;

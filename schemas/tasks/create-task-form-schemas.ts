import { TASK_PRIORITY_ARRAY } from '@/const/priority';
import z from 'zod';

export const createTaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Название задачи обязательно')
    .max(50, 'Название должно быть не длиннее 50 символов'),
  description: z.string().trim().max(1000).optional(),
  dueDate: z.string().min(1, 'Укажите срок выполнения').optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(TASK_PRIORITY_ARRAY),
  sprintId: z.number().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;

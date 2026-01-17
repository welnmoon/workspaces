import { TASK_PRIORITY_ARRAY } from '@/const/priority';
import { TASK_STATUSES } from '@/const/tasks-status';
import z from 'zod';

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(50).optional(),
    description: z.string().trim().max(1000).optional().nullable(),
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITY_ARRAY).optional(),
    assigneeId: z.string().trim().min(1).optional().nullable(),
    dueDate: z.string().trim().optional().nullable(),
    sprintId: z.number().int().positive().optional().nullable(),
  })
  .partial();

export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;

import { TaskPriority } from '@prisma/client';
import z from 'zod';

export const changeTaskPrioritySchema = z.object({
  priority: z.nativeEnum(TaskPriority),
});

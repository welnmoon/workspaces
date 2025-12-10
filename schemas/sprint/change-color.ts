import { SprintColor } from '@prisma/client';
import z from 'zod';

export const changeSprintColorSchema = z.object({
  color: z.enum(SprintColor),
});

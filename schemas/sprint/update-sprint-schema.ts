import { createSprintSchema } from '@/schemas/sprint/create-sprint-schema';
import { SprintColor } from '@prisma/client';
import z from 'zod';

export const updateSprintSchema = createSprintSchema
  .extend({
    color: z.nativeEnum(SprintColor).optional(),
  })
  .partial();

export type UpdateSprintFormValues = z.infer<typeof updateSprintSchema>;

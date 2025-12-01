import z from 'zod';

export const createProjectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Project name is required')
    .max(30, 'Project name must be at most 30 characters'),
  description: z.string().trim().max(500).optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>;

export const workspaceIdExistSchema = createProjectFormSchema.extend({
  workspaceId: z.number(),
});

export type CreateProjectWithWorkspaceIdValues = z.infer<
  typeof workspaceIdExistSchema
>;

import z from 'zod';

export const editWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters long')
    .nullable()
    .optional(),
  avatarUrl: z.string().nullable().optional(),
});

export type EditWorkspace = z.infer<typeof editWorkspaceSchema>;

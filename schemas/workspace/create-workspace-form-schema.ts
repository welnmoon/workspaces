import z from 'zod';

export const createWorkspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Название обязательно')
    .max(30, 'Заголовок должен быть не длиннее 30 символов'),
  description: z.string().trim().max(1000).optional(),
  avatarUrl: z.string().trim().max(300).optional(),
                                                                                                                                                               
});

export type CreateWorkspaceFormValues = z.infer<
  typeof createWorkspaceFormSchema
>;

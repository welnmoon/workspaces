import z from 'zod';

export const createWorkspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be at most 200 characters'),
  description: z.string().trim().max(1000).optional(),
  avatarUrl: z.string().trim().max(300).optional(),
  // TODO - Добавить поле тарифа, затем при создании воркспейса спрашивать какой тариф им нужен. дефолт - FREE, если другая то отправлять их на страницу оплаты
});

export type CreateWorkspaceFormValues = z.infer<
  typeof createWorkspaceFormSchema
>;

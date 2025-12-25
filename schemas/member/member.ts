import z from 'zod';
import { ROLE_EDITABLE_VALUES } from '@/types/prisma/DTO/role';

export const editMemberFormSchema = z.object({
  role: z.enum(ROLE_EDITABLE_VALUES, {
    error: 'Role is required',
  }),
});

export type editMemberFormDefaultValues = z.infer<typeof editMemberFormSchema>;

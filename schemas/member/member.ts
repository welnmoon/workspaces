import { Role } from '@prisma/client';
import z from 'zod';

export const editMemberFormSchema = z.object({
  role: z.enum([Role.ADMIN, Role.MEMBER], {
    error: 'Role is required',
  }),
});

export type editMemberFormDefaultValues = z.infer<typeof editMemberFormSchema>;

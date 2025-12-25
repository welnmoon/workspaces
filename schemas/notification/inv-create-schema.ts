import { Role } from '@prisma/client';
import z from 'zod';

export const invitationCreateSchema = z.object({
  workspaceId: z.number('Workspace ID is required'),
  email: z.email('Некорректный email'),
  newUserRole: z.enum(Role),
  expiresInHours: z.number().optional(),
});

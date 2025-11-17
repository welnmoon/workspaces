import { requireUser } from '@/helpers/require-user';
import { badRequest, conflict, created } from '@/lib/http';
import { InvitationService } from '@/lib/services/invitation';

import { Role } from '@prisma/client';

import { NextRequest } from 'next/server';
import z from 'zod';

export const invitationCreateSchema = z.object({
  workspaceId: z.number('Workspace ID is required'),
  email: z.email('Некорректный email'),
  newUserRole: z.enum(Role),
  expiresInHours: z.number().optional(),
});

// Создание и отправка приглашения на почту
export async function POST(req: NextRequest) {
  const { id } = await requireUser();
  const body = await req.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON');

  const parsed = invitationCreateSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.message);
  }
  const { workspaceId, email, newUserRole, expiresInHours } = parsed.data;

  const res = await InvitationService.createInvitation({
    workspaceId,
    id,
    email,
    newUserRole,
    expiresInHours,
  });

  if (res.kind === 'already_member')
    return badRequest(
      'Пользователь уже в этом рабочем пространстве',
      'already_member'
    );

  if (res.kind === 'already_pending')
    return conflict('Приглашение уже отправлено', 'already_pending');

  return created(res.id);
}

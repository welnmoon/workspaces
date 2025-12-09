import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { noContent, unprocessable } from '@/lib/http/http';
import { SprintService } from '@/lib/services/sprint';
import { Role, SprintColor } from '@prisma/client';
import { NextRequest } from 'next/server';
import z from 'zod';

export const changeSprintColorSchema = z.object({
  color: z.enum(SprintColor),
});

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      workspaceId: string;
      projectId: string;
      sprintId: string;
    }>;
  }
) {
  try {
    await requireUser();
    const workspaceId = validateId((await params).workspaceId);
    const projectId = validateId((await params).projectId);
    const sprintId = validateId((await params).sprintId);
    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    const res = changeSprintColorSchema.safeParse(await req.json());
    if (!res.success) return unprocessable(res.error.message);

    await SprintService.changeColor(res.data.color, sprintId);

    return noContent();
  } catch (e) {
    return handleApiError(e);
  }
}

import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { noContent, unprocessable } from '@/lib/http/http';
import { SprintService } from '@/lib/services/sprint';
import { changeSprintColorSchema } from '@/schemas/sprint/change-color';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';



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
    const { workspaceId, projectId, sprintId } = await params;
    const validatedWorkspaceId = validateId(workspaceId);
    const _projectId = validateId(projectId);
    const validatedSprintId = validateId(sprintId);
    await requireWorkspaceMember({
      workspaceId: validatedWorkspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    const res = changeSprintColorSchema.safeParse(await req.json());
    if (!res.success) return unprocessable(res.error.message);

    await SprintService.changeColor(res.data.color, validatedSprintId);

    return noContent();
  } catch (e) {
    return handleApiError(e);
  }
}

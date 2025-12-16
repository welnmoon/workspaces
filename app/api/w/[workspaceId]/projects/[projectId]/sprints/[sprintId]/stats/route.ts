import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { SprintService } from '@/lib/services/sprint';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
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
    const workspaceIdNum = validateId(workspaceId);
    validateId(projectId);
    const sprintIdNum = validateId(sprintId);

    await requireWorkspaceMember({
      workspaceId: workspaceIdNum,
      allowed: [Role.ADMIN, Role.MEMBER, Role.OWNER],
    });

    const stats = await SprintService.getSprintTasksStats(sprintIdNum);

    return ok(stats);
  } catch (e) {
    return handleApiError(e);
  }
}

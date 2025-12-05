import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { SprintService } from '@/lib/services/sprint';
import { SprintTasksStatsDTO } from '@/types/prisma/DTO/sprint';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(
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
      allowed: [Role.ADMIN, Role.MEMBER, Role.OWNER],
    });

    const stats: SprintTasksStatsDTO =
      await SprintService.getSprintTasksStats(sprintId);

    return ok(stats);
  } catch (e) {
    await handleApiError(e);
  }
}

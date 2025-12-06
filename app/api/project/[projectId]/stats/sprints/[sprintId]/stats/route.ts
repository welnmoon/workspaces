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
      projectId: string;
      sprintId: string;
    }>;
  }
) {
  try {
    await requireUser();
    const { projectId, sprintId } = await params;
    const projectIdNum = validateId(projectId);
    const sprintIdNum = validateId(sprintId);

    const stats: SprintTasksStatsDTO =
      await SprintService.getSprintTasksStats(sprintIdNum);

    return ok(stats);
  } catch (e) {
    await handleApiError(e);
  }
}

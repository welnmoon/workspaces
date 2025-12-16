import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import logger from '@/lib/logger';
import { ProjectService } from '@/lib/services/project';
import { ProjectCompletedTasksDTO } from '@/types/prisma/DTO/projects';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const projectId = validateId((await params).projectId);
    const workspaceId = validateId((await params).workspaceId);
    logger.info(
      `[GET done-tasks] incoming request workspace=${workspaceId} project=${projectId}`
    );
    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.MEMBER, Role.ADMIN, Role.OWNER],
    });

    const searchParams = req.nextUrl.searchParams;
    const fromRaw = searchParams.get('from');
    const toRaw = searchParams.get('to');
    const fromParam = fromRaw ? decodeURIComponent(fromRaw) : null;
    const toParam = toRaw ? decodeURIComponent(toRaw) : null;
    const from =
      fromParam && !Number.isNaN(Date.parse(fromParam))
        ? new Date(fromParam)
        : undefined;
    const to =
      toParam && !Number.isNaN(Date.parse(toParam)) ? new Date(toParam) : undefined;
    logger.debug(
      `[GET done-tasks] params raw: from=${fromRaw ?? 'none'}, to=${toRaw ?? 'none'} decoded: from=${fromParam ?? 'none'}, to=${toParam ?? 'none'}`
    );
    logger.debug(
      `[GET done-tasks] parsed params: from=${from?.toISOString() ?? 'none'}, to=${to?.toISOString() ?? 'none'}`
    );

    const tasks = await ProjectService.getCompletedTasks(projectId, from, to);
    logger.info(
      `[GET done-tasks] fetched ${tasks.length} aggregated days for project=${projectId}`
    );
    logger.debug(`[GET done-tasks] payload=${JSON.stringify(tasks)}`);

    return ok(tasks as ProjectCompletedTasksDTO[]);
  } catch (e) {
    handleApiError(e);
  }
}

import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { UserActivity } from '@/types/prisma/DTO/projects';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const workspaceId = validateId((await params).workspaceId);
    const projectId = validateId((await params).projectId);

    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const searchParams = req.nextUrl.searchParams;
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const defaultFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const defaultTo = new Date();

    const from =
      fromParam && !Number.isNaN(Date.parse(fromParam))
        ? new Date(fromParam)
        : defaultFrom;
    const to =
      toParam && !Number.isNaN(Date.parse(toParam))
        ? new Date(toParam)
        : defaultTo;

    const activity: UserActivity = await ProjectService.getUserActivity(projectId, from, to);

    return ok(activity);
  } catch (e) {
    return handleApiError(e);
  }
}

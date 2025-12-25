import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const { workspaceId, projectId } = {
      workspaceId: validateId((await params).workspaceId),
      projectId: validateId((await params).projectId),
    };

    const { user } = await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.ADMIN, Role.OWNER],
    });

    const project = await ProjectService.toggleProjectEnd(
      projectId,
      user.id,
      workspaceId
    );

    return ok({
      id: project.id,
      endedAt: project.endedAt,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

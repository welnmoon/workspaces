import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { noContent } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const { workspaceId, projectId } = {
      workspaceId: validateId((await params).workspaceId),
      projectId: validateId((await params).projectId),
    };
    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.ADMIN, Role.OWNER],
    });

    await ProjectService.closeProject(projectId);

    return noContent();
  } catch (e) {
    handleApiError(e);
  }
}

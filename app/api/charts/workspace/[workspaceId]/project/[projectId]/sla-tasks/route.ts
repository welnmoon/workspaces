import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { SLA } from '@/types/prisma/DTO/projects';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    await requireUser();
    const workspaceId = validateId((await params).workspaceId);
    const projectId = validateId((await params).projectId);

    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const data = await ProjectService.getSLA(projectId);

    return ok(data as SLA);
  } catch (e) {
    return handleApiError(e);
  }
}

import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { TaskService } from '@/lib/services/tasks';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      workspaceId: string;
      projectId: string;
      taskId: string;
    }>;
  }
) {
  try {
    const { workspaceId, projectId, taskId } = await params;
    const workspaceIdNum = validateId(workspaceId);
    const projectIdNum = validateId(projectId);
    const taskIdNum = validateId(taskId);

    const { user } = await requireWorkspaceMember({
      workspaceId: workspaceIdNum,
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const deleted = await TaskService.deleteTask(
      taskIdNum,
      projectIdNum,
      user.id
    );
    return ok(deleted);
  } catch (e) {
    return handleApiError(e);
  }
}

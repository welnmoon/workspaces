import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { noContent } from '@/lib/http/http';
import { TaskService } from '@/lib/services/tasks';
import { NextRequest } from 'next/server';

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string; projectId: string; taskId: string }>;
  }
) {
  try {
    const user = await requireUser();
    const workspaceId = validateId((await params).workspaceId);
    const projectId = validateId((await params).projectId);
    const taskId = validateId((await params).taskId);
    await requireWorkspaceMember({
      workspaceId,
      allowed: ['OWNER', 'ADMIN'],
    });
    const sprintId: number | null = await req.json();

    await TaskService.moveTask(taskId, sprintId, projectId, user.id);

    return noContent();
  } catch (e) {
    return handleApiError(e);
  }
}

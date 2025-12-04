import { requireWorkspaceMember } from '@/guards/workspace';
import { ok, serverError } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
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
    await requireWorkspaceMember({
      workspaceId: Number(workspaceId),
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const tasks = await ProjectService.getProjectSprintTasks(
      Number(projectId),
      Number(sprintId)
    );
    return ok(tasks);
  } catch (e) {
    console.log('Error fetching sprint tasks', e);
    return serverError('Failed to fetch sprint tasks');
  }
}

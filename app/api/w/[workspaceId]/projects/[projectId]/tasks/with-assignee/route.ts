import { requireWorkspaceMember } from '@/guards/workspace';
import { ok, serverError } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const { workspaceId, projectId } = await params;
    await requireWorkspaceMember({
      workspaceId: Number(workspaceId),
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const tasks = await ProjectService.getProjectTasksWithAssignee(
      Number(projectId)
    );
    return ok(tasks);
  } catch (e) {
    console.log('Error fetching tasks', e);
    return serverError('Failed to fetch tasks');
  }
}

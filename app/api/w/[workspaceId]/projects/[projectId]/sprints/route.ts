import { requireWorkspaceMember } from '@/guards/workspace';
import { AppError } from '@/lib/errors';
import { serverError, ok } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string; projectId: string }>;
  }
) {
  try {
    const { workspaceId, projectId } = await params;

    await requireWorkspaceMember({
      workspaceId: Number(workspaceId),
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const sprints = await ProjectService.getProjectSprints(Number(projectId));
    return ok(sprints);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status }
      );
    }
    return serverError('Failed to fetch sprints', e);
  }
}

import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { AppError } from '@/lib/errors';
import { noContent, serverError } from '@/lib/http/http';
import { TaskService } from '@/lib/services/tasks';
import { Prisma, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    console.log('req', req);
    const body = await req.json();
    console.log('body', body, 'workspaceId', body.workspaceId);
    const workspaceId = validateId(body.workspaceId);
    const tasksIds: number[] = body.deleteTasksIds;
    const { user } = await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    await TaskService.deleteTasksBulk(tasksIds, workspaceId, user.id);

    return noContent();
  } catch (e) {
    if (e instanceof AppError)
      return NextResponse.json(e.message, { status: e.status });
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json(e.message, { status: 422, statusText: e.code });

    return serverError(`Failed to delete tasks: ${e}`);
  }
}

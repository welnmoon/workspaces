import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { AppError } from '@/lib/errors';
import { noContent, serverError } from '@/lib/http';
import { TaskService } from '@/lib/services/tasks';
import { Prisma, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    await requireUser();
    const workspaceId = validateId((await req.json()).workspaceId);
    const tasksIds: number[] = (await req.json()).deleteTasksIds;
    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    await TaskService.deleteTasksBulk(tasksIds, workspaceId);

    return noContent();
  } catch (e) {
    if (e instanceof AppError)
      return NextResponse.json(e.message, { status: e.status });
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json(e.message, { status: 422, statusText: e.code });

    return serverError('Failed to delete tasks', e);
  }
}

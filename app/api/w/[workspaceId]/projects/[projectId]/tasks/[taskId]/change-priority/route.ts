import { validateId } from '@/helpers/validate-id';
import { requireUser } from '@/helpers/require-user';
import { requireWorkspaceMember } from '@/guards/workspace';
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/services/tasks';
import { changeTaskPrioritySchema } from '@/schemas/tasks/change-task-priority-schema';
import { noContent, serverError, unprocessable } from '@/lib/http/http';
import { AppError } from '@/lib/errors';
import { ZodError } from 'zod';
import { Prisma, Role } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string; projectId: string; taskId: string }>;
  }
) {
  try {
    await requireUser();
    const { workspaceId, taskId } = await params;

    const workspaceIdNumber = validateId(workspaceId);
    await requireWorkspaceMember({
      workspaceId: workspaceIdNumber,
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const taskIdNumber = validateId(taskId);
    const res = changeTaskPrioritySchema.safeParse(await req.json());
    if (!res.success) return unprocessable('Invalid request body');
    const { priority } = res.data;
    await TaskService.changePriority(taskIdNumber, priority);

    return noContent();
  } catch (e) {
    if (e instanceof AppError) {
      if (e.status === 422) return unprocessable(e.message);
      return NextResponse.json(e.message, { status: e.status });
    }
    if (e instanceof ZodError) return unprocessable(e.message);

    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json(e.message, { status: 500 });

    console.error('CHANGE_PRIORITY_ERROR', e);
    return serverError();
  }
}

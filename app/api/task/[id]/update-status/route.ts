import { TASK_STATUSES } from '@/const/tasks-status';
import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import { badRequest, noContent, serverError } from '@/lib/http';
import { TaskService } from '@/lib/services/tasks';
import { TaskStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isFinite(taskId))
      throw new AppError(
        400,
        'INVALID_TASK_ID',
        'Неверный идентификатор задачи'
      );

    const { status } = (await req.json()) as { status: TaskStatus };

    if (!TASK_STATUSES.includes(status)) {
      return badRequest('Неверный статус задачи');
    }
    await TaskService.updateTaskStatus(taskId, status, user.id);

    return noContent();
  } catch (e) {
    if (e instanceof AppError)
      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status }
      );

    return serverError('Failed to update task status');
  }
}

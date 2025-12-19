import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { AppError } from '@/lib/errors';
import {
  badRequest,
  noContent,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { TaskService } from '@/lib/services/tasks';
import { Prisma, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const changeAssigneeSchema = z.object({
  assigneeId: z.string().nullable(),
});

export async function PATCH(
  req: NextRequest,
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
    const workspaceIdNumber = validateId((await params).workspaceId);
    const { user } = await requireWorkspaceMember({
      workspaceId: workspaceIdNumber,
      allowed: [Role.OWNER, Role.ADMIN],
    });
    const taskIdNumber = validateId((await params).taskId);
    const projectIdNumber = validateId((await params).projectId);
    const res = changeAssigneeSchema.safeParse(await req.json());
    if (!res.success)
      return unprocessable(res.error.message || 'Invalid request body');
    const { assigneeId } = res.data;

    await TaskService.changeAssignee(
      projectIdNumber,
      taskIdNumber,
      assigneeId,
      user.id
    );

    return noContent();
  } catch (e) {
    if (e instanceof AppError) {
      if (e.status === 422) return unprocessable(e.message);
      if (e.status === 400) return badRequest(e.message, e.code);
      return NextResponse.json(e.message, { status: e.status });
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(e.message, { status: 422, statusText: e.code });
    }

    return serverError();
  }
}

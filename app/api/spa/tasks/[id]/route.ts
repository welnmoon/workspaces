import { requireWorkspaceMember } from '@/guards/workspace';
import { parseTaskId } from '@/helpers/parse-id';
import { corsHeaders, withCors } from '@/helpers/with-cors';
import {
  badRequest,
  noContent,
  notFound,
  ok,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { TaskService } from '@/lib/services/tasks';
import { updateTaskSchema } from '@/schemas/tasks/update-task-form-schema';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const taskId = parseTaskId((await params).id);
    if (taskId === null) {
      return withCors(badRequest('Invalid task id'), _req.headers.get('origin'));
    }

    const task = await TaskService.getTaskWithRelations(taskId);
    if (!task) {
      return withCors(notFound('Task not found'), _req.headers.get('origin'));
    }

    await requireWorkspaceMember({
      workspaceId: task.project.workspaceId,
    });

    return withCors(ok(task), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to get task'),
      _req.headers.get('origin')
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const taskId = parseTaskId((await params).id);
    if (taskId === null) {
      return withCors(badRequest('Invalid task id'), req.headers.get('origin'));
    }

    const currentTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        projectId: true,
        sprintId: true,
        completedAt: true,
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!currentTask) {
      return withCors(notFound('Task not found'), req.headers.get('origin'));
    }

    await requireWorkspaceMember({
      workspaceId: currentTask.project.workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return withCors(badRequest('Invalid JSON'), req.headers.get('origin'));
    }

    const parsed = updateTaskSchema.safeParse(rawBody);
    if (!parsed.success) {
      return withCors(
        unprocessable(parsed.error.message, parsed.error.flatten()),
        req.headers.get('origin')
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return withCors(badRequest('No data provided'), req.headers.get('origin'));
    }

    const { dueDate, status, sprintId, assigneeId } = parsed.data;

    let normalizedDueDate: Date | null | undefined = undefined;
    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        normalizedDueDate = null;
      } else {
        const parsedDue = new Date(dueDate);
        if (Number.isNaN(parsedDue.getTime())) {
          return withCors(
            badRequest('Invalid due date'),
            req.headers.get('origin')
          );
        }
        normalizedDueDate = parsedDue;
      }
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(parsed.data.title !== undefined
          ? { title: parsed.data.title }
          : {}),
        ...(parsed.data.description !== undefined
          ? { description: parsed.data.description ?? null }
          : {}),
        ...(normalizedDueDate !== undefined
          ? { dueDate: normalizedDueDate }
          : {}),
        ...(parsed.data.priority ? { priority: parsed.data.priority } : {}),
        ...(status
          ? {
              status,
              completedAt:
                status === 'DONE'
                  ? (currentTask.completedAt ?? new Date())
                  : null,
            }
          : {}),
        ...(sprintId !== undefined ? { sprintId } : {}),
        ...(assigneeId !== undefined ? { assigneeId } : {}),
      },
    });

    return withCors(ok(updated), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to update task'),
      req.headers.get('origin')
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const taskId = parseTaskId((await params).id);
    if (taskId === null) {
      return withCors(badRequest('Invalid task id'), _req.headers.get('origin'));
    }

    const existing = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        projectId: true,
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!existing) {
      return withCors(notFound('Task not found'), _req.headers.get('origin'));
    }

    await requireWorkspaceMember({
      workspaceId: existing.project.workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    await prisma.task.delete({
      where: { id: taskId },
    });

    return withCors(noContent(), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to delete task'),
      _req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}

import { requireWorkspaceMember } from '@/guards/workspace';
import {
  badRequest,
  conflict,
  created,
  ok,
  serverError,
} from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { TaskService } from '@/lib/services/tasks';
import { createTaskFormSchema } from '@/schemas/tasks/create-task-form-schemas';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '@/lib/errors';

// POST /api/w/[workspaceId]/projects/[projectId]/tasks
// Create a new task in the project

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const { workspaceId, projectId } = await params;

    const { user } = await requireWorkspaceMember({
      workspaceId: Number(workspaceId),
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const { title, sprintId, assigneeId, description, priority, dueDate } =
      await req.json();
    const data = createTaskFormSchema.safeParse({
      title,
      assigneeId,
      sprintId,
      description,
      priority,
      dueDate,
    });
    if (!data.success)
      return badRequest('Invalid task data', data.error.format());

    const task = await TaskService.createTask({
      projectId: Number(projectId),
      title: data.data.title,
      description: data.data.description,
      dueDate: data.data.dueDate,
      assigneeId: data.data.assigneeId,
      priority: data.data.priority,
      sprintId: data.data.sprintId || null,
      actorId: user.id,
    });
    return created(task);
  } catch (e) {
    if (e instanceof AppError) {
      if (e.code === 'TASK_ALREADY_EXISTS') {
        console.log('Error creating task', e);
        return conflict(e.message, e.code);
      }
      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status }
      );
    }

    return serverError('Failed to create task', e);
  }
}

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

    const tasks = await ProjectService.getProjectTasks(Number(projectId));
    return ok(tasks);
  } catch (e) {
    console.log('Error fetching tasks', e);
    return serverError('Failed to fetch tasks');
  }
}

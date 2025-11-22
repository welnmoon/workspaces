import { requireWorkspaceMember } from '@/guards/workspace';
import { badRequest, created, ok, serverError } from '@/lib/http';
import { ProjectService } from '@/lib/services/project';
import { TaskService } from '@/lib/services/tasks';
import { createTaskFormSchema } from '@/schemas/tasks/create-task-form-schemas';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/w/[workspaceId]/projects/[projectId]/tasks
// Create a new task in the project
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const { workspaceId, projectId } = await params;

    await requireWorkspaceMember({
      workspaceId: Number(workspaceId),
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const { title, description, dueDate, assigneeId, priority } =
      await req.json();
    const data = createTaskFormSchema.safeParse({
      title,
      description,
      dueDate,
      assigneeId,
      priority,
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
    });
    return created(task);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create task', e },
      { status: 500 }
    );
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

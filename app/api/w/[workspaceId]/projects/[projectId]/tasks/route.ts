import { requireWorkspaceMember } from '@/guards/workspace';
import { ok, serverError } from '@/lib/http';
import prisma from '@/lib/prisma';
import { TaskService } from '@/lib/services/tasks';
import { createTaskFormSchema } from '@/schemas/tasks/create-task-form-schemas';
import { Role } from '@prisma/client';
import { Param } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/w/[workspaceId]/projects/[projectId]/tasks
// Create a new task in the project
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const { workspaceId, projectId } = await context.params;

    await requireWorkspaceMember({
      workspaceId: Number(workspaceId),
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const { title, description, dueDate } = await req.json();
    const data = createTaskFormSchema.safeParse({
      title,
      description,
      dueDate,
    });
    if (!data.success) return new Response(data.error.message, { status: 400 });

    const task = await prisma.task.create({
      data: {
        title: data.data.title,
        description: data.data.description,
        dueDate: data.data.dueDate ? new Date(data.data.dueDate) : undefined,
        projectId: Number(projectId),
      },
    });
    return NextResponse.json({ data: task }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: { workspaceId: string; projectId: string } }
) {
  try {
    const { workspaceId, projectId } = context.params;
    await requireWorkspaceMember({
      workspaceId: Number(workspaceId),
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const tasks = await TaskService.getProjectTasks({
      projectId: projectId,
      workspaceId: workspaceId,
    });
    return ok(tasks);
  } catch (e) {
    console.log('Error fetching tasks', e);
    return serverError('Failed to fetch tasks');
  }
}

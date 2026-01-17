import { requireUser } from '@/helpers/require-user';
import { withCors } from '@/helpers/with-cors';
import { ok, serverError } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { id } = await requireUser();
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          workspace: {
            memberships: {
              some: { userId: id },
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        projectId: true,
        sprintId: true,
        assigneeId: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            workspaceId: true,
          },
        },
        sprint: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return withCors(ok(tasks));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to get tasks'));
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://workspaces-nyvc.vercel.app',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    },
  });
}

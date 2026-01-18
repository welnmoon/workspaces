import { corsHeaders, withCors } from '@/helpers/with-cors';
import { requireUser } from '@/helpers/require-user';
import { ok, serverError } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
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

    return withCors(ok(tasks), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to get tasks'), req.headers.get('origin'));
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

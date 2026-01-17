import { requireUser } from '@/helpers/require-user';
import { withCors } from '@/helpers/with-cors';
import { ok, serverError } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { id } = await requireUser();
    const sprints = await prisma.sprint.findMany({
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
        name: true,
        goal: true,
        startDate: true,
        endDate: true,
        color: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            workspaceId: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return withCors(ok(sprints));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to get sprints'));
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

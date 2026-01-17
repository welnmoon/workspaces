import { requireUser } from '@/helpers/require-user';
import { withCors } from '@/helpers/with-cors';
import { ok, serverError } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { id } = await requireUser();
    const projects = await prisma.project.findMany({
      where: {
        workspace: {
          memberships: {
            some: { userId: id },
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true,
        endedAt: true,
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        sprints: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return withCors(ok(projects));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to get projects'));
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

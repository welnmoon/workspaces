import { corsHeaders, withCors } from '@/helpers/with-cors';
import { ok, serverError } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const sprints = await prisma.sprint.findMany({
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

    return withCors(ok(sprints), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to get sprints'),
      req.headers.get('origin')
    );
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

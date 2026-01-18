import { corsHeaders, withCors } from '@/helpers/with-cors';
import { ok, serverError } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const projects = await prisma.project.findMany({
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

    return withCors(ok(projects), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to get projects'), req.headers.get('origin'));
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

import { requirePlatformRole } from '@/guards/require-platform-role';
import { corsHeaders, withCors } from '@/helpers/with-cors';
import { proxyToNest } from '@/lib/bff/proxy-to-nest';
import { ok, serverError } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { PlatformRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    // const workspaces = await prisma.workspace.findMany({
    //   select: {
    //     id: true,
    //     name: true,
    //     description: true,
    //     avatarUrl: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     projects: {
    //       select: {
    //         id: true,
    //         name: true,
    //         tasks: {
    //           select: {
    //             title: true,
    //             status: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    const res = await proxyToNest(req, '/workspaces');
    if (!res.ok) return withCors(res, req.headers.get('origin'));
    const workspaces = await res.json();
    return withCors(ok(workspaces), req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(
      serverError('Failed to get workspaces'),
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

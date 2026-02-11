import { requirePlatformRole } from '@/guards/require-platform-role';
import { validateId } from '@/helpers/validate-id';
import { corsHeaders, withCors } from '@/helpers/with-cors';
import { proxyToNest } from '@/lib/bff/proxy-to-nest';
import {
  badRequest,
  noContent,
  ok,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { PlatformRole, Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const workspaceId = Number((await params).id);
    // if (Number.isNaN(workspaceId)) {
    //   return withCors(
    //     badRequest('Invalid workspace id'),
    //     req.headers.get('origin')
    //   );
    // }
    validateId(workspaceId);

    const res = await proxyToNest(req, `/workspaces/${workspaceId}`);
    if (!res.ok) return withCors(res, res.headers.get('origin'));
    const workspace = await res.json();

    return withCors(ok(workspace), req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(
      serverError('Failed to get workspace'),
      req.headers.get('origin')
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const workspaceId = Number((await params).id);
    if (Number.isNaN(workspaceId)) {
      return withCors(
        badRequest('Invalid workspace id'),
        req.headers.get('origin')
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return withCors(badRequest('Invalid JSON'), req.headers.get('origin'));
    }

    const parsed = createWorkspaceFormSchema.partial().safeParse(rawBody);
    if (!parsed.success) {
      return withCors(
        unprocessable(parsed.error.message, parsed.error.flatten()),
        req.headers.get('origin')
      );
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        description: true,
        avatarUrl: true,
      },
    });

    return withCors(ok(updatedWorkspace), req.headers.get('origin'));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return withCors(
        unprocessable('Рабочее пространство с таким названием уже существует'),
        req.headers.get('origin')
      );
    }

    console.error(error);
    return withCors(
      serverError('Не удалось обновить рабочее пространство'),
      req.headers.get('origin')
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const workspaceId = Number((await params).id);
    if (Number.isNaN(workspaceId)) {
      return withCors(
        badRequest('Invalid workspace id'),
        _req.headers.get('origin')
      );
    }

    await prisma.workspace.delete({
      where: { id: workspaceId },
    });
    return withCors(noContent(), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Не удалось удалить рабочее пространство'),
      _req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

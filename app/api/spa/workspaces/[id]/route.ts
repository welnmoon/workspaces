import { requireUser } from '@/helpers/require-user';
import { withCors } from '@/helpers/with-cors';
import { requireWorkspaceMember } from '@/guards/workspace';
import {
  badRequest,
  noContent,
  ok,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { WorkspaceService } from '@/lib/services/workspace';
import { Prisma, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const workspaceId = Number((await params).id);
    if (Number.isNaN(workspaceId)) {
      return badRequest('Invalid workspace id');
    }

    const { id: userId } = await requireUser();
    const workspace = await WorkspaceService.getByIdForUser(
      userId,
      workspaceId
    );

    const res = ok(workspace);

    return withCors(res);
  } catch (e) {
    console.error(e);
    return withCors(serverError('Failed to get workspace'));
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const workspaceId = Number((await params).id);
    if (Number.isNaN(workspaceId)) {
      return withCors(badRequest('Invalid workspace id'));
    }

    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER],
    });

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) return withCors(badRequest('Invalid JSON'));

    const parsed = createWorkspaceFormSchema.partial().safeParse(rawBody);
    if (!parsed.success) {
      return withCors(
        unprocessable(parsed.error.message, parsed.error.flatten())
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

    return withCors(ok(updatedWorkspace));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return withCors(
        unprocessable('Рабочее пространство с таким названием уже существует')
      );
    }

    console.error(error);
    return withCors(serverError('Не удалось обновить рабочее пространство'));
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const workspaceId = Number((await params).id);
    if (Number.isNaN(workspaceId)) {
      return withCors(badRequest('Invalid workspace id'));
    }

    await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER],
    });

    await WorkspaceService.delete(workspaceId);
    return withCors(noContent());
  } catch (error) {
    console.error(error);
    return withCors(serverError('Не удалось удалить рабочее пространство'));
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.VITE_URL!,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    },
  });
}

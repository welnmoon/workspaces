import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import {
  badRequest,
  noContent,
  ok,
  serverError,
  unprocessable,
} from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import {
  MembershipStatus,
  NotificationType,
  Prisma,
  Role,
} from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ workspaceId: string }> };

export async function PATCH(req: NextRequest, context: Params) {
  try {
    const { workspaceId } = await context.params;
    const workspaceIdNumber = Number(workspaceId);

    if (Number.isNaN(workspaceIdNumber)) {
      return badRequest('Некорректный идентификатор рабочего пространства');
    }

    await requireWorkspaceMember({
      workspaceId: workspaceIdNumber,
      allowed: [Role.OWNER],
    });

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) return badRequest('Некорректный JSON');

    const parsed = createWorkspaceFormSchema.safeParse(rawBody);
    if (!parsed.success) {
      return unprocessable(parsed.error.message, parsed.error.flatten());
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceIdNumber },
      data: parsed.data,
      select: { id: true, name: true, description: true },
    });

    return ok(updatedWorkspace);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return unprocessable(
        'Рабочее пространство с таким названием уже существует'
      );
    }

    console.error(error);
    return serverError('Не удалось обновить рабочее пространство');
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  await requireUser();
  const NumberWorkspaceId = Number((await context.params).workspaceId);
  await requireWorkspaceMember({
    workspaceId: NumberWorkspaceId,
    allowed: [Role.OWNER],
  });

  try {
    await prisma.$transaction(async (tx) => {
      const workspaceMembers = await tx.membership.findMany({
        where: {
          workspaceId: NumberWorkspaceId,
          status: MembershipStatus.ACTIVE,
        },
        select: {
          userId: true,
        },
      });

      const memberIds = workspaceMembers.map((m) => m.userId);

      if (memberIds.length > 0) {
        await tx.notification.createMany({
          data: memberIds.map((userId) => ({
            userId,
            type: NotificationType.WORKSPACE_DELETED,
            title: 'Рабочее пространство удалено',
            message: 'Рабочее пространство было удалено владельцем.',
            metadata: {
              workspaceId: NumberWorkspaceId,
            },
          })),
        });
      }

      await tx.workspace.delete({
        where: {
          id: NumberWorkspaceId,
        },
      });
    });
    return noContent();
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json(JSON.stringify({ error: e.message }), {
        status: e.status,
      });
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return NextResponse.json(JSON.stringify({ error: e.message }), {
          status: 400,
        });
      }
    }

    return serverError('Failed to delete workspace', e);
  }
}

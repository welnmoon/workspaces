import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import { noContent, serverError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import {
  MembershipStatus,
  NotificationType,
  Prisma,
  Role,
} from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  await requireUser();
  const NumberWorkspaceId = Number((await params).workspaceId);
  await requireWorkspaceMember({
    workspaceId: NumberWorkspaceId,
    allowed: [Role.OWNER],
  });

  try {
    await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.findUnique({
        where: { id: NumberWorkspaceId },
        select: { id: true, name: true },
      });

      if (!workspace) {
        throw new AppError(404, 'WORKSPACE_NOT_FOUND', 'Workspace not found');
      }

      const workspaceName = workspace.name || 'Без названия';

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
            message: `Рабочее пространство «${workspaceName}» (ID: ${workspace.id}) было удалено владельцем.`,
            metadata: {
              workspaceId: NumberWorkspaceId,
              workspaceName,
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

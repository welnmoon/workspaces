import { requireUser } from '@/helpers/require-user';
import { conflict, created, serverError, unprocessable } from '@/lib/http';
import { prisma, TxClient } from '@/lib/prisma';
import { clientRoutes } from '@/lib/routes/client-routes';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { WorkspaceService } from '@/lib/services/workspace';
import { MembershipStatus, Prisma, Role } from '@prisma/client';
import { NextRequest } from 'next/server';

// POST /api/w
// Create a new workspace
export async function POST(req: NextRequest) {
  try {
    const { id: userId } = await requireUser();
    const body = await req.json();
    const res = createWorkspaceFormSchema.safeParse(body);
    if (!res.success)
      return unprocessable(res.error.message, res.error.flatten());

    // в одной транзации создаем воркспейс и добавляем в него владельца
    const workspace = await prisma.$transaction(async (tx: TxClient) => {
      const w = await tx.workspace.create({
        data: {
          name: res.data.name,
          description: res.data.description,
          ownerId: userId,
          avatarUrl: res.data.avatarUrl || '/images/workspace-default.png',
        },
      });

      await tx.membership.create({
        data: {
          userId,
          workspaceId: w.id,
          role: Role.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

      return w;
    });

    return created(workspace, clientRoutes.workspacePage(workspace.id));
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      // P2002 - Нарушено ограничение уникальности в базе данных
      return conflict(e.message);
    }

    return serverError('Failed to create workspace');
  }
}

// GET workspaces /api/w

export async function GET() {
  try {
    const { id } = await requireUser();
    const workspaces = await WorkspaceService.getList(id);
    return created(workspaces);
  } catch (e) {
    console.error(e);
    return serverError('Failed to get workspaces');
  }
}

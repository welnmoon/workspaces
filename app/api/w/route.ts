import { requireUser } from '@/guards/require-user';
import { conflict, created, serverError, unprocessable } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { clientRoutes } from '@/lib/routes/client-routes';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { WorkspaceService } from '@/lib/services/workspace';
import { MembershipStatus, Prisma, Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id: userId } = await requireUser();
    const body = await req.json();
    const res = createWorkspaceFormSchema.safeParse(body);
    if (!res.success)
      return unprocessable(res.error.message, res.error.flatten());

    const workspace = await prisma.$transaction(async (tx) => {
      const client = tx as typeof prisma;

      const w = await client.workspace.create({
        data: {
          name: res.data.name,
          description: res.data.description,
          ownerId: userId,
          avatarUrl: res.data.avatarUrl || '/images/workspace-default.png',
        },
      });

      await client.membership.create({
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
      return conflict(e.message);
    }

    return serverError('Failed to create workspace');
  }
}

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

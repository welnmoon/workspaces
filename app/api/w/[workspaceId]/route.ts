import { requireWorkspaceMember } from '@/guards/workspace';
import { badRequest, ok, serverError, unprocessable } from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { Prisma, Role } from '@prisma/client';
import { NextRequest } from 'next/server';

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

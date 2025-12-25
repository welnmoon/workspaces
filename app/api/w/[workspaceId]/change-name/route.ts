import { requireWorkspaceMember } from '@/guards/workspace';
import { AppError } from '@/lib/errors';
import { noContent, serverError, unprocessable } from '@/lib/http/http';
import { WorkspaceService } from '@/lib/services/workspace';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const NumberWorkspaceId = Number((await params).workspaceId);
  try {
    await requireWorkspaceMember({
      workspaceId: NumberWorkspaceId,
      allowed: [Role.OWNER],
    });

    const res = createWorkspaceFormSchema.safeParse(await req.json());
    if (!res.success) {
      return unprocessable(res.error.message, res.error.flatten());
    }

    await WorkspaceService.updateName(NumberWorkspaceId, res.data.name);

    return noContent();
  } catch (e) {
    if (e instanceof AppError)
      return NextResponse.json(e.message, { status: e.status });
    return serverError('Failed to change workspace name', e);
  }
}

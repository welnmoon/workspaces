import { requireWorkspaceMember } from '@/guards/workspace';
import { badRequest, ok } from '@/lib/http';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  const { workspaceId } = params;
  const body = await req.json().catch(() => {});
  if (!body.name) return badRequest('Name is required');
  const workspaceIdNumber = Number(workspaceId);

  const user = await requireWorkspaceMember({
    workspaceId: workspaceIdNumber,
    allowed: ['OWNER', 'ADMIN'] as Role[],
  });

  const project = await prisma.project.create({
    data: {
      name: body.name,
      workspaceId: workspaceIdNumber,
    },
  });

  if (!project) return badRequest('Failed to create project');

  return ok(project, 201);
}

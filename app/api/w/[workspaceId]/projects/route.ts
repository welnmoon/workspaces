import { requireWorkspaceMember } from '@/guards/workspace';
import { createProject } from '@/lib/createProject';
import { badRequest, ok } from '@/lib/http';
import { createProjectFormSchema } from '@/schemas/projects/create-project-form-schemas';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  const { workspaceId } = params;
  const body: unknown = await req.json().catch(() => {});
  const res = createProjectFormSchema.safeParse(body);
  if (!res.success) return badRequest(res.error.message);

  const workspaceIdNumber = Number(workspaceId);

  const user = await requireWorkspaceMember({
    workspaceId: workspaceIdNumber,
    allowed: ['OWNER', 'ADMIN'] as Role[],
  });

  const project = await createProject({
    ...res.data,
    workspaceId: workspaceIdNumber,
  });

  if (!project) return badRequest('Failed to create project');

  return ok(project, 201);
}

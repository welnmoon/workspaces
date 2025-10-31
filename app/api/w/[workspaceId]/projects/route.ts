import { requireWorkspaceMember } from '@/guards/workspace';
import { badRequest, conflict, created, ok, serverError } from '@/lib/http';
import { clientRoutes } from '@/lib/routes/client-routes';
import { ProjectServices } from '@/lib/services/project';
import { createProjectFormSchema } from '@/schemas/projects/create-project-form-schemas';
import { Prisma, Role } from '@prisma/client';
import { NextRequest } from 'next/server';

// POST /api/w/[workspaceId]/projects
// Create a new project in the workspace
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await context.params;
  const body: unknown = await req.json().catch(() => {});
  const res = createProjectFormSchema.safeParse(body);
  if (!res.success) return badRequest(res.error.message);

  const workspaceIdNumber = Number(workspaceId);

  await requireWorkspaceMember({
    workspaceId: workspaceIdNumber,
    allowed: ['OWNER', 'ADMIN'] as Role[],
  });

  try {
    const project = await ProjectServices.createProject({
      ...res.data,
      workspaceId: workspaceIdNumber,
    });

    return created(
      project,
      clientRoutes.projectPage(workspaceIdNumber, project.id)
    );
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return conflict(
        'Project with this name already exists in this workspace'
      );
    }

    return serverError('Failed to create project');
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: { workspaceId: string } }
) {
  try {
    const workspaceIdNumber = Number(context.params.workspaceId);

    await requireWorkspaceMember({
      workspaceId: workspaceIdNumber,
      allowed: ['OWNER', 'ADMIN'] as Role[],
    });

    const projects = await ProjectServices.getList(workspaceIdNumber);
    return ok(projects);
  } catch (e) {
    console.error(e);
    return serverError('Failed to get projects');
  }
}

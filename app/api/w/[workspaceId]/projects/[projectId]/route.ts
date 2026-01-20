import { requireWorkspaceMember } from '@/guards/workspace';
import {
  badRequest,
  noContent,
  notFound,
  ok,
  serverError,
} from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { createProjectFormSchema } from '@/schemas/projects/create-project-form-schemas';
import { Prisma, Role } from '@prisma/client';
import { NextRequest } from 'next/server';

type Params = {
  params: Promise<{ workspaceId: string; projectId: string }>;
};

function parseIds(workspaceId: string, projectId: string) {
  const workspaceIdNumber = Number(workspaceId);
  const projectIdNumber = Number(projectId);

  if (!Number.isFinite(workspaceIdNumber) || !Number.isFinite(projectIdNumber))
    return null;

  return { workspaceIdNumber, projectIdNumber };
}

                                                
                     
export async function GET(_req: NextRequest, context: Params) {
  try {
    const { workspaceId, projectId } = await context.params;
    const ids = parseIds(workspaceId, projectId);
    if (!ids) return badRequest('Invalid identifiers');

    await requireWorkspaceMember({
      workspaceId: ids.workspaceIdNumber,
    });

    const project = await ProjectService.getProjectById(ids.projectIdNumber);
    if (!project || project.workspaceId !== ids.workspaceIdNumber) {
      return notFound('Project not found');
    }

    return ok(project);
  } catch (e) {
    return serverError('Failed to get project', e);
  }
}

                                                  
                         
export async function PATCH(req: NextRequest, context: Params) {
  try {
    const { workspaceId, projectId } = await context.params;
    const ids = parseIds(workspaceId, projectId);
    if (!ids) return badRequest('Invalid identifiers');

    const { user } = await requireWorkspaceMember({
      workspaceId: ids.workspaceIdNumber,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    const project = await ProjectService.getProjectById(ids.projectIdNumber);
    if (!project || project.workspaceId !== ids.workspaceIdNumber)
      return notFound('Project not found');

    const body = await req.json().catch(() => null);
    const parsed = createProjectFormSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const updated = await ProjectService.updateProject(
      ids.projectIdNumber,
      parsed.data,
      user.id
    );
    return ok(updated);
  } catch (e) {
    return serverError('Failed to update project', e);
  }
}

                                                   
                   
export async function DELETE(_req: NextRequest, context: Params) {
  try {
    const { workspaceId, projectId } = await context.params;
    const ids = parseIds(workspaceId, projectId);
    if (!ids) return badRequest('Invalid identifiers');

    const { user } = await requireWorkspaceMember({
      workspaceId: ids.workspaceIdNumber,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    const project = await ProjectService.getProjectById(ids.projectIdNumber);
    if (!project || project.workspaceId !== ids.workspaceIdNumber)
      return notFound('Project not found');

    await ProjectService.deleteProject(ids.projectIdNumber, user.id);
    return noContent();
  } catch (e) {
    if (e instanceof Error) return badRequest(e.message);
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return badRequest(e.message, e.code);
    return serverError('Failed to delete project', e);
  }
}

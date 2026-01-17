import { requireWorkspaceMember } from '@/guards/workspace';
import { parseProjectId } from '@/helpers/parse-id';
import { withCors } from '@/helpers/with-cors';
import {
  badRequest,
  noContent,
  notFound,
  ok,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { createProjectFormSchema } from '@/schemas/projects/create-project-form-schemas';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
      return withCors(badRequest('Invalid project id'));
    }

    const project = await ProjectService.getProjectByIdWithWorkspace(projectId);
    if (!project) {
      return withCors(notFound('Project not found'));
    }

    await requireWorkspaceMember({ workspaceId: project.workspaceId });
    return withCors(ok(project));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to get project'));
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
      return withCors(badRequest('Invalid project id'));
    }

    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return withCors(notFound('Project not found'));
    }

    const { user } = await requireWorkspaceMember({
      workspaceId: project.workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return withCors(badRequest('Invalid JSON'));
    }

    const parsed = createProjectFormSchema.partial().safeParse(rawBody);
    if (!parsed.success) {
      return withCors(
        unprocessable(parsed.error.message, parsed.error.flatten())
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return withCors(badRequest('No data provided'));
    }

    const payload = {
      name: parsed.data.name ?? project.name,
      description:
        parsed.data.description !== undefined
          ? parsed.data.description
          : (project.description ?? undefined),
    };

    const updated = await ProjectService.updateProject(
      projectId,
      payload,
      user.id
    );

    return withCors(ok(updated));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to update project'));
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
      return withCors(badRequest('Invalid project id'));
    }

    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return withCors(notFound('Project not found'));
    }

    const { user } = await requireWorkspaceMember({
      workspaceId: project.workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    await ProjectService.deleteProject(projectId, user.id);
    return withCors(noContent());
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to delete project'));
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.VITE_URL!,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      Vary: 'Origin',
    },
  });
}

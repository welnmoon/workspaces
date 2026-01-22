import { requirePlatformRole } from '@/guards/require-platform-role';
import { parseProjectId } from '@/helpers/parse-id';
import { corsHeaders, withCors } from '@/helpers/with-cors';
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
import { PlatformRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
      return withCors(
        badRequest('Invalid project id'),
        _req.headers.get('origin')
      );
    }

    const project = await ProjectService.getProjectByIdWithWorkspace(projectId);
    if (!project) {
      return withCors(
        notFound('Project not found'),
        _req.headers.get('origin')
      );
    }

    return withCors(ok(project), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to get project'),
      _req.headers.get('origin')
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
      return withCors(
        badRequest('Invalid project id'),
        req.headers.get('origin')
      );
    }

    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return withCors(notFound('Project not found'), req.headers.get('origin'));
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return withCors(badRequest('Invalid JSON'), req.headers.get('origin'));
    }

    const parsed = createProjectFormSchema.partial().safeParse(rawBody);
    if (!parsed.success) {
      return withCors(
        unprocessable(parsed.error.message, parsed.error.flatten()),
        req.headers.get('origin')
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return withCors(badRequest('No data provided'), req.headers.get('origin'));
    }

    const payload = {
      name: parsed.data.name ?? project.name,
      description:
        parsed.data.description !== undefined
          ? parsed.data.description
          : (project.description ?? undefined),
    };

    const updated = await ProjectService.updateProject(projectId, payload);

    return withCors(ok(updated), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to update project'),
      req.headers.get('origin')
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const projectId = parseProjectId((await params).id);
    if (projectId === null) {
      return withCors(
        badRequest('Invalid project id'),
        _req.headers.get('origin')
      );
    }

    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return withCors(
        notFound('Project not found'),
        _req.headers.get('origin')
      );
    }

    await ProjectService.deleteProject(projectId);
    return withCors(noContent(), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to delete project'),
      _req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}

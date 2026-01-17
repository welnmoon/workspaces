import { requireWorkspaceMember } from '@/guards/workspace';
import { parseSprintId } from '@/helpers/parse-id';
import { withCors } from '@/helpers/with-cors';
import {
  badRequest,
  noContent,
  notFound,
  ok,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { prisma } from '@/lib/prisma';
import { SprintService } from '@/lib/services/sprint';
import { updateSprintSchema } from '@/schemas/sprint/update-sprint-schema';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const sprintId = parseSprintId((await params).id);
    if (sprintId === null) {
      return withCors(badRequest('Invalid sprint id'));
    }

    const sprint = await SprintService.getSprintWithRelations(sprintId);
    if (!sprint) {
      return withCors(notFound('Sprint not found'));
    }

    await requireWorkspaceMember({
      workspaceId: sprint.project.workspaceId,
    });

    return withCors(ok(sprint));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to get sprint'));
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const sprintId = parseSprintId((await params).id);
    if (sprintId === null) {
      return withCors(badRequest('Invalid sprint id'));
    }

    const sprint = await SprintService.getSprintWithRelations(sprintId);
    if (!sprint) {
      return withCors(notFound('Sprint not found'));
    }

    const { user } = await requireWorkspaceMember({
      workspaceId: sprint.project.workspaceId,
      allowed: [Role.OWNER],
    });

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return withCors(badRequest('Invalid JSON'));
    }

    const parsed = updateSprintSchema.safeParse(rawBody);
    if (!parsed.success) {
      return withCors(
        unprocessable(parsed.error.message, parsed.error.flatten())
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return withCors(badRequest('No data provided'));
    }

    const { name, goal, startDate, endDate, color } = parsed.data;

    let normalizedGoal: string | null | undefined = undefined;
    if (goal !== undefined) {
      if (goal === null) {
        normalizedGoal = null;
      } else {
        normalizedGoal = goal.trim().length === 0 ? null : goal;
      }
    }

    let normalizedStart: Date | null | undefined = undefined;
    if (startDate !== undefined) {
      if (startDate === null || startDate === '') {
        normalizedStart = null;
      } else {
        const parsedStart = new Date(startDate);
        if (Number.isNaN(parsedStart.getTime())) {
          return withCors(badRequest('Invalid start date'));
        }
        normalizedStart = parsedStart;
      }
    }

    let normalizedEnd: Date | null | undefined = undefined;
    if (endDate !== undefined) {
      if (endDate === null || endDate === '') {
        normalizedEnd = null;
      } else {
        const parsedEnd = new Date(endDate);
        if (Number.isNaN(parsedEnd.getTime())) {
          return withCors(badRequest('Invalid end date'));
        }
        normalizedEnd = parsedEnd;
      }
    }

    const updated = await prisma.sprint.update({
      where: { id: sprintId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(goal !== undefined ? { goal: normalizedGoal ?? null } : {}),
        ...(startDate !== undefined
          ? { startDate: normalizedStart ?? null }
          : {}),
        ...(endDate !== undefined ? { endDate: normalizedEnd ?? null } : {}),
        ...(color !== undefined ? { color } : {}),
      },
    });

    return withCors(ok(updated));
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to update sprint'));
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const sprintId = parseSprintId((await params).id);
    if (sprintId === null) {
      return withCors(badRequest('Invalid sprint id'));
    }

    const sprint = await SprintService.getSprintWithRelations(sprintId);
    if (!sprint) {
      return withCors(notFound('Sprint not found'));
    }

    await requireWorkspaceMember({
      workspaceId: sprint.project.workspaceId,
      allowed: [Role.OWNER],
    });

    await prisma.sprint.delete({
      where: { id: sprintId },
    });

    return withCors(noContent());
  } catch (error) {
    console.error(error);
    return withCors(serverError('Failed to delete sprint'));
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://workspaces-nyvc.vercel.app',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      Vary: 'Origin',
    },
  });
}

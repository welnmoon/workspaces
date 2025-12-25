import { requireWorkspaceMember } from '@/guards/workspace';
import { AppError } from '@/lib/errors';
import {
  badRequest,
  created,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { SprintService } from '@/lib/services/sprint';
import { validateId } from '@/helpers/validate-id';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createSprintSchema } from '@/schemas/sprint/create-sprint-schema';

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      workspaceId: string;
      projectId: string;
    }>;
  }
) {
  try {
    const { workspaceId, projectId } = await params;
    const workspaceIdNumber = validateId(workspaceId);
    const projectIdNumber = validateId(projectId);

    await requireWorkspaceMember({
      workspaceId: workspaceIdNumber,
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const body = await req.json().catch(() => null);
    const parsed = createSprintSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Invalid sprint data', parsed.error.format());
    }

    const { name, goal, startDate, endDate } = parsed.data;

    const parseDate = (value?: string) => {
      if (!value) return null;
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (startDate && !start) return unprocessable('Некорректная дата начала');
    if (endDate && !end) return unprocessable('Некорректная дата окончания');

    const sprint = await SprintService.createSprint({
      projectId: projectIdNumber,
      name,
      goal,
      startDate: start,
      endDate: end,
    });

    return created(sprint);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status }
      );
    }

    return serverError('Failed to create sprint', e);
  }
}

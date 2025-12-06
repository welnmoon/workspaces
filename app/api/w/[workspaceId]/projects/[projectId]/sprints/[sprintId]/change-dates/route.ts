import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok, unprocessable } from '@/lib/http/http';
import { SprintService } from '@/lib/services/sprint';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const changeDatesSchema = z.object({
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      workspaceId: string;
      projectId: string;
      sprintId: string;
    }>;
  }
) {
  try {
    await requireUser();
    const { workspaceId, projectId, sprintId } = await params;
    const workspaceIdNum = validateId(workspaceId);
    const projectIdNum = validateId(projectId);
    const sprintIdNum = validateId(sprintId);

    await requireWorkspaceMember({
      workspaceId: workspaceIdNum,
      allowed: [Role.ADMIN, Role.OWNER],
    });

    const body = await req.json();
    const parsed = changeDatesSchema.safeParse(body);
    if (!parsed.success) {
      return unprocessable(parsed.error.message);
    }

    const { startDate, endDate } = parsed.data;

    const updated = await SprintService.changeSprintDates({
      sprintId: sprintIdNum,
      projectId: projectIdNum,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });

    return ok(updated);
  } catch (e) {
    return handleApiError(e);
  }
}

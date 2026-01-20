import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { ProjectService } from '@/lib/services/project';
import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const wId = validateId((await params).workspaceId);
    const pId = validateId((await params).projectId);
    await requireWorkspaceMember({
      workspaceId: wId,
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const searchParams = req.nextUrl.searchParams;
    const fromRaw = searchParams.get('from');
    const toRow = searchParams.get('to');
    const fromDecoded = fromRaw ? decodeURIComponent(fromRaw) : null;
    const toDecoded = toRow ? decodeURIComponent(toRow) : null;

    const defaultFrom = new Date(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();          
    const defaultTo = new Date().toISOString();

    const from =
      fromDecoded && !Number.isNaN(Date.parse(fromDecoded))
        ? new Date(fromDecoded)
        : new Date(defaultFrom);

    const to =
      toDecoded && !Number.isNaN(Date.parse(toDecoded))
        ? new Date(toDecoded)
        : new Date(defaultTo);

    const tasks = await ProjectService.getCompletedVsCreatedTasks(
      pId,
      from,
      to,
      null
    );
    return ok(tasks);
  } catch (e) {
    handleApiError(e);
  }
}

import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { notFound, ok, serverError } from '@/lib/http';
import { ProjectService } from '@/lib/services/project';
import { NextRequest } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// return project tasks stats
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    await requireUser();
    const projectId = (await context.params).projectId;
    const projectIdNumber = validateId(projectId);
    const stats = await ProjectService.getProjectTasksStats(projectIdNumber);
    return ok(stats);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return notFound();
      }
      return serverError('Failed to get project stats');
    }

    return serverError('Failed to get project stats');
  }
}

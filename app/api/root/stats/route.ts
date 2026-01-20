import { prisma } from '@/lib/prisma';
import { ok } from '@/lib/http/http';

export async function GET() {
  const [workspaces, projects, tasks, users] = await Promise.all([
    prisma.workspace.count(),
    prisma.project.count(),
    prisma.task.count(),
    prisma.user.count(),
  ]);

  return ok(
    { workspaces, projects, tasks, users },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    }
  );
}

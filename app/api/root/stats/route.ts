import { prisma } from '@/lib/prisma';
import { ok } from '@/lib/http/http';

export async function GET() {
  const [workspaces, projects, tasks] = await Promise.all([
    prisma.workspace.count(),
    prisma.project.count(),
    prisma.task.count(),
  ]);

  return ok({ workspaces, projects, tasks });
}

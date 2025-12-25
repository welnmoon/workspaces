import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

export async function ensureProjectActive(projectId: number) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, endedAt: true },
  });

  if (!project) {
    throw new AppError(404, 'PROJECT_NOT_FOUND', 'Проект не найден');
  }

  if (project.endedAt) {
    throw new AppError(
      403,
      'PROJECT_ENDED',
      'Проект закрыт. Изменения запрещены.'
    );
  }

  return project;
}

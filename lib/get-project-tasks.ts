import { requireUser } from '@/helpers/require-user';
import prisma from './prisma';
import { Task } from '@prisma/client';

export const getProjectTasks = async ({
  projectId,
}: {
  projectId: number;
}): Promise<Task[]> => {
  const { id } = await requireUser();
  const tasks: Task[] = await prisma.task.findMany({
    where: {
      projectId,
    },
  });

  return tasks;
};

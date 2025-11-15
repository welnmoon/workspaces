import { STATUS_COLUMNS } from '@/const/tasks-status';
import { TaskFullDTO } from '@/types/prisma/DTO/tasks';

export const tasksFilterByStatus = ({ tasks }: { tasks: TaskFullDTO[] }) => {
  const groups: Record<string, TaskFullDTO[]> = {};

  for (const column of STATUS_COLUMNS) {
    groups[column.id] = [];
  }

  for (const task of tasks) {
    const key = task.status;
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
  }

  return groups;
};

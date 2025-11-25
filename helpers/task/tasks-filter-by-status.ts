import { STATUS_COLUMNS } from '@/const/tasks-status';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';

export const tasksFilterByStatus = ({
  tasks,
}: {
  tasks: TaskWithAssigneeDTO[];
}) => {
  const groups: Record<string, TaskWithAssigneeDTO[]> = {};

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

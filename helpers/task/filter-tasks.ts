import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { endOfDay, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { TaskStatusDTO } from '@/const/tasks-status';

export const filterTasks = (
  tasks: TaskWithAssigneeDTO[],
  status: TaskStatusDTO | 'ALL',
  dateRange?: DateRange
) => {
  const hasDateFilter = Boolean(dateRange?.from || dateRange?.to);
  const from = dateRange?.from ? startOfDay(dateRange.from) : undefined;
  const to = dateRange?.to
    ? endOfDay(dateRange.to)
    : dateRange?.from
      ? endOfDay(dateRange.from)
      : undefined;

  return tasks.filter((t) => {
    const statusOk = status === 'ALL' ? true : t.status === status;

    if (!hasDateFilter) return statusOk;

    if (!t.dueDate) return false;

    const taskDate = new Date(t.dueDate);

    const fromOk = from ? taskDate >= from : true;
    const toOk = to ? taskDate <= to : true;

    return statusOk && fromOk && toOk;
  });
};

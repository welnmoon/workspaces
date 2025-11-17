'use client';

import { Heading } from '@/components/ui/heading';
import { TasksPageTaskCard } from './tasks-page-task-card';
import { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import FilterCalendar from '@/components/filters/filter-calendar';
import { DateRange } from 'react-day-picker';
import { useMemo, useState } from 'react';
import { filterTasks } from '@/helpers/task/filter-tasks';
import ProjectTasksFilterByStatusSelect from '@/components/filters/project-tasks-filter-by-status-select';
import { StatusFilter } from '../projects/project';
import { MessageInfo } from '@/components/message';
import EmptyState from '@/components/empty-state';

const TasksPageComponent = ({ tasks }: { tasks: TaskWithAssigneeDTO[] }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [status, setStatus] = useState<StatusFilter>('ALL');

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, status, dateRange);
  }, [tasks, status, dateRange]);

  const hasDateFilter = Boolean(dateRange?.from || dateRange?.to);
  const hasStatusFilter = status !== 'ALL';
  const hasAnyFilter = hasDateFilter || hasStatusFilter;

  return (
    <main className="flex gap-6">
      <section className="flex flex-col gap-2 w-2/3">
        <Heading className="mb-4">Все задачи проекта</Heading>

        {hasAnyFilter && filteredTasks.length > 0 && (
          <MessageInfo text={`Найдено ${filteredTasks.length} задач`} />
        )}

        {hasAnyFilter && filteredTasks.length === 0 && (
          <EmptyState
            title={
              hasStatusFilter && hasDateFilter
                ? `Нет задач со статусом ${status} в выбранном диапазоне`
                : hasStatusFilter
                  ? `Нет задач со статусом ${status}`
                  : `Нет задач в выбранном диапазоне`
            }
          />
        )}

        <div className="flex flex-col gap-2">
          {filteredTasks.map((t) => (
            <TasksPageTaskCard key={t.id} task={t} />
          ))}
        </div>
      </section>

      <section className="flex-1 flex flex-col">
        <Heading className="mb-6">Фильтрация</Heading>

        <div className="flex flex-col gap-2">
          <Heading level={3}>Дата создания и дедлайна</Heading>
          <FilterCalendar
            className="w-full mb-4"
            dateRange={dateRange}
            onSelectHandler={setDateRange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Heading level={3}>Статус задачи</Heading>
          <ProjectTasksFilterByStatusSelect
            status={status}
            setStatus={(s) => setStatus((s as StatusFilter) ?? 'ALL')}
            className=""
          />
        </div>
      </section>
    </main>
  );
};

export default TasksPageComponent;

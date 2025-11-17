'use client';
import { Heading } from '@/components/ui/heading';
import { TasksPageTaskCard } from './tasks-page-task-card';
import { TaskFullDTO, TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import FilterCalendar from '@/components/filters/filter-calendar';
import { DateRange } from 'react-day-picker';
import { useMemo, useState } from 'react';
import { filterTasks } from '@/helpers/task/filter-tasks';

const TasksPageComponent = ({ tasks }: { tasks: TaskWithAssigneeDTO[] }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, 'ALL', dateRange);
  }, [dateRange]);
  return (
    <main className="flex gap-2">
      <section className="flex flex-col gap-2 w-2/3">
        <Heading className="mb-4">Все задачи проекта</Heading>
        <div className="flex flex-col gap-2">
          {filteredTasks.map((t) => (
            <TasksPageTaskCard task={t} />
          ))}
        </div>
      </section>
      <section className="flex-1">
        <Heading>Фильтрация</Heading>
        <FilterCalendar dateRange={dateRange} onSelectHandler={setDateRange} />
      </section>
    </main>
  );
};

export default TasksPageComponent;

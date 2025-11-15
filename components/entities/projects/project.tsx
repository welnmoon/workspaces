'use client';

import { Project, Task, TaskStatus } from '@prisma/client';
import { Heading } from '../../ui/heading';
import Divider from '../../divider';
import Description from '../../ui/desc';
import TaskCard from '../tasks/task-card';
import CreateTaskDialog from '../../dialogs/create-task-dialog';
import { cardContainer } from '@/styles/styles';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Breadcrumbs } from '../../bread-crumbs';
import { TaskStats } from '@/types/service/task-stats';
import ProjectTasksFilterByStatusSelect from '../../filters/project-tasks-filter-by-status-select';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../ui/button';
import EmptyState from '../../empty-state';
import { MessageInfo } from '../../message';
import { DateRange } from 'react-day-picker';
import FilterCalendar from '../../filters/filter-calendar';
import { endOfDay, startOfDay } from 'date-fns';

import {
  FaListUl,
  FaRegClock,
  FaPlay,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { STATUS_COLUMNS } from '@/const/tasks-status';

type StatusFilter = TaskStatus | 'ALL';

const ProjectComponent = ({
  project,
  workspaceId,
  tasks,
  workspaceName,
  taskStats,
}: {
  project: Project;
  workspaceId: number;
  tasks: Task[];
  workspaceName: string | null;
  taskStats: TaskStats;
}) => {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [boardTasks, setBoardTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  if (!project) return null;

  const hasDateFilter = Boolean(dateRange?.from || dateRange?.to);
  const hasStatusFilter = status !== 'ALL';
  const hasAnyFilter = hasStatusFilter || hasDateFilter;

  const filteredTasks = useMemo(() => {
    const from = dateRange?.from ? startOfDay(dateRange.from) : undefined;
    const to = dateRange?.to
      ? endOfDay(dateRange.to)
      : dateRange?.from
        ? endOfDay(dateRange.from)
        : undefined;

    return boardTasks.filter((t) => {
      const statusOk = status === 'ALL' ? true : t.status === status;

      if (!hasDateFilter) return statusOk;

      if (!t.dueDate) return false;

      const taskDate = new Date(t.dueDate);

      const fromOk = from ? taskDate >= from : true;
      const toOk = to ? taskDate <= to : true;

      return statusOk && fromOk && toOk;
    });
  }, [boardTasks, status, dateRange, hasDateFilter]);

  const resetFilters = () => {
    setStatus('ALL');
    setDateRange(undefined);
  };

  // DRAG
  const onDragEnd = () => {};

  const tasksByStatus = useMemo(() => {
    const groups: Record<string, Task[]> = {};

    for (const column of STATUS_COLUMNS) {
      groups[column.id] = [];
    }

    for (const task of filteredTasks) {
      const key = task.status;
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    }

    return groups;

    // {
    //   "TODO": [Task, Task, ...],
    //   "IN_PROGRESS": [...],
    //   "DONE": [...],
    //   "BLOCKED": [...],
    // }
  }, [filteredTasks]);

  return (
    <article>
      <Heading level={3}>
        <Breadcrumbs
          items={[
            {
              label: `Workspaces`,
              href: clientRoutes.workspacesPage(),
            },
            {
              label: `${workspaceName}`,
              href: clientRoutes.workspacePage(workspaceId),
            },
            {
              label: `Projects`,
              href: clientRoutes.projectsPage(workspaceId),
            },
            {
              label: `${project.name}`,
              href: clientRoutes.projectPage(project.id, workspaceId),
            },
          ]}
        />
      </Heading>

      <Description text={project.description || 'No description'} />
      <Divider />

      <div className="flex justify-between">
        <Heading>Tasks</Heading>
        <CreateTaskDialog projectId={project.id} workspaceId={workspaceId} />
      </div>

      {taskStats && (
        <div className="flex flex-wrap gap-4 my-4 text-sm items-center">
          <span className="flex items-center gap-2">
            <FaListUl /> Всего: {taskStats.tasksCount}
          </span>

          <span className="flex items-center gap-2 text-blue-600">
            <FaRegClock /> TODO: {taskStats.tasksToDoCount}
          </span>

          <span className="flex items-center gap-2 text-yellow-600">
            <FaPlay /> В работе: {taskStats.tasksInProgressCount}
          </span>

          <span className="flex items-center gap-2 text-green-600">
            <FaCheckCircle /> Готово: {taskStats.tasksDoneCount}
          </span>

          <span className="flex items-center gap-2 text-red-600">
            <FaBan /> Заблокировано: {taskStats.tasksBlockedCount}
          </span>

          <span className="flex items-center gap-2 text-rose-600">
            <FaExclamationTriangle /> Просрочено: {taskStats.tasksOverdueCount}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={resetFilters} variant="outline" className="w-fit">
          Сброс
        </Button>

        <ProjectTasksFilterByStatusSelect
          className="flex-1"
          status={status}
          setStatus={(s) => setStatus((s as TaskStatus) ?? 'ALL')}
        />

        <FilterCalendar dateRange={dateRange} onSelectHandler={setDateRange} />
      </div>

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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 mt-4">
          {STATUS_COLUMNS.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <section
                  ref={provided.innerRef} // why?
                  className="w-full"
                  {...provided.droppableProps}
                >
                  <Heading level={3}>{column.title}</Heading>
                  <div className={''}>
                    {tasksByStatus[column.id]?.map((t, index) => (
                      <Draggable
                        key={t.id}
                        draggableId={String(t.id)}
                        index={index}
                      >
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.dragHandleProps}
                            {...dragProvided.draggableProps}
                          >
                            <TaskCard
                              role="listitem"
                              description={t.description || ''}
                              dueDate={
                                t.dueDate
                                  ? new Date(t.dueDate).toISOString()
                                  : ''
                              }
                              projectId={t.projectId}
                              workspaceId={Number(workspaceId)}
                              status={t.status}
                              title={t.title}
                              taskId={t.id}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>

                  {provided.placeholder}
                </section>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </article>
  );
};

export default ProjectComponent;

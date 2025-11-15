'use client';

import { Project, Task, TaskStatus } from '@prisma/client';
import { Heading } from '../../ui/heading';
import Divider from '../../divider';
import Description from '../../ui/desc';
import TaskCard from '../tasks/task-card';
import CreateTaskDialog from '../../dialogs/create-task-dialog';
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

import {
  FaListUl,
  FaRegClock,
  FaPlay,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { STATUS_COLUMNS } from '@/const/tasks-status';
import { createTasksBoardOnDragEnd } from '@/helpers/task/on-drag-end';
import { filterTasks } from '@/helpers/task/filter-tasks';
import { tasksFilterByStatus } from '@/helpers/task/tasks-filter-by-status';
import ProjectTasksStats from './project-tasks-stats';

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

  // Functions
  const onDragEnd = createTasksBoardOnDragEnd(setBoardTasks);

  const filteredTasks = useMemo(() => {
    return filterTasks(boardTasks, status, dateRange);
  }, [boardTasks, status, dateRange]);

  const resetFilters = () => {
    setStatus('ALL');
    setDateRange(undefined);
  };

  const tasksByStatus = useMemo(() => {
    return tasksFilterByStatus({ tasks: filteredTasks });
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

      {taskStats && <ProjectTasksStats taskStats={taskStats} />}

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
        <div className="flex gap-4 mt-4 overflow-x-auto">
          {STATUS_COLUMNS.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <section
                  ref={provided.innerRef}
                  className="min-w-[280px] max-w-xs flex-1"
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

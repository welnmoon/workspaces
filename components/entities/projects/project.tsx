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
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { STATUS_COLUMNS } from '@/const/tasks-status';
import { createTasksBoardOnDragEnd } from '@/helpers/task/on-drag-end';
import { filterTasks } from '@/helpers/task/filter-tasks';
import { tasksFilterByStatus } from '@/helpers/task/tasks-filter-by-status';
import ProjectTasksStats from './project-tasks-stats';
import { cn } from '@/lib/utils';
import { TaskFullDTO, TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { UserDTO } from '@/types/prisma/DTO/user';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';

type StatusFilter = TaskStatus | 'ALL';

const ProjectComponent = ({
  project,
  workspaceId,
  tasks,
  workspaceName,
  taskStats,
  members,
}: {
  project: Project;
  workspaceId: number;
  tasks: TaskWithAssigneeDTO[];
  workspaceName: string | null;
  taskStats: TaskStats;
  members: MembershipSelectUserDTO[];
}) => {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [boardTasks, setBoardTasks] = useState<TaskWithAssigneeDTO[]>(tasks);

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
      <Heading className="mb-2" level={3}>
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
        <CreateTaskDialog
          members={members}
          projectId={project.id}
          workspaceId={workspaceId}
        />
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
        <div className="flex mt-4 overflow-x-auto relative">
          {filteredTasks.length === 0 && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div className="rounded-lg bg-white/80 backdrop-blur-md shadow-lg p-6">
                <EmptyState
                  title="Пока нет задач."
                  subtitle="Создайте задачу, чтобы начать работу над проектом"
                />
              </div>
            </div>
          )}

          <div
            className={cn(
              'flex min-h-[400px] select-none',
              filteredTasks.length === 0 ? 'blur-xs' : 'overflow-x-auto'
            )}
          >
            {STATUS_COLUMNS.map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <section
                    ref={provided.innerRef}
                    className={cn(
                      'min-w-[280px] max-w-xs flex-1 px-2 py-2',
                      column.id === 'BLOCKED' && 'bg-red-50',
                      column.id === 'DONE' && 'bg-green-50',
                      column.id === 'IN_PROGRESS' && 'bg-yellow-50',
                      column.id === 'TODO' && 'bg-blue-50'
                    )}
                    {...provided.droppableProps}
                  >
                    <Heading
                      level={3}
                      className={cn(
                        'mb-2',
                        column.id === 'BLOCKED' && 'text-red-600',
                        column.id === 'DONE' && 'text-green-600',
                        column.id === 'IN_PROGRESS' && 'text-yellow-600',
                        column.id === 'TODO' && 'text-blue-600'
                      )}
                    >
                      {column.title}
                    </Heading>
                    <div className={''}>
                      {tasksByStatus[column.id]?.map((t, index) => (
                        <Draggable
                          key={t.id}
                          draggableId={String(t.id)}
                          index={index}
                        >
                          {(dragProvided) => (
                            <div
                              className="mb-2"
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
                                assignee={t.assignee}
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
        </div>
      </DragDropContext>
    </article>
  );
};

export default ProjectComponent;

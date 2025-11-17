'use client';

import { Project, TaskStatus } from '@prisma/client';
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
import ProjectTasksAllStats from './project-tasks-stats';
import { cn } from '@/lib/utils';
import { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import ProjectMemberTasksAllStats from './project-member-tasks-stats';
import DoneTasksFilter from './done-tasks-filter';

type StatusFilter = TaskStatus | 'ALL';
const counts = [10, 25, 50];

const ProjectComponent = ({
  project,
  workspaceId,
  tasks,
  workspaceName,
  allTaskStats,
  memberTaskStats,
  members,
}: {
  project: Project;
  workspaceId: number;
  tasks: TaskWithAssigneeDTO[];
  workspaceName: string | null;
  allTaskStats: TaskStats;
  memberTaskStats: TaskStats;
  members: MembershipSelectUserDTO[];
}) => {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [boardTasks, setBoardTasks] = useState<TaskWithAssigneeDTO[]>(tasks);
  // Done tasks filter
  const [doneTasksCount, setDoneTasksCount] = useState<string>(
    String(counts[0])
  );

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
        <Heading>Задачи</Heading>
        <CreateTaskDialog
          members={members}
          projectId={project.id}
          workspaceId={workspaceId}
        />
      </div>

      {allTaskStats && <ProjectTasksAllStats allTaskStats={allTaskStats} />}
      {memberTaskStats && (
        <ProjectMemberTasksAllStats memberTaskStats={memberTaskStats} />
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
        <div className="flex mt-4 overflow-x-auto relative">
          {filteredTasks.length === 0 && (
            <div>
              <EmptyState
                icon={
                  <img
                    src="/images/tasks-page-banner.png"
                    alt="Иллюстрация проекта"
                    className="mt-6 w-1/2 mx-auto h-auto object-contain"
                  />
                }
                title="Ну что, начинаем?"
                subtitle="Добавьте первую задачу — и ваш проект засияет."
              />
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div className={cn('flex min-h-dvh select-none w-full')}>
              {STATUS_COLUMNS.map((column) => (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => {
                    const columnTasks = tasksByStatus[column.id] ?? [];

                    const visibleTasks =
                      column.id === 'DONE'
                        ? columnTasks.slice(0, Number(doneTasksCount))
                        : columnTasks;
                    return (
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
                            'mb-2 flex justify-between items-center',
                            column.id === 'BLOCKED' && 'text-red-600',
                            column.id === 'DONE' && 'text-green-600',
                            column.id === 'IN_PROGRESS' && 'text-yellow-600',
                            column.id === 'TODO' && 'text-blue-600'
                          )}
                        >
                          {column.title}{' '}
                          {column.id === 'DONE' && (
                            <DoneTasksFilter
                              setDoneTasksCount={setDoneTasksCount}
                              doneTasksCount={doneTasksCount}
                              counts={counts}
                            />
                          )}
                        </Heading>
                        <div>
                          {visibleTasks.map((t, index) => (
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
                    );
                  }}
                </Droppable>
              ))}
            </div>
          )}
        </div>
      </DragDropContext>
    </article>
  );
};

export default ProjectComponent;

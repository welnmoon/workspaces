import EmptyState from '../../empty-state';
import { STATUS_COLUMNS, TaskStatusDTO } from '@/const/tasks-status';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { Heading } from '../../ui/heading';
import TaskCard from '../tasks/task-card';
import DoneTasksFilter from './done-tasks-filter';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';
import { cn } from '@/lib/utils';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import type { Dispatch, SetStateAction } from 'react';

type TasksByStatus = Partial<Record<TaskStatusDTO, TaskWithAssigneeDTO[]>>;

type ProjectTasksBoardProps = {
  filteredTasks: TaskWithAssigneeDTO[];
  tasksByStatus: TasksByStatus;
  droppableDirection: 'horizontal' | 'vertical';
  onDragEnd: (result: DropResult) => void;
  workspaceId: number;
  projectId: number;
  doneTasksCount: string;
  setDoneTasksCount: Dispatch<SetStateAction<string>>;
  counts: number[];
  remainTasksCount: number;
};

const ProjectTasksBoard = ({
  filteredTasks,
  tasksByStatus,
  droppableDirection,
  onDragEnd,
  workspaceId,
  projectId,
  doneTasksCount,
  setDoneTasksCount,
  counts,
  remainTasksCount,
}: ProjectTasksBoardProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mt-4 relative w-full">
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl border border-zinc-100 p-6">
            <EmptyState
              iconIsImage={true}
              // icon={
              //   <img
              //     src="/images/tasks-page-banner.png"
              //     alt="Иллюстрация проекта"
              //     className="mt-6 w-1/2 mx-auto h-auto object-contain"
              //   />
              // }
              imageSrc="/images/tasks-page-banner.png"
              imageAlt="Иллюстрация проекта"
              imageClassName="mt-6 w-1/2 mx-auto h-auto object-contain"
              title="Ну что, начинаем?"
              subtitle="Добавьте первую задачу — и ваш проект засияет."
            />
          </div>
        )}

        {filteredTasks.length > 0 && (
          <div className="relative w-full overflow-x-auto">
            <div className="flex min-h-dvh select-none gap-4">
              {STATUS_COLUMNS.map((column) => {
                const columnTasks = tasksByStatus[column.id] ?? [];

                const visibleTasks =
                  column.id === 'DONE'
                    ? columnTasks.slice(0, Number(doneTasksCount))
                    : columnTasks;

                return (
                  <section
                    key={column.id}
                    className={cn(
                      'min-h-[280px] w-[320px] flex-shrink-0 px-2 py-2',
                      column.id === 'BLOCKED' && 'bg-red-50',
                      column.id === 'DONE' && 'bg-green-50',
                      column.id === 'IN_PROGRESS' && 'bg-yellow-50',
                      column.id === 'TODO' && 'bg-blue-50'
                    )}
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

                    <Droppable
                      droppableId={column.id}
                      direction={droppableDirection}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex flex-col gap-2 min-h-[120px]"
                        >
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
                                    priority={t.priority}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {column.id === 'DONE' && (
                            <div className="flex flex-col gap-2 text-center">
                              <span className="text-zinc-600 italic text-xs">
                                {remainTasksCount > 0
                                  ? `Еще ${remainTasksCount} законченных задач`
                                  : `Больше нет законченных задач`}
                              </span>
                              <Button variant="link">
                                <Link
                                  className="text-primary-500"
                                  href={clientRoutes.tasksPage(
                                    workspaceId,
                                    projectId
                                  )}
                                >
                                  Все задачи →
                                </Link>
                              </Button>
                            </div>
                          )}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default ProjectTasksBoard;

'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_COLUMNS, TaskStatusDTO } from '@/const/tasks-status';
import getTaskStatusColor from '@/helpers/get-status-color';
import type {
  TaskPriorityDTO,
  TaskWithAssigneeDTO,
} from '@/types/prisma/DTO/tasks';
import { cn } from '@/lib/utils';
import { CreateTaskRowForm } from '@/components/forms/task/create-task-row-form';
import { useCreateTask } from '@/hooks/tasks/use-create-task';
import { usePathname } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import TaskActions from './task-actions';
import { useMembers } from '@/hooks/members/use-members';
import { useChangeTaskAssignee } from '@/hooks/tasks/use-change-assignee';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMoveTask } from '@/hooks/tasks/use-move-task';
import { useSprints } from '@/hooks/sprint/use-sprints';
import TaskSelectPriority from '../../tasks/task-select-priority';
import { useChangePriority } from '@/hooks/tasks/use-change-priority';
import { useChangeStatus } from '@/hooks/tasks/use-change-status';
import { useDeleteTask } from '@/hooks/tasks/use-delete-task';

type BacklogAccordionProps = {
  tasks: TaskWithAssigneeDTO[];
  selectedIds?: Set<number>;
  setSelectedIds?: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending?: boolean;
  isTasksLoading?: boolean;
};

const BacklogAccordion = ({
  tasks,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
  isTasksLoading: _isTasksLoading = false,
}: BacklogAccordionProps) => {
  const isMobile = useIsMobile();
  const [hoverId, setHoverId] = useState<number>();
  const pathname = usePathname();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const withSelection = useMemo(
    () => selectedIds !== undefined && setSelectedIds !== undefined,
    [selectedIds, setSelectedIds]
  );
  // Task
  const { mutate: onCreateTask, isPending: isCreateTaskPending } =
    useCreateTask(workspaceId!, projectId!);

  const { data: sprints } = useSprints(workspaceId!, projectId!);

  const sprintsMap = useMemo(() => {
    return new Map(sprints && sprints.map((s) => [s.id, s.name]));
  }, [sprints]);

  const { mutate: onChangeAssignee } = useChangeTaskAssignee(
    workspaceId!,
    projectId!
  );

  const { mutate: onMoveTask } = useMoveTask(workspaceId!, projectId!);

  const onMoveTaskHandle = (sprintId: number | null, taskId: number) => {
    onMoveTask(
      {
        taskId,
        sprintId: sprintId || null,
      },
      {
        onSuccess: () => {
          toast.success('Задача успешно перемещена');
        },
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );
  };

  //--------TASK-----Priority-----------------------------------------//

  const { mutate: onChangePriority } = useChangePriority(
    workspaceId!,
    projectId!
  );

  const { mutate: onChangeStatus } = useChangeStatus(
    workspaceId!,
    projectId!
  );

  const { mutate: onDeleteTask } = useDeleteTask(workspaceId!, projectId!);

  const onChangePriorityHandler = (
    taskId: number,
    priority: TaskPriorityDTO
  ) => {
    onChangePriority(
      { taskId, priority, sprintId: null },
      {
        onError: (e) => {
          toast.error(
            e.message ?? 'Произошла ошибка при обновлении приоритета'
          );
        },
      }
    );
  };

  const onDeleteTaskHandler = (taskId: number) => {
    onDeleteTask(
      { taskId, sprintId: null },
      {
        onSuccess: () => toast.success('Задача удалена'),
        onError: (e) => toast.error(e.message ?? 'Не удалось удалить задачу'),
      }
    );
  };
  const onChangeStatusHandler = (taskId: number, status: TaskStatusDTO) => {
    onChangeStatus(
      { taskId, status, sprintId: null },
      {
        onError: (e) => {
          toast.error(e.message ?? 'Произошла ошибка при обновлении статуса');
        },
      }
    );
  };

  // Members
  const { data: members } = useMembers(workspaceId!, projectId!);

  // handlers

  const onChangeAssigneeHandler = (
    taskId: number,
    assigneeId: string | null,
    assignee?: MembershipSelectUserDTO['user']
  ) => {
    onChangeAssignee({ taskId, assigneeId, assignee }, { onSuccess: () => {} });
  };

  const handleCreateTask = (payload: { title: string; description?: string }) =>
    onCreateTask(payload, {
      onSuccess: () => {
        toast.success('Задача успешно создана');
      },
      onError: () => {
        toast.error('Не удалось создать задачу');
      },
    });
  const toggle = (id: number) => {
    if (!withSelection || !setSelectedIds) return;
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const isSelected = (id: number) =>
    selectedIds ? selectedIds.has(id) : false;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={`backlog`}
    >
      <AccordionItem value={`backlog`}>
        <AccordionTrigger asChild className="bg-zinc-100 rounded-t-md px-4">
          <div className="flex gap-4 items-center ">
            <span className="font-semibold text-xl min-w-30 max-w-40">
              Backlog
            </span>
            <span className="text-xs text-muted-foreground">
              {tasks.length} задач
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-3 text-sm">
          {tasks.length === 0 ? (
            <div className="text-muted-foreground text-sm border bg-white px-4 py-2">
              В бэклоге пока нет задач
            </div>
          ) : (
            <div className="md:overflow-visible overflow-x-auto border bg-white shadow-sm">
              <Table className="table-fixed min-w-[720px]">
                <TableHeader className="bg-zinc-50">
                  <TableRow className="text-left text-xs font-semibold text-muted-foreground">
                    {withSelection && <TableHead className="px-4 py-3 w-10" />}
                    <TableHead className="px-4 py-3 w-full">Название</TableHead>
                    <TableHead className="px-4 py-3 w-40">Статус</TableHead>
                    <TableHead className="px-4 py-3 w-40">Приоритет</TableHead>
                    <TableHead className="px-4 py-3 w-50">
                      Исполнитель
                    </TableHead>
                    <TableHead className="px-4 py-3 w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                  {tasks.map((t) => {
                    const statusTitle =
                      STATUS_COLUMNS.find((s) => s.id === t.status)?.title ??
                      t.status;
                    // const due =
                    //   t.dueDate && new Date(t.dueDate).toLocaleDateString();
                    const assigneeName = t.assignee
                      ? `${t.assignee.firstName || ''} ${t.assignee.lastName || ''}`.trim() ||
                        t.assignee.email
                      : 'Не назначен';

                    return (
                      <TableRow
                        onMouseEnter={() => setHoverId(t.id)}
                        key={t.id}
                        className={cn(
                          'transition hover:bg-zinc-50',
                          isSelected(t.id) && 'bg-neutral-50'
                        )}
                      >
                        {withSelection && (
                          <TableCell className="">
                            {isSelected(t.id) ? (
                              <FaRegCheckSquare
                                size={18}
                                className={cn(
                                  isDeleteTasksPending &&
                                    'text-muted-foreground'
                                )}
                                onClick={() => toggle(t.id)}
                              />
                            ) : (
                              <FaRegSquare
                                size={18}
                                className={cn(
                                  isDeleteTasksPending &&
                                    'text-muted-foreground'
                                )}
                                onClick={() => toggle(t.id)}
                              />
                            )}
                          </TableCell>
                        )}
                        <TableCell className="px-4 py-3 font-medium text-foreground">
                          {t.title}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">
                          <Badge
                            className={cn(
                              getTaskStatusColor({
                                taskStatus: t.status as TaskStatusDTO,
                              }),
                              'font-medium'
                            )}
                          >
                            {statusTitle}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">
                          {/* {priorityLabel} */}

                          <TaskSelectPriority
                            taskId={t.id}
                            priority={t.priority}
                            onChangePriority={onChangePriorityHandler}
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">
                          {assigneeName}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">
                          {hoverId === t.id && !isMobile && (
                            <TaskActions
                              disabled={isCreateTaskPending}
                              onMove={onMoveTaskHandle}
                              sprintsMap={sprintsMap}
                              onChangeStatus={onChangeStatusHandler}
                              onChangeAssignee={onChangeAssigneeHandler}
                              onDelete={onDeleteTaskHandler}
                              members={members}
                              taskId={t.id}
                            />
                          )}
                          {isMobile && (
                            <TaskActions
                              sprintsMap={sprintsMap}
                              disabled={isCreateTaskPending}
                              onMove={onMoveTaskHandle}
                              onChangeStatus={onChangeStatusHandler}
                              onChangeAssignee={onChangeAssigneeHandler}
                              onDelete={onDeleteTaskHandler}
                              members={members}
                              taskId={t.id}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <CreateTaskRowForm
                onCreate={handleCreateTask}
                isLoading={isCreateTaskPending}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BacklogAccordion;

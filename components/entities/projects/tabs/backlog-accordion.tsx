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
import { TASK_PRIORITY_LABELS } from '@/const/priority';
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
import { useSprints } from '@/hooks/tasks/sprint/use-sprints';
import SelectPriority from '@/components/forms/task/select-priority';
import TaskSelectPriority from '../../tasks/task-select-priority';
import { useChangePriority } from '@/hooks/tasks/use-change-priority';

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
  isTasksLoading = false,
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

  const { mutate: onChangeAssignee, isPending: onChangeAssigneePending } =
    useChangeTaskAssignee(workspaceId!, projectId!);

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

  const { mutate: onChangePriority, isPending: onChangePriorityPending } =
    useChangePriority(workspaceId!, projectId!);

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
      copy.has(id) ? copy.delete(id) : copy.add(id);
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
        <AccordionTrigger className="flex justify-between items-center bg-zinc-100 rounded-t-md px-4">
          <span className="font-semibold text-xl w-30">Backlog</span>
          <span className="text-xs text-muted-foreground">
            {tasks.length} задач
          </span>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-3 text-sm">
          {tasks.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              В бэклоге пока нет задач
            </div>
          ) : (
            <div className="md:overflow-visible overflow-x-auto rounded-2xl border bg-white shadow-sm">
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
                    const priorityLabel = TASK_PRIORITY_LABELS[t.priority];
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
                              'text-white font-medium'
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
                              onChangeStatus={() => {}}
                              onChangePriority={() => {}}
                              onChangeAssignee={onChangeAssigneeHandler}
                              onDelete={() => {}}
                              members={members}
                              taskId={t.id}
                            />
                          )}
                          {isMobile && (
                            <TaskActions
                              sprintsMap={sprintsMap}
                              disabled={isCreateTaskPending}
                              onMove={onMoveTaskHandle}
                              onChangeStatus={() => {}}
                              onChangePriority={() => {}}
                              onChangeAssignee={onChangeAssigneeHandler}
                              onDelete={() => {}}
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

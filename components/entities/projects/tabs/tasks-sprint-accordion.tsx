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
import type { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import { useCreateTask } from '@/hooks/tasks/use-create-task';
import { useChangeTaskAssignee } from '@/hooks/tasks/use-change-assignee';
import { useMembers } from '@/hooks/members/use-members';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import toast from 'react-hot-toast';
import TaskActions from './task-actions';
import { CreateTaskRowForm } from '@/components/forms/task/create-task-row-form';
import { CreateTaskFormValues } from '@/schemas/tasks/create-task-form-schemas';
import { useSprintTasks } from '@/hooks/tasks/sprint/use-sprints-tasks';
import { useQueryClient } from '@tanstack/react-query';
import { clientRoutes } from '@/lib/routes/client-routes';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSprints } from '@/hooks/tasks/sprint/use-sprints';
import { useMoveTask } from '@/hooks/tasks/use-move-task';
import TaskSelectPriority from '../../tasks/task-select-priority';
import { useChangePriority } from '@/hooks/tasks/use-change-priority';
import { TaskPriorityDTO } from '@/types/prisma/DTO/tasks';
import { Button } from '@/components/ui/button';
import { BookOpen, Timer } from 'lucide-react';
import { ChevronDown, GoalIcon } from 'lucide-react';
import { formatDateRange } from '@/helpers/format-date';
import { useSprintTasksStats } from '@/hooks/tasks/sprint/use-sprint-tasks-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { FaBarsProgress } from 'react-icons/fa6';

const TasksSprintAccordion = ({
  sprint,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
}: {
  sprint: SprintWithTasksWithAssigneesDTO;
  selectedIds?: Set<number>;
  setSelectedIds?: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending?: boolean;
}) => {
  const [hoverId, setHoverId] = useState<number>();
  const isMobile = useIsMobile();

  const pathname = usePathname();
  const router = useRouter();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const withSelection = useMemo(
    () => selectedIds !== undefined && setSelectedIds !== undefined,
    [selectedIds, setSelectedIds]
  );

  const qc = useQueryClient();
  const sprintQueryKey = ['sprintTasks', sprint.id, projectId, workspaceId];

  const { mutate: onCreateTask, isPending: isCreateTaskPending } =
    useCreateTask(workspaceId!, projectId!);

  const { data: members } = useMembers(workspaceId!, projectId!);

  const { data: sprintTasks = [] } = useSprintTasks(
    workspaceId!,
    projectId!,
    sprint.id,
    sprint.tasks
  );
  const { mutate: onChangeAssignee, isPending: onChangeAssigneePending } =
    useChangeTaskAssignee(workspaceId!, projectId!, sprintQueryKey);

  // -------SPRINTS-----------------------------------------//

  const { data: sprints } = useSprints(workspaceId!, projectId!);
  // for sprint select in task actions
  const sprintsMap = useMemo(() => {
    return new Map(sprints && sprints.map((s) => [s.id, s.name]));
  }, [sprints]);

  // stats
  const { data: sprintTasksStats, isLoading: isSprintTasksStatsLoading } =
    useSprintTasksStats(workspaceId!, projectId!, sprint.id);

  // --------TASK-----MOVE-----------------------------------------//

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
      { taskId, priority, sprintId: sprint.id },
      {
        onError: (e) => {
          toast.error(
            e.message ?? 'Произошла ошибка при обновлении приоритета'
          );
        },
      }
    );
  };

  // --------------------Conditions-------------------------------------
  if (!workspaceId || !projectId) {
    router.push(clientRoutes.workspacesPage());
    return;
  }

  // -------------------Handlers-------------------------------------

  const onChangeAssigneeHandler = (
    taskId: number,
    assigneeId: string | null,
    assignee?: MembershipSelectUserDTO['user']
  ) => {
    onChangeAssignee({ taskId, assigneeId, assignee }, { onSuccess: () => {} });
  };

  const handleCreateTask = (payload: CreateTaskFormValues) =>
    onCreateTask(
      { ...payload, sprintId: sprint.id },
      {
        onSuccess: () => {
          toast.success('Задача успешно создана');
          qc.invalidateQueries({ queryKey: sprintQueryKey });
        },
        onError: () => {
          toast.error('Не удалось создать задачу');
        },
      }
    );

  // ---------------------for checkboxes--------------------------
  const isSelected = (id: number) =>
    selectedIds ? selectedIds.has(id) : false;

  const toggle = (id: number) => {
    if (!withSelection || !setSelectedIds) return;
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={`Бэклог`}
    >
      <AccordionItem value={`backlog`}>
        <AccordionTrigger
          asChild
          className="flex items-center justify-between bg-zinc-50 rounded-t-md px-4"
        >
          <div>
            <div className="flex gap-4 items-center">
              <div className="flex gap-4 items-center min-w-60">
                <span className="font-semibold text-xl min-w-30 ">
                  {sprint.name}
                </span>
                <div className='flex gap-2'>
                  <span className="text-xs text-muted-foreground">
                    {sprintTasks.length} задач
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateRange(sprint.startDate, sprint.endDate)}
                  </span>
                </div>
              </div>

              {!isSprintTasksStatsLoading && (
                <div className="flex gap-2 items-center w-30">
                  <Badge variant="outline" className="gap-1">
                    <BookOpen size={14} />
                    {sprintTasksStats?.tasksCount}
                  </Badge>
                  <Badge variant="success" className="gap-1">
                    <GoalIcon size={14} />
                    {sprintTasksStats?.tasksDoneCount}
                  </Badge>
                  <Badge variant="default" className="gap-1 bg-primary-100">
                    <Timer size={14} />
                    {sprintTasksStats?.tasksInProgressCount}
                  </Badge>
                </div>
              )}
              {isSprintTasksStatsLoading && (
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="gap-1">
                    <Skeleton className="h-4 w-4" />
                  </Badge>
                  <Badge variant="success" className="gap-1">
                    <Skeleton className="h-4 w-4" />
                  </Badge>
                  <Badge variant="default" className="gap-1">
                    <Skeleton className="h-4 w-4" />
                  </Badge>
                </div>
              )}
            </div>

            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-3 text-sm">
          {sprintTasks.length === 0 ? (
            <CreateTaskRowForm
              onCreate={handleCreateTask}
              isLoading={isCreateTaskPending}
            />
          ) : (
            <div className="md:overflow-visible overflow-x-auto rounded-2xl border bg-white shadow-sm">
              <Table className="table-fixed min-w-[720px]">
                <TableHeader className="bg-zinc-50">
                  <TableRow className="text-left text-xs font-semibold text-muted-foreground">
                    {withSelection && <TableHead className="w-10 px-4 py-3" />}
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
                  {sprintTasks.map((t) => {
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
                          <TableCell className="w-10">
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
                          <TaskSelectPriority
                            taskId={t.id}
                            priority={t.priority}
                            onChangePriority={onChangePriorityHandler}
                          />
                        </TableCell>
                        <TableCell className="px-4 w-1/5 py-3 text-muted-foreground">
                          {assigneeName}
                        </TableCell>
                        <TableCell className="px-4 py-3 w-1/9 text-muted-foreground">
                          {hoverId === t.id && !isMobile && (
                            <TaskActions
                              disabled={isCreateTaskPending}
                              sprintsMap={sprintsMap}
                              onMove={onMoveTaskHandle}
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
                              disabled={isCreateTaskPending}
                              sprintsMap={sprintsMap}
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

export default TasksSprintAccordion;

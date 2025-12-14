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
  SprintColorDTO,
  SprintWithTasksWithAssigneesDTO,
} from '@/types/prisma/DTO/sprint';
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
import { useSprintTasks } from '@/hooks/sprint/use-sprints-tasks';
import { useQueryClient } from '@tanstack/react-query';
import { clientRoutes } from '@/lib/routes/client-routes';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSprints } from '@/hooks/sprint/use-sprints';
import { useMoveTask } from '@/hooks/tasks/use-move-task';
import TaskSelectPriority from '../../tasks/task-select-priority';
import { useChangePriority } from '@/hooks/tasks/use-change-priority';
import { TaskPriorityDTO } from '@/types/prisma/DTO/tasks';
import { BookOpen, Timer } from 'lucide-react';
import { useChangeStatus } from '@/hooks/tasks/use-change-status';
import { useDeleteTask } from '@/hooks/tasks/use-delete-task';
import { ChevronDown, GoalIcon } from 'lucide-react';
import { formatDateTimeRange } from '@/helpers/time/format-date';
import { useSprintTasksStats } from '@/hooks/sprint/use-sprint-tasks-stats';
import { Skeleton } from '@/components/ui/skeleton';
import SprintDateRangePopover from '../sprints/sprint-date-range-popover';
import { useChangeSprintDates } from '@/hooks/sprint/use-change-sprint-dates';
import { useChangeSprintColor } from '@/hooks/sprint/use-change-sprint-color';
import { SprintColors } from '@/const/colors/sprint-colors';
import { SprintColorDropdown } from '../sprints/sprint-color-dropdown';
import TasksFilterPopover from '@/components/filters/tasks-filter-popover';
import type { DateRange } from 'react-day-picker';
import { filterTasks } from '@/helpers/task/filter-tasks';
import { Button } from '@/components/ui/button';

const TasksSprintAccordion = ({
  sprint,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
  openSprintIds,
  setOpenSprintIds,
}: {
  sprint: SprintWithTasksWithAssigneesDTO;
  selectedIds?: Set<number>;
  setSelectedIds?: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending?: boolean;
  openSprintIds: string[];
  setOpenSprintIds: Dispatch<SetStateAction<string[]>>;
}) => {
  const [hoverId, setHoverId] = useState<number>();
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<TaskStatusDTO | 'ALL'>(
    'ALL'
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

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
  const filteredSprintTasks = filterTasks(sprintTasks, statusFilter, dateRange);
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

  // change sprint dates
  const {
    mutate: changeSprintDates,
    isPending: isChangeSprintDatesPending,
    isSuccess: isChangeSprintDatesSuccess,
    isError: isChangeSprintDatesError,
  } = useChangeSprintDates(workspaceId!, projectId!, sprint.id);
  const closePopover = isChangeSprintDatesSuccess || isChangeSprintDatesError;

  // Sprint color
  const { mutate: changeSprintColor, isPending: isChangeSprintColorPending } =
    useChangeSprintColor(workspaceId!, projectId!, sprint.id);

  const changeSprintColorHandler = (color: SprintColorDTO) => {
    changeSprintColor(color, {
      onSuccess: () => {},
      onError: (e) => {
        toast.error(e.message);
      },
    });
  };

  const hasSprintFilters =
    statusFilter !== 'ALL' || Boolean(dateRange?.from || dateRange?.to);
  const resetSprintFilters = () => {
    setStatusFilter('ALL');
    setDateRange(undefined);
  };

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

  const { mutate: onChangeStatus, isPending: onChangeStatusPending } =
    useChangeStatus(workspaceId!, projectId!);

  const { mutate: onDeleteTask } = useDeleteTask(workspaceId!, projectId!);

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

  const onChangeStatusHandler = (taskId: number, status: TaskStatusDTO) => {
    onChangeStatus(
      { taskId, status, sprintId: sprint.id },
      {
        onError: (e) => {
          toast.error(e.message ?? 'Произошла ошибка при обновлении статуса');
        },
      }
    );
  };

  const onDeleteTaskHandler = (taskId: number) => {
    onDeleteTask(
      { taskId, sprintId: sprint.id },
      {
        onSuccess: () => toast.success('Задача удалена'),
        onError: (e) => toast.error(e.message ?? 'Не удалось удалить задачу'),
      }
    );
  };

  // --------------------Conditions-------------------------------------
  if (!workspaceId || !projectId) {
    router.push(clientRoutes.workspacesPage());
    return;
  }

  // -------------------Handlers-------------------------------------
  const handleChangeDates = (payload: { startDate: string; endDate: string }) =>
    changeSprintDates(payload, {
      onSuccess: () => {
        toast.success('Даты успешно изменены');
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });

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

  const isOpen = openSprintIds.includes(String(sprint.id));

  const handleAccordionChange = (val: string | undefined) => {
    setOpenSprintIds((prev) => {
      const idStr = String(sprint.id);
      if (val) {
        if (prev.includes(idStr)) return prev;
        return [...prev, idStr];
      }
      return prev.filter((id) => id !== idStr);
    });
  };

  return (
    <Accordion
      type="single"
      collapsible
      className={cn('w-full')}
      value={isOpen ? 'backlog' : ''}
      onValueChange={handleAccordionChange}
    >
      <AccordionItem value={`backlog`}>
        <AccordionTrigger
          asChild
          className={cn(
            'flex items-center justify-between bg-zinc-50 rounded-t-md px-4'
          )}
          style={{
            backgroundColor: SprintColors[sprint.color],
          }}
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4 items-center">
              <div className="flex gap-4 items-center min-w-60">
                <span className="font-semibold text-xl min-w-30 ">
                  {sprint.name}
                </span>

                <span className="text-xs text-muted-foreground hover:no-underline">
                  {formatDateTimeRange(
                    sprint.startDate,
                    sprint.endDate,
                    'ru-RU',
                    undefined,
                    'UTC'
                  )}
                </span>
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

        <AccordionContent className="flex flex-col gap-3 text-sm bg-white px-4">
          <div className="flex items-center justify-between mt-4 rounded-md border border-zinc-200 px-2 py-1">
            <span className="text-sm font-semibold">Данные спринта</span>
            <div className="flex flex-wrap items-center gap-2">
              <TasksFilterPopover
                status={statusFilter}
                setStatus={(s) =>
                  setStatusFilter((s as TaskStatusDTO) ?? 'ALL')
                }
                dateRange={dateRange}
                setDateRange={setDateRange}
                resetFilters={resetSprintFilters}
                hasAnyFilter={hasSprintFilters}
                statusFilter={true}
              />
              {hasSprintFilters && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-xs"
                  onClick={resetSprintFilters}
                >
                  Сбросить
                </Button>
              )}
              <SprintColorDropdown
                value={sprint.color as SprintColorDTO}
                onChange={changeSprintColorHandler}
                disabled={isChangeSprintColorPending}
              />
              <SprintDateRangePopover
                initialStartDate={sprint.startDate}
                initialEndDate={sprint.endDate}
                handleChangeDates={handleChangeDates}
                isPending={isChangeSprintDatesPending}
                closePopover={closePopover}
              />
            </div>
          </div>

          {sprintTasks.length > 0 && (
            <div className="md:overflow-visible overflow-x-auto rounded-2xl border bg-white">
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
                  {filteredSprintTasks.map((t) => {
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
                              onChangeStatus={onChangeStatusHandler}
                              onChangePriority={() => {}}
                              onChangeAssignee={onChangeAssigneeHandler}
                              onDelete={onDeleteTaskHandler}
                              members={members}
                              taskId={t.id}
                              // startDate={sprint.startDate}
                              // endDate={sprint.endDate}
                            />
                          )}
                          {isMobile && (
                            <TaskActions
                              disabled={isCreateTaskPending}
                              sprintsMap={sprintsMap}
                              onMove={onMoveTaskHandle}
                              onChangeStatus={onChangeStatusHandler}
                              onChangePriority={() => {}}
                              onChangeAssignee={onChangeAssigneeHandler}
                              onDelete={onDeleteTaskHandler}
                              members={members}
                              taskId={t.id}
                              // startDate={sprint.startDate}
                              // endDate={sprint.endDate}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          <CreateTaskRowForm
            onCreate={handleCreateTask}
            isLoading={isCreateTaskPending}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TasksSprintAccordion;

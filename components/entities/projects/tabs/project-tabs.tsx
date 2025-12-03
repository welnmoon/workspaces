'use client';

import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectTabsList from './project-tasks-list';
import ProjectTasksBoard from '../project-tasks-board';
import type { TaskStatusDTO } from '@/const/tasks-status';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { createTasksBoardOnDragEnd } from '@/helpers/task/on-drag-end';
import { filterTasks } from '@/helpers/task/filter-tasks';
import { tasksFilterByStatus } from '@/helpers/task/tasks-filter-by-status';
import useMediaQuery from '@/hooks/use-media-query';
import { useTasksWithAssignee } from '@/hooks/tasks/use-tasks-with-assignee';
import { useQueryClient } from '@tanstack/react-query';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import TasksFilterPopover from '@/components/filters/tasks-filter-popover';
import { Kanban, List, Trash } from 'lucide-react';
import type { TaskStats } from '@/types/service/task-stats';
import ProjectTasksStats from '../project-tasks-stats';
import { IoStatsChart } from 'react-icons/io5';
import { useTaskStatusChange } from '@/hooks/tasks/use-task-status-change';
import { useDeleteTasksBulk } from '@/hooks/tasks/use-delete-tasks-bulk';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import BacklogAccordion from './backlog-accordion';

type StatusFilter = TaskStatusDTO | 'ALL';

type ProjectTabsProps = {
  sprints: SprintWithTasksWithAssigneesDTO[];
  tasks: TaskWithAssigneeDTO[];
  workspaceId: number;
  projectId: number;
  allTaskStats: TaskStats;
  memberTaskStats: TaskStats;
};

const doneCounts = [10, 25, 50];

const ProjectTabs = ({
  sprints,
  tasks,
  workspaceId,
  projectId,
  allTaskStats,
  memberTaskStats,
}: ProjectTabsProps) => {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const queryClient = useQueryClient();
  const queryKey = ['tasks', projectId, workspaceId];

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const droppableDirection = isDesktop ? 'vertical' : 'horizontal';

  //----------------------Tasks--------------------------//
  const [allTasks, setAllTasks] = useState<TaskWithAssigneeDTO[]>(tasks);
  const [boardTasks, setBoardTasks] = useState<TaskWithAssigneeDTO[]>([]);
  const [doneTasksCount, setDoneTasksCount] = useState<string>(
    String(doneCounts[0])
  );

  //----------------------Delete Tasks--------------------------//
  const [selectedIds, setSelectedIds] = useState(new Set<number>());

  const { mutate: deleteTasks, isPending: isDeleteTasksPending } =
    useDeleteTasksBulk(workspaceId, projectId, setAllTasks, queryKey);

  const handleDeleteTasks = () => {
    deleteTasks(selectedIds, {
      onSuccess: () => {
        toast.success('Задачи успешно удалены');
        setSelectedIds(new Set());
      },
      onError: (e) => {
        toast.error(e.message ?? 'Произошла ошибка при удалении задач');
      },
    });
  };

  const syncCache = (updatedTasks: TaskWithAssigneeDTO[]) => {
    setAllTasks(updatedTasks);
    queryClient.setQueryData(queryKey, updatedTasks);
  };

  const { changeStatus, isPending } = useTaskStatusChange({
    setBoardTasks: setAllTasks,
    queryKey,
  });

  const { data: optimisticTasks, isLoading: isTasksLoading } =
    useTasksWithAssignee(projectId, workspaceId, tasks);

  //----------------------Filter Tasks--------------------------//
  useEffect(() => {
    if (optimisticTasks && Array.isArray(optimisticTasks)) {
      setAllTasks(optimisticTasks);
    }
  }, [optimisticTasks]);

  const sprintTasks = useMemo(() => {
    return allTasks.filter((t) => t.sprintId !== null);
  }, [allTasks]);

  const backlogTasks = useMemo(() => {
    return allTasks.filter((t) => t.sprintId === null);
  }, [allTasks]);

  const filteredBacklogTasks = useMemo(() => {
    return filterTasks(backlogTasks, status, dateRange);
  }, [backlogTasks, status, dateRange]);

  const listTasks = useMemo(() => {
    return filterTasks(allTasks, status, dateRange);
  }, [allTasks, status, dateRange]);

  //----------------------Tasks Board - Kanban--------------------------//
  useEffect(() => {
    setBoardTasks(sprintTasks);
  }, [sprintTasks]);

  const tasksByStatus = useMemo(() => {
    return tasksFilterByStatus({ tasks: boardTasks });
  }, [boardTasks]);
  // обновляем кэш с помощью sync
  const onDragEnd = createTasksBoardOnDragEnd(setBoardTasks, syncCache);

  const remainTasksCount = useMemo(() => {
    const totalDone = allTaskStats?.tasksDoneCount ?? 0;
    const shown = Number(doneTasksCount);
    const remain = totalDone - shown;
    return remain > 0 ? remain : 0;
  }, [allTaskStats, doneTasksCount]);

  const hasDateFilter = Boolean(dateRange?.from || dateRange?.to);
  const hasStatusFilter = status !== 'ALL';
  const hasAnyFilter = hasStatusFilter || hasDateFilter;

  const resetFilters = () => {
    setStatus('ALL');
    setDateRange(undefined);
  };

  const [activeTab, setActiveTab] = useState<
    'list' | 'kanban' | 'stats' | 'backlog'
  >('list');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) =>
        setActiveTab(v as 'list' | 'kanban' | 'stats' | 'backlog')
      }
      className="w-full space-y-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <TabsList className="inline-flex flex-wrap gap-1">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Список</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            <span>Канбан</span>
          </TabsTrigger>
          <TabsTrigger value="backlog" className="flex items-center gap-2">
            <IoStatsChart className="h-4 w-4" />
            <span>Бэклог</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <IoStatsChart className="h-4 w-4" />
            <span>Статистика</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'list' && (
            <>
              <TasksFilterPopover
                status={status}
                setStatus={(s) => setStatus((s as StatusFilter) ?? 'ALL')}
                dateRange={dateRange}
                setDateRange={setDateRange}
                resetFilters={resetFilters}
                hasAnyFilter={hasAnyFilter}
                statusFilter={true}
              />
              <Button
                onClick={resetFilters}
                variant="outline"
                className="h-9 px-3 text-xs"
                disabled={!hasAnyFilter}
              >
                Сбросить
              </Button>
            </>
          )}
          {activeTab === 'kanban' && (
            <>
              <TasksFilterPopover
                status={status}
                setStatus={(s) => setStatus((s as StatusFilter) ?? 'ALL')}
                dateRange={dateRange}
                setDateRange={setDateRange}
                resetFilters={resetFilters}
                hasAnyFilter={hasAnyFilter}
                statusFilter={false}
              />
              <Button
                onClick={resetFilters}
                variant="outline"
                className="h-9 px-3 text-xs"
              >
                Сбросить
              </Button>
            </>
          )}
          {activeTab === 'stats' && null}
          {selectedIds.size > 0 && (
            <div className="relative">
              <Button
                disabled={isDeleteTasksPending}
                className={cn(
                  'text-red-500 bg-white hover:bg-red-50 w-30 text-left',
                  isDeleteTasksPending && 'text-zinc-500 cursor-none'
                )}
                onClick={() => handleDeleteTasks()}
              >
                <Trash size={20} />

                {isDeleteTasksPending ? (
                  <Spinner className="animate-spin " />
                ) : (
                  'Удалить'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <TabsContent value="list" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Всего задач: <span className="font-medium">{listTasks.length}</span>
            {hasAnyFilter && (
              <span className="ml-2 text-xs text-blue-500">
                (Фильтр применён)
              </span>
            )}
          </div>
        </div>

        <ProjectTabsList
          sprints={sprints}
          backlogTasks={backlogTasks}
          listTasks={listTasks}
          hasAnyFilter={hasAnyFilter}
          hasStatusFilter={hasStatusFilter}
          hasDateFilter={hasDateFilter}
          status={status}
          onStatusChange={changeStatus}
          isStatusPending={isPending}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isDeleteTasksPending}
        />
      </TabsContent>

      <TabsContent value="kanban" className="mt-2">
        <ProjectTasksBoard
          filteredTasks={boardTasks}
          tasksByStatus={tasksByStatus}
          droppableDirection={droppableDirection}
          onDragEnd={onDragEnd}
          workspaceId={workspaceId}
          projectId={projectId}
          doneTasksCount={doneTasksCount}
          setDoneTasksCount={setDoneTasksCount}
          counts={doneCounts}
          remainTasksCount={remainTasksCount}
        />
      </TabsContent>
      <TabsContent value="stats" className="mt-2">
        <ProjectTasksStats
          allTaskStats={allTaskStats}
          memberTaskStats={memberTaskStats}
        />
      </TabsContent>

      <TabsContent value="backlog" className="mt-2">
        {/* <ProjectTabsBacklog
          backlogTasks={backlogTasks}
          hasAnyFilter={hasAnyFilter}
          hasStatusFilter={hasStatusFilter}
          hasDateFilter={hasDateFilter}
          status={status}
          onStatusChange={changeStatus}
          isStatusPending={isPending}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isDeleteTasksPending}
        /> */}
        <BacklogAccordion
          tasks={backlogTasks}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isTasksLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;

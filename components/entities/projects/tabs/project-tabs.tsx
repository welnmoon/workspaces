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
import { Kanban, List } from 'lucide-react';
import type { TaskStats } from '@/types/service/task-stats';
import ProjectTasksStats from '../project-tasks-stats';
import { IoStatsChart } from 'react-icons/io5';
import { useTaskStatusChange } from '@/hooks/tasks/use-task-status-change';

type StatusFilter = TaskStatusDTO | 'ALL';

type ProjectTabsProps = {
  tasks: TaskWithAssigneeDTO[];
  workspaceId: number;
  projectId: number;
  allTaskStats: TaskStats;
  memberTaskStats: TaskStats;
};

const doneCounts = [10, 25, 50];

const ProjectTabs = ({
  tasks,
  workspaceId,
  projectId,
  allTaskStats,
  memberTaskStats,
}: ProjectTabsProps) => {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [boardTasks, setBoardTasks] = useState<TaskWithAssigneeDTO[]>(tasks);
  const [doneTasksCount, setDoneTasksCount] = useState<string>(
    String(doneCounts[0])
  );

  const queryClient = useQueryClient();
  const queryKey = ['tasks', projectId, workspaceId];
  const syncCache = (updatedTasks: TaskWithAssigneeDTO[]) =>
    queryClient.setQueryData(queryKey, updatedTasks);
  const { changeStatus, isPending } = useTaskStatusChange({
    setBoardTasks,
    syncCache: (tasks) =>
      queryClient.setQueryData(['tasks', projectId, workspaceId], tasks),
  });

  // в onDragEnd или где-то ещё:

  const { data: optimisticTasks } = useTasksWithAssignee(
    projectId,
    workspaceId,
    tasks
  );
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const droppableDirection = isDesktop ? 'vertical' : 'horizontal';

  useEffect(() => {
    setBoardTasks(optimisticTasks || []);
  }, [optimisticTasks]);

  const listTasks = useMemo(() => {
    return filterTasks(boardTasks, status, dateRange);
  }, [boardTasks, status, dateRange]);

  const tasksByStatus = useMemo(() => {
    return tasksFilterByStatus({ tasks: boardTasks });
  }, [boardTasks]);

  const remainTasksCount = useMemo(() => {
    const totalDone = allTaskStats?.tasksDoneCount ?? 0;
    const shown = Number(doneTasksCount);
    const remain = totalDone - shown;
    return remain > 0 ? remain : 0;
  }, [allTaskStats, doneTasksCount]);

  const hasDateFilter = Boolean(dateRange?.from || dateRange?.to);
  const hasStatusFilter = status !== 'ALL';
  const hasAnyFilter = hasStatusFilter || hasDateFilter;

  const onDragEnd = createTasksBoardOnDragEnd(setBoardTasks, syncCache);

  const resetFilters = () => {
    setStatus('ALL');
    setDateRange(undefined);
  };

  const [activeTab, setActiveTab] = useState<'list' | 'kanban' | 'stats'>(
    'list'
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as 'list' | 'kanban' | 'stats')}
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
          listTasks={listTasks}
          hasAnyFilter={hasAnyFilter}
          hasStatusFilter={hasStatusFilter}
          hasDateFilter={hasDateFilter}
          status={status}
          onStatusChange={changeStatus}
          isStatusPending={isPending}
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
    </Tabs>
  );
};

export default ProjectTabs;

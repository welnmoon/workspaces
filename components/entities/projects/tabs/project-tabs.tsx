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

type StatusFilter = TaskStatusDTO | 'ALL';

type ProjectTabsProps = {
  tasks: TaskWithAssigneeDTO[];
  workspaceId: number;
  projectId: number;
  allTaskStats: TaskStats;
};

const doneCounts = [10, 25, 50];

const ProjectTabs = ({
  tasks,
  workspaceId,
  projectId,
  allTaskStats,
}: ProjectTabsProps) => {
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [boardTasks, setBoardTasks] = useState<TaskWithAssigneeDTO[]>(tasks);
  const [doneTasksCount, setDoneTasksCount] = useState<string>(
    String(doneCounts[0])
  );

  const queryClient = useQueryClient();
  const queryKey = ['tasks', projectId, workspaceId];
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

  const onDragEnd = createTasksBoardOnDragEnd(setBoardTasks, (updatedTasks) =>
    queryClient.setQueryData(queryKey, updatedTasks)
  );

  const resetFilters = () => {
    setStatus('ALL');
    setDateRange(undefined);
  };

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="list" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span>Список</span>
        </TabsTrigger>
        <TabsTrigger value="kanban" className="flex items-center gap-2">
          <Kanban className="h-4 w-4" />
          <span>Канбан</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <TasksFilterPopover
              status={status}
              setStatus={(s) => setStatus((s as StatusFilter) ?? 'ALL')}
              dateRange={dateRange}
              setDateRange={setDateRange}
              resetFilters={resetFilters}
              hasAnyFilter={hasAnyFilter}
            />
            <Button
              onClick={resetFilters}
              variant="outline"
              className="h-9 px-3 text-xs"
            >
              Сбросить
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Всего задач:{' '}
            <span className="font-medium">{listTasks.length}</span>
          </div>
        </div>

        <ProjectTabsList
          listTasks={listTasks}
          hasAnyFilter={hasAnyFilter}
          hasStatusFilter={hasStatusFilter}
          hasDateFilter={hasDateFilter}
          status={status}
        />
      </TabsContent>

      <TabsContent value="kanban" className="mt-4">
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
    </Tabs>
  );
};

export default ProjectTabs;

'use client';

import type { Project } from '@prisma/client';
import { Heading } from '../../ui/heading';
import Divider from '../../divider';
import Description from '../../ui/desc';
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
import { TaskStatusDTO } from '@/const/tasks-status';
import { createTasksBoardOnDragEnd } from '@/helpers/task/on-drag-end';
import { filterTasks } from '@/helpers/task/filter-tasks';
import { tasksFilterByStatus } from '@/helpers/task/tasks-filter-by-status';
import ProjectTasksAllStats from './project-tasks-stats';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import type { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import ProjectMemberTasksAllStats from './project-member-tasks-stats';
import useMediaQuery from '@/hooks/use-media-query';
import { useTasksWithAssignee } from '@/hooks/tasks/use-tasks-with-assignee';
import ProjectTasksBoard from './project-tasks-board';
import { useQueryClient } from '@tanstack/react-query';

export type StatusFilter = TaskStatusDTO | 'ALL';
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
  const qc = useQueryClient();
  const queryKey = ['tasks', project.id, workspaceId];
  const { data: optimisticTasks } = useTasksWithAssignee(
    project.id,
    workspaceId,
    tasks
  );
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const droppableDirection = isDesktop ? 'vertical' : 'horizontal';

  useEffect(() => {
    setBoardTasks(optimisticTasks || []);
  }, [optimisticTasks]);

  const filteredTasks = useMemo(() => {
    return filterTasks(boardTasks, status, dateRange);
  }, [boardTasks, status, dateRange]);

  const tasksByStatus = useMemo(() => {
    return tasksFilterByStatus({ tasks: filteredTasks });
    // {
    //   "TODO": [Task, Task, ...],
    //   "IN_PROGRESS": [...],
    //   "DONE": [...],
    //   "BLOCKED": [...],
    // }
  }, [filteredTasks]);

  const remainTasksCount = useMemo(() => {
    const totalDone = allTaskStats?.tasksDoneCount ?? 0;
    const shown = Number(doneTasksCount);
    const remain = totalDone - shown;
    return remain > 0 ? remain : 0;
  }, [allTaskStats, doneTasksCount]);

  if (!project) return null;

  const hasDateFilter = Boolean(dateRange?.from || dateRange?.to);
  const hasStatusFilter = status !== 'ALL';
  const hasAnyFilter = hasStatusFilter || hasDateFilter;

  // Functions
  const onDragEnd = createTasksBoardOnDragEnd(setBoardTasks, (tasks) =>
    qc.setQueryData(queryKey, tasks)
  );

  const resetFilters = () => {
    setStatus('ALL');
    setDateRange(undefined);
  };

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
          setStatus={(s) => setStatus((s as TaskStatusDTO) ?? 'ALL')}
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

      <ProjectTasksBoard
        filteredTasks={filteredTasks}
        tasksByStatus={tasksByStatus}
        droppableDirection={droppableDirection}
        onDragEnd={onDragEnd}
        workspaceId={workspaceId}
        projectId={project.id}
        doneTasksCount={doneTasksCount}
        setDoneTasksCount={setDoneTasksCount}
        counts={counts}
        remainTasksCount={remainTasksCount}
      />
    </article>
  );
};

export default ProjectComponent;

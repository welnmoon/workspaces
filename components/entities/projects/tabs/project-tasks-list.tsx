'use client';
import { MessageInfo } from '@/components/message';
import type { TaskStatusDTO } from '@/const/tasks-status';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';

import { Dispatch, SetStateAction, useState } from 'react';

import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import ProjectSprints from './project-sprints';
import ProjectBacklogs from './project-backlogs';

type StatusFilter = TaskStatusDTO | 'ALL';

type ProjectTabsListProps = {
  sprints: SprintWithTasksWithAssigneesDTO[];
  listTasks: TaskWithAssigneeDTO[];
  backlogTasks: TaskWithAssigneeDTO[];
  hasAnyFilter: boolean;
  hasStatusFilter: boolean;
  hasDateFilter: boolean;
  status: StatusFilter;
  onStatusChange: (
    taskId: number,
    status: TaskStatusDTO
  ) => void | Promise<void>;
  isStatusPending?: boolean;
  selectedIds: Set<number>;
  setSelectedIds: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending: boolean;
};

const ProjectTabsList = ({
  sprints,
  listTasks,
  backlogTasks,
  hasAnyFilter,
  hasStatusFilter,
  hasDateFilter,
  status,
  onStatusChange,
  isStatusPending,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
}: ProjectTabsListProps) => {
  return (
    <section className="space-y-3">
      {hasAnyFilter && listTasks.length > 0 && (
        <MessageInfo text={`Найдено ${listTasks.length} задач`} />
      )}
      {sprints.length}
      <ProjectSprints
        sprints={sprints}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isDeleteTasksPending={isDeleteTasksPending}
      />
      <ProjectBacklogs
        backlogs={backlogTasks}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isDeleteTasksPending={isDeleteTasksPending}
      />

      {/* {hasAnyFilter && listTasks.length === 0 && (
        <EmptyState
          title={
            hasStatusFilter && hasDateFilter
              ? `Нет задач со статусом ${status} в выбранном диапазоне`
              : hasStatusFilter
                ? `Нет задач со статусом ${status}`
                : `Нет задач в выбранном диапазоне`
          }
        />
      )} */}
    </section>
  );
};

export default ProjectTabsList;

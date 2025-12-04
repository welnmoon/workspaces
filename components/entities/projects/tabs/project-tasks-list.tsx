'use client';
import { MessageInfo } from '@/components/message';
import type { TaskStatusDTO } from '@/const/tasks-status';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';

import { Dispatch, SetStateAction, useState } from 'react';

import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import ProjectSprints from './project-sprints';
import ProjectBacklogs from './project-backlogs';
import { useSprintCreate } from '@/hooks/tasks/sprint/use-sprint-create';
import { CreateSprintSchema } from '@/schemas/sprint/create-sprint-schema';
import CreateSprintRowForm from '@/components/forms/sprint/create-sprint-row-form';
import { useSprints } from '@/hooks/tasks/sprint/use-sprints';
import { usePathname } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';

type StatusFilter = TaskStatusDTO | 'ALL';

type ProjectTabsListProps = {
  sprints: SprintWithTasksWithAssigneesDTO[];
  createSprint: boolean;
  // sprintsId: Map<number, string>;
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

  onCreateSprint: (payload: CreateSprintSchema) => void;
  onCreateSprintPending: boolean;
};

const ProjectTabsList = ({
  sprints,
  createSprint,
  // sprintsId,
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

  onCreateSprint,
  onCreateSprintPending,
}: ProjectTabsListProps) => {
  const pathname = usePathname();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const { data: optimisticSprints } = useSprints(
    workspaceId!,
    projectId!,
    sprints
  );
  return (
    <section className="space-y-3">
      {hasAnyFilter && listTasks.length > 0 && (
        <MessageInfo text={`Найдено ${listTasks.length} задач`} />
      )}

      <ProjectSprints
        sprints={optimisticSprints!}
        // sprintsId={sprintsId}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isDeleteTasksPending={isDeleteTasksPending}
      />
      {createSprint && !onCreateSprintPending && (
        <CreateSprintRowForm
          isPending={onCreateSprintPending}
          onCreateSprint={onCreateSprint}
          sprintsCount={sprints.length}
        />
      )}
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

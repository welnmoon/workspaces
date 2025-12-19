'use client';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import ProjectSprints from './project-sprints';
import ProjectBacklogs from './project-backlogs';
import { CreateSprintSchema } from '@/schemas/sprint/create-sprint-schema';
import CreateSprintRowForm from '@/components/forms/sprint/create-sprint-row-form';
import { useSprints } from '@/hooks/sprint/use-sprints';
import { usePathname } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';

type ProjectTabsListProps = {
  sprints: SprintWithTasksWithAssigneesDTO[];
  createSprint: boolean;
  // sprintsId: Map<number, string>;
  backlogTasks: TaskWithAssigneeDTO[];
  selectedIds: Set<number>;
  setSelectedIds: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending: boolean;

  onCreateSprint: (payload: CreateSprintSchema) => void;
  onCreateSprintPending: boolean;
  openSprintIds: string[];
  setOpenSprintIds: Dispatch<SetStateAction<string[]>>;
};

const ProjectTabsList = ({
  sprints,
  createSprint,
  // sprintsId,
  backlogTasks,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
  onCreateSprint,
  onCreateSprintPending,
  openSprintIds,
  setOpenSprintIds,
}: ProjectTabsListProps) => {
  const pathname = usePathname();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const { data: optimisticSprints } = useSprints(
    workspaceId!,
    projectId!,
    sprints
  );

  const createSprintFormRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (createSprint && createSprintFormRef.current) {
      createSprintFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [createSprint]);
  return (
    <section className="space-y-3">
      <ProjectSprints
        sprints={optimisticSprints!}
        // sprintsId={sprintsId}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isDeleteTasksPending={isDeleteTasksPending}
        openSprintIds={openSprintIds}
        setOpenSprintIds={setOpenSprintIds}
      />
      {createSprint && !onCreateSprintPending && (
        <div ref={createSprintFormRef}>
          <CreateSprintRowForm
            isPending={onCreateSprintPending}
            onCreateSprint={onCreateSprint}
            sprintsCount={sprints.length}
            isFormShowing={createSprint}
          />
        </div>
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

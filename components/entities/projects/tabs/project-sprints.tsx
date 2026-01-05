import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import TasksSprintAccordion from './tasks-sprint-accordion';
import type { Dispatch, SetStateAction } from 'react';

const ProjectSprints = ({
  sprints,
  selectedIds: _selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
  openSprintIds,
  setOpenSprintIds,
}: {
  sprints: SprintWithTasksWithAssigneesDTO[];
  selectedIds?: Set<number>;
  setSelectedIds?: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending?: boolean;
  openSprintIds: string[];
  setOpenSprintIds: Dispatch<SetStateAction<string[]>>;
}) => {
  return (
    <section className="flex flex-col gap-4">
      {sprints.map((s) => (
        <TasksSprintAccordion
          openSprintIds={openSprintIds}
          setOpenSprintIds={setOpenSprintIds}
          key={s.id}
          sprint={s}
          // selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isDeleteTasksPending}
        />
      ))}
    </section>
  );
};

export default ProjectSprints;

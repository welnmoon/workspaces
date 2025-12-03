import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import TasksSprintAccordion from './tasks-sprint-accordion';
import type { Dispatch, SetStateAction } from 'react';

const ProjectSprints = ({
  sprints,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
}: {
  sprints: SprintWithTasksWithAssigneesDTO[];
  selectedIds?: Set<number>;
  setSelectedIds?: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending?: boolean;
}) => {
  return (
    <section>
      {sprints.map((s) => (
        <TasksSprintAccordion
          key={s.id}
          sprint={s}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isDeleteTasksPending}
        />
      ))}
    </section>
  );
};

export default ProjectSprints;

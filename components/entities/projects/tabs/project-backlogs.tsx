import BacklogAccordion from './backlog-accordion';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import type { Dispatch, SetStateAction } from 'react';

const ProjectBacklogs = ({
  backlogs,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
}: {
  backlogs: TaskWithAssigneeDTO[];
  selectedIds?: Set<number>;
  setSelectedIds?: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending?: boolean;
}) => {
  return (
    <section className="space-y-4">
      <BacklogAccordion
        tasks={backlogs}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isDeleteTasksPending={isDeleteTasksPending}
      />
    </section>
  );
};

export default ProjectBacklogs;

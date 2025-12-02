import BacklogAccordion from './backlog-accordion';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';

const ProjectBacklogs = ({ backlogs }: { backlogs: TaskWithAssigneeDTO[] }) => {
  return (
    <section className="space-y-4">
      <BacklogAccordion
        // key={backlog.title || `backlog-${idx}`}
        // title={backlog.title || 'Бэклог'}
        tasks={backlogs}
      />
    </section>
  );
};

export default ProjectBacklogs;

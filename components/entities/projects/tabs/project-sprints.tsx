import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import TasksSprintAccordion from './tasks-sprint-accordion';

const ProjectSprints = ({
  sprints,
}: {
  sprints: SprintWithTasksWithAssigneesDTO[];
}) => {
  return (
    <section>
      {sprints.map((s) => (
        <TasksSprintAccordion key={s.id} sprint={s} />
      ))}
    </section>
  );
};

export default ProjectSprints;

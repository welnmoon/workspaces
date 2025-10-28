import { Project, Task } from '@prisma/client';
import { Heading } from '../ui/heading';
import Divider from '../divider';
import Description from '../ui/desc';
import CreateTaskForm from '@/components/forms/task/create-task-form';
import TaskCard from '../tasks/task-card';
import CreateTaskDialog from '../dialogs/create-task-dialog';
import { cardContainer } from '@/styles/styles';

const ProjectComponent = ({
  project,
  workspaceId,
  tasks,
}: {
  project: Project;
  workspaceId: number;
  tasks: Task[];
}) => {
  if (!project) return null;
  return (
    <article>
      <Heading>Project {project.name}</Heading>
      <Description text={project.description || 'No description'} />
      <Divider />
      <div className="flex justify-between">
        <Heading>Tasks</Heading>
        <CreateTaskDialog projectId={project.id} workspaceId={workspaceId} />
      </div>
      <section role="list" className={cardContainer}>
        {tasks.map((t) => (
          <TaskCard
            role="listitem"
            description={t.description || ''}
            dueDate={t.dueDate ? t.dueDate.toISOString() : ''}
            key={t.id}
            projectId={t.projectId}
            workspaceId={Number(workspaceId)}
            status={t.status}
            title={t.title}
            taskId={t.id}
          />
        ))}
      </section>
    </article>
  );
};

export default ProjectComponent;

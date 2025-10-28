import CreateTaskForm from '@/components/forms/task/create-task-form';
import NotFound from '@/components/not-found';
import ProjectComponent from '@/components/projects/project';
import TaskCard from '@/components/tasks/task-card';
import { requireUser } from '@/helpers/require-user';
import { getProjectTasks } from '@/lib/get-project-tasks';
import prisma from '@/lib/prisma';
import { taskIsExpired } from '@/lib/task/isExpired';

const ProjectPage = async ({
  params,
}: {
  params: { workspaceId: string; projectId: string };
}) => {
  const { id } = await requireUser();
  const project = await prisma.project.findUnique({
    where: { id: Number(params.projectId) },
  });
  if (!project) {
    return <NotFound text="Project" />;
  }
  const tasks = await getProjectTasks({
    projectId: Number(params.projectId),
  });

  return (
    <main>
      {!project && <NotFound text="Project" />}
      {project && <ProjectComponent project={project} />}
      {tasks.length === 0 && <div>No tasks found</div>}
      <section role="list" className="grid grid-cols-2 gap-4 my-4">
        {tasks.map((t) => (
          <TaskCard
            role="listitem"
            description={t.description || ''}
            dueDate={t.dueDate ? t.dueDate.toISOString() : ''}
            key={t.id}
            projectId={t.projectId}
            workspaceId={Number(params.workspaceId)}
            status={t.status}
            title={t.title}
            taskId={t.id}
          />
        ))}
      </section>
      <CreateTaskForm
        projectId={project?.id}
        workspaceId={Number(params.workspaceId)}
      />
    </main>
  );
};

export default ProjectPage;

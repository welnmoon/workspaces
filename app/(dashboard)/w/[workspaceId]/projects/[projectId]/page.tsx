import NotFound from '@/components/not-found';
import ProjectComponent from '@/components/entities/projects/project';
import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
import { ProjectService } from '@/lib/services/project';
import { use } from 'react';

const ProjectPage = async ({
  params,
}: {
  params: { workspaceId: string; projectId: string };
}) => {
  const { id } = await requireUser();
  const { workspaceId, projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(projectId) },
  });
  if (!project) {
    return <NotFound text="Project" />;
  }

  const [tasks, taskStats] = await Promise.all([
    ProjectService.getProjectTasks(project.id),
    ProjectService.getProjectTasksStats(project.id),
  ]);

  let workspaceName = await prisma.workspace.findUnique({
    where: {
      id: Number(workspaceId),
    },
    select: {
      name: true,
    },
  });

  if (!workspaceName) {
    workspaceName = { name: String(workspaceId) };
  }

  return (
    <main>
      {!project && <NotFound text="Project" />}
      {project && (
        <ProjectComponent
          workspaceId={Number(workspaceId)}
          tasks={tasks}
          project={project}
          workspaceName={workspaceName?.name || null}
          taskStats={taskStats}
        />
      )}
      {tasks.length === 0 && <div>No tasks found</div>}
    </main>
  );
};

export default ProjectPage;

import NotFound from '@/components/not-found';
import ProjectComponent from '@/components/projects/project';
import { requireUser } from '@/helpers/require-user';
import { getProjectTasks } from '@/lib/get-project-tasks';
import prisma from '@/lib/prisma';

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

  let workspaceName = await prisma.workspace.findUnique({
    where: {
      id: Number(params.workspaceId),
    },
    select: {
      name: true,
    },
  });

  if (!workspaceName) {
    workspaceName = { name: String(params.workspaceId) };
  }

  return (
    <main>
      {!project && <NotFound text="Project" />}
      {project && (
        <ProjectComponent
          workspaceId={Number(params.workspaceId)}
          tasks={tasks}
          project={project}
          workspaceName={workspaceName?.name || null}
        />
      )}
      {tasks.length === 0 && <div>No tasks found</div>}
    </main>
  );
};

export default ProjectPage;

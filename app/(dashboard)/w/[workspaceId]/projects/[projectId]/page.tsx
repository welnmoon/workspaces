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
  const tasks = await getProjectTasks({
    projectId: Number(params.projectId),
  });

  return (
    <main>
      {!project && <NotFound text="Project" />}
      {project && <ProjectComponent project={project} />}
      {tasks.length === 0 && <div>No tasks found</div>}
      {tasks.map((t) => t.title)}
    </main>
  );
};

export default ProjectPage;

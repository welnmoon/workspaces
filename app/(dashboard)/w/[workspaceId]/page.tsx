import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import Divider from '@/components/divider';
import CreateProjectForm from '@/components/forms/project/create-project-form';
import ProjectCard from '@/components/projects/project-card';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';

const WorkspacePage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const user = await requireUser();
  const { workspaceId } = params;
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: Number(workspaceId),
    },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const projects = await prisma.project.findMany({
    where: {
      workspaceId: workspace.id,
    },
  });

  return (
    <main className="flex flex-col gap-4">
      <Heading>Workspace {workspace?.name}</Heading>
      <Divider />
      <div className="flex justify-between">
        <Heading>Projects</Heading>
        <CreateProjectDialog workspaceId={workspaceId} />
      </div>
      <section className="flex flex-col gap-4">
        {projects.map((p) => (
          <ProjectCard
            title={p.name}
            description={p.description || ''}
            projectId={p.id}
            workspaceId={workspace.id}
            key={p.id}
          />
        ))}
        {projects.length === 0 && <div>No projects found</div>}
      </section>
    </main>
  );
};

export default WorkspacePage;

import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import Divider from '@/components/divider';
import ProjectCard from '@/components/projects/project-card';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
import { ProjectServices } from '@/lib/services/project';
import { cardContainer } from '@/styles/styles';

const WorkspacePage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  await requireUser();
  const { workspaceId } = await params;
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: Number(workspaceId),
    },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const projects = await ProjectServices.getList(Number(workspaceId));

  return (
    <main className="flex flex-col gap-4 ">
      <Heading>Workspace {workspace?.name}</Heading>
      <Divider />
      <div className="flex justify-between">
        <Heading>Projects</Heading>
        <CreateProjectDialog workspaceId={workspaceId} />
      </div>
      <section className={cardContainer}>
        {projects.map((p) => (
          <ProjectCard
            title={p.name}
            description={p.description || ''}
            projectId={p.id}
            workspaceId={workspace.id}
            key={p.id}
          />
        ))}
        {projects.length === 0 && (
          <div className="w-full py-8 text-center text-muted-foreground">
            No projects found
          </div>
        )}
      </section>
    </main>
  );
};

export default WorkspacePage;

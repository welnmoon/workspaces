import Divider from '@/components/divider';
import CreateProjectForm from '@/components/projects/create-project-form';
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
      <Heading>Projects</Heading>
      <section className="flex flex-col gap-4">
        {projects.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
        {projects.length === 0 && <div>No projects found</div>}
      </section>
      <CreateProjectForm workspaceId={Number(workspaceId)} />
    </main>
  );
};

export default WorkspacePage;

import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
import { clientRoutes } from '@/lib/routes/client-routes';
import Link from 'next/link';

const ProjectsPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const { id } = await requireUser();
  const { workspaceId } = params;
  const projects = await prisma.project.findMany({
    where: {
      workspaceId: Number(workspaceId),
    },
  });
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: Number(workspaceId),
    },
    select: {
      name: true,
    },
  });
  return (
    <main>
      <Heading>
        <Link
          href={clientRoutes.workspacePage(Number(workspaceId))}
          className="text-foreground-muted"
        >
          <span className="underline-anim">Workspaces {workspace?.name}</span>
        </Link>{' '}
        {'>'} Projects
      </Heading>
      <section className="flex gap-2">
        {projects.map((w) => (
          <Link
            href={clientRoutes.projectPage(Number(workspaceId), w.id)}
            className="px-4 py-2 bg-gray-100 rounded-xl "
            key={w.id}
          >
            {w.name}
          </Link>
        ))}
      </section>
    </main>
  );
};

export default ProjectsPage;

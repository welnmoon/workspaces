import WorkspacesComponent from '@/components/workspaces/workspaces';
import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';

const WorkspacesPage = async () => {
  const user = await requireUser();
  const workspaces = await prisma.workspace.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return <WorkspacesComponent workspaces={workspaces} />;
};

export default WorkspacesPage;

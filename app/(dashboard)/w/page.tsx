import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
import Link from 'next/link';

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
    select: {
      name: true,
      tariff: true,
      id: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <main>
      <Heading>Workspaces</Heading>
      <section className="flex gap-2">
        {workspaces.map((w) => (
          <Link
            href={`/w/${w.id}`}
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

export default WorkspacesPage;

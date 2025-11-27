'use client';

import { Heading } from '../../ui/heading';
import { cardContainer } from '@/styles/styles';
import WorkspaceCard from './w-card/workspace-card';
import CreateWorkspaceDialog from '../../dialogs/create-w-dialog';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import EmptyState from '@/components/empty-state';
const WorkspacesComponent = ({
  workspaces,
  userId,
}: {
  workspaces: WorkspaceListDTO[];
  userId: string;
}) => {
  return (
    <main className="space-y-6 mt-6">
      <div className="flex justify-between min-w-full items-center">
        <Heading>Workspaces</Heading>
        <CreateWorkspaceDialog />
      </div>

      {workspaces.length > 0 && (
        <section className={cardContainer}>
          {workspaces.map((workspace) => (
            <WorkspaceCard
              userId={userId}
              key={workspace.id}
              workspace={workspace}
            />
          ))}
        </section>
      )}

      {workspaces.length === 0 && (
        <EmptyState title="Нет пространств" subtitle="Давай начнем" />
      )}
    </main>
  );
};

export default WorkspacesComponent;

'use client';

import { Heading } from '../../ui/heading';
import { cardContainer } from '@/styles/styles';
import WorkspaceCard from './w-card/workspace-card';
import CreateWorkspaceDialog from '../../dialogs/create-w-dialog';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import EmptyState from '@/components/empty-state';
import { useWorkspaces } from '@/hooks/workspace/use-workspaces';
const WorkspacesComponent = ({
  workspaces,
  userId,
}: {
  workspaces: WorkspaceListDTO[];
  userId: string;
}) => {
  const { data: workspaceData, isLoading, isError } = useWorkspaces(workspaces);
  return (
    <main>
      <div className="flex justify-between min-w-full">
        <Heading>Workspaces</Heading>
        <CreateWorkspaceDialog />
      </div>

      {workspaces.length > 0 && (
        <section className={cardContainer}>
          {workspaceData.map((workspace) => (
            <WorkspaceCard
              userId={userId}
              key={workspace.id}
              workspace={workspace}
            />
          ))}
        </section>
      )}

      {workspaceData.length === 0 && (
        <EmptyState title="Нет пространств" subtitle="Давай начнем" />
      )}
    </main>
  );
};

export default WorkspacesComponent;

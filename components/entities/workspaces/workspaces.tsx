import { Heading } from '../../ui/heading';
import { cardContainer } from '@/styles/styles';
import WorkspaceCard from './workspace-card';
import CreateWorkspaceDialog from '../../dialogs/create-w-dialog';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
const WorkspacesComponent = ({
  workspaces,
  userId,
}: {
  workspaces: WorkspaceListDTO[];
  userId: string;
}) => {
  return (
    <main>
      <div className="flex justify-between min-w-full">
        <Heading>Workspaces</Heading>
        <CreateWorkspaceDialog />
      </div>

      <section className={cardContainer}>
        {workspaces.map((workspace) => (
          <WorkspaceCard userId={userId} key={workspace.id} workspace={workspace} />
        ))}
      </section>
    </main>
  );
};

export default WorkspacesComponent;

import { Workspace } from '@prisma/client';

import { Heading } from '../ui/heading';
import { cardContainer } from '@/styles/styles';
import WorkspaceCard from './workspace-card';
import CreateWorkspaceDialog from '../dialogs/create-w-dialog';
const WorkspacesComponent = ({ workspaces }: { workspaces: Workspace[] }) => {
  return (
    <main>
      <div className="flex justify-between">
        <Heading>Workspaces</Heading>
        <CreateWorkspaceDialog />
      </div>
      <section className={cardContainer}>
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </section>
    </main>
  );
};

export default WorkspacesComponent;

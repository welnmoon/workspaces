import UnauthorizedClient from '@/components/un-auth-client';
import WorkspacesComponent from '@/components/entities/workspaces/workspaces';
import { requireUser } from '@/guards/require-user';
import { WorkspaceService } from '@/lib/services/workspace';
import { AppError } from '@/lib/errors';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

const WorkspacesPage = async () => {
  try {
    const user = await requireUser();
    const workspaces = await WorkspaceService.getList(user.id);

    return <WorkspacesComponent userId={user.id} workspaces={workspaces} />;
  } catch (e) {
    if (e instanceof AppError) {
      return <UnauthorizedClient />;
    }
  }
};

export default WorkspacesPage;

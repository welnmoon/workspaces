import UnauthorizedClient from '@/components/un-auth-client';
import WorkspacesComponent from '@/components/entities/workspaces/workspaces';
import { requireUser, UnauthorizedError } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
import { MembershipService } from '@/lib/services/membership';
import { WorkspaceService } from '@/lib/services/workspace';

const WorkspacesPage = async () => {
  try {
    const user = await requireUser();
    const workspaces = await WorkspaceService.getList(user.id);

    return <WorkspacesComponent userId={user.id} workspaces={workspaces} />;
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return <UnauthorizedClient />;
    }
  }
};

export default WorkspacesPage;

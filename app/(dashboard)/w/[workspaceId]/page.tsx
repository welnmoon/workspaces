import Divider from '@/components/divider';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import { getWorkspaceStats } from '@/lib/services/func/get-workspace-stats';
import { MembershipService } from '@/lib/services/membership';
import { WorkspaceService } from '@/lib/services/workspace';
import { Role } from '@prisma/client';
import { Breadcrumbs } from '@/components/bread-crumbs';
import { clientRoutes } from '@/lib/routes/client-routes';
import WorkspacePopover from '@/components/entities/workspaces/workspace-popover';
import WorkspaceTabs from '@/components/entities/workspaces/workspace-tabs';
import { WProjectsSectionProps } from '@/components/entities/workspaces/w-projects-section';
import WorkspaceOverview from '@/components/entities/workspaces/workspace-overview';
import { isMember } from '@/helpers/is-member';
import EmptyState from '@/components/empty-state';
import { tariffs } from '@/const/tariffs';
import { validateId } from '@/helpers/validate-id';
import { UserService } from '@/lib/services/user';

const WorkspacePage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const user = await requireUser();
  const workspaceIdNumber = validateId((await params).workspaceId);
  const memberCheck = await isMember(workspaceIdNumber, user.id);
  const [
    userRole,
    userTariff,
    workspace,
    projects,
    memberships,
    role,
    invites,
  ] = await Promise.all([
    MembershipService.getUserRoleInWorkspace(user.id, workspaceIdNumber),
    UserService.getUserTariff(user.id),
    WorkspaceService.getWorkspaceById(workspaceIdNumber),
    WorkspaceService.getWorkspaceProjects(workspaceIdNumber),
    WorkspaceService.getWorkspaceMembers(workspaceIdNumber),
    MembershipService.getUserRoleInWorkspace(user.id, workspaceIdNumber),
    WorkspaceService.getWorkspaceInvites(workspaceIdNumber),
  ]);

  if (!workspace) {
    return <EmptyState title="Пространство не найдено" />;
  }

  if (memberCheck.isMember === false) {
    return (
      <>
        <EmptyState
          title="Вы не участник этого пространства"
          subtitle="Отправьте заявку на вступление."
        />
        <span>В разработке...</span>
      </>
    );
  }

  const {
    membersCount,
    projectsCount,
    tasksToDoCount,
    tasksInProgress,
    tasksDone,
    tasksTotal,
    tasksOverdue,
  } = await getWorkspaceStats(workspaceIdNumber);

  const projectSectionProps: WProjectsSectionProps = {
    userRole: userRole!,
    workspaceId: workspace.id,
    workspace,
    projects,
  };
  const wTariff = tariffs[userTariff?.currentTariff as keyof typeof tariffs];
  return (
    <main className="flex flex-col gap-4 ">
      <Breadcrumbs
        items={[
          { label: 'Workspaces', href: clientRoutes.workspacesPage() },
          {
            label: workspace.name,
            href: clientRoutes.workspacePage(workspaceIdNumber),
          },
        ]}
      />
      <div className="flex justify-between">
        <Heading>Workspace {workspace?.name}</Heading>
        {(role === Role.OWNER || role === Role.ADMIN) && (
          <WorkspacePopover
            userId={user.id}
            tasksDone={tasksDone}
            workspaceId={workspaceIdNumber}
            workspaceName={workspace.name}
            workspaceDescription={workspace.description}
          />
        )}
      </div>

      <WorkspaceOverview
        membersCount={membersCount}
        projectsCount={projectsCount}
        tasksTotal={tasksTotal}
        tasksInProgress={tasksInProgress}
        tasksDone={tasksDone}
        tasksToDoCount={tasksToDoCount}
        tasksOverdue={tasksOverdue}
        userRole={userRole!}
        tariff={wTariff}
        workspaceId={workspaceIdNumber}
      />

      <Divider />
      <WorkspaceTabs
     
        user={user}
        members={memberships}
        projectSectionProps={projectSectionProps}
        invites={invites}
      />
    </main>
  );
};

export default WorkspacePage;

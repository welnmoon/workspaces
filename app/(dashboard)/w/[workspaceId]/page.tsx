import Divider from '@/components/divider';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import { getWorkspaceStats } from '@/lib/services/get-workspace-stats';
import { MembershipService } from '@/lib/services/membership';
import { WorkspaceService } from '@/lib/services/workspace';
import { Role } from '@prisma/client';
import { Breadcrumbs } from '@/components/bread-crumbs';
import { clientRoutes } from '@/lib/routes/client-routes';
import WorkspacePopover from '@/components/entities/workspaces/workspace-popover';
import WorkspaceTabs from '@/components/entities/workspaces/workspace-tabs';
import { WProjectsSectionProps } from '@/components/entities/workspaces/w-projects-section';
import { isMember } from '@/helpers/is-member';
import EmptyState from '@/components/empty-state';
import { Suspense } from 'react';

const WorkspacePage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const user = await requireUser();
  const workspaceIdNumber = Number((await params).workspaceId);
  const memberCheck = await isMember(workspaceIdNumber, user.id);
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
  const [userRole, workspace, projects, memberships, role] = await Promise.all([
    MembershipService.getUserRoleInWorkspace(user.id, workspaceIdNumber),
    WorkspaceService.getWorkspaceById(workspaceIdNumber),
    WorkspaceService.getWorkspaceProjects(workspaceIdNumber),
    WorkspaceService.getWorkspaceMembers(workspaceIdNumber),
    MembershipService.getUserRoleInWorkspace(user.id, workspaceIdNumber),
  ]);

  if (!workspace) {
    return <EmptyState title="Пространство не найдено" />;
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
        {role === Role.OWNER || role === Role.ADMIN && (
          <WorkspacePopover
            workspaceId={workspaceIdNumber}
            workspaceName={workspace.name}
            workspaceDescription={workspace.description}
          />
        )}
      </div>

      <Suspense
        fallback={<div className="h-6 w-full bg-gray-200 animate-pulse"></div>}
      >
        <div className="flex gap-4  text-sm text-muted-foreground items-center">
          <span>
            Участников: <b>{membersCount}</b>
          </span>
          <span>
            Проектов: <b>{projectsCount}</b>
          </span>
          <div className="bg-zinc-100 px-2 py-1 rounded-md flex gap-3">
            <span className="text-zinc-400 ">Задачи</span>
            <span>
              Всего: <b>{tasksTotal}</b>
            </span>
            <span>
              В работе: <b>{tasksInProgress}</b>
            </span>
            <span>
              Выполненные: <b className="text-green-500">{tasksDone}</b>
            </span>
            <span>
              Новые: <b className="text-blue-500">{tasksToDoCount}</b>
            </span>
            <span>
              Просроченные: <b className="text-red-500">{tasksOverdue}</b>
            </span>
          </div>

          <div className="bg-primary-100 rounded-md px-2 py-1">
            Ваша роль: <span className="font-medium">{userRole}</span>
          </div>
        </div>
      </Suspense>
      <Divider />
      <WorkspaceTabs
        user={user}
        members={memberships}
        projectSectionProps={projectSectionProps}
      />
    </main>
  );
};

export default WorkspacePage;

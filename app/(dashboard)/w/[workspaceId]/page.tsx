import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import Divider from '@/components/divider';
import ProjectCard from '@/components/entities/projects/project-card';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import { useWorkspace } from '@/hooks/workspace/use-workspace';
import { MembershipService } from '@/lib/services/membership';
import { WorkspaceService } from '@/lib/services/workspace';
import { cardContainer } from '@/styles/styles';
import { Role } from '@prisma/client';
import { Breadcrumbs } from '@/components/bread-crumbs';
import { clientRoutes } from '@/lib/routes/client-routes';
import WorkspacePopover from '@/components/entities/workspaces/workspace-popover';

const WorkspacePage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const { id } = await requireUser();
  const { workspaceId } = await params;
  const workspaceIdNumber = Number(workspaceId);

  const [userRole, workspace, projects] = await Promise.all([
    MembershipService.getUserRoleInWorkspace(id, workspaceIdNumber),
    WorkspaceService.getWorkspaceById(workspaceIdNumber),
    WorkspaceService.getWorkspaceProjects(Number(workspaceId)),
  ]);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const {
    membersCount,
    projectsCount,
    tasksToDoCount,
    tasksInProgress,
    tasksDone,
    tasksTotal,
    tasksOverdue,
  } = await useWorkspace(workspaceIdNumber);

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
        <WorkspacePopover />
      </div>
      {workspace.ownerId === id && 'Вы OWNER'}
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
      <Divider />
      <div className="flex justify-between">
        <Heading>Projects</Heading>
        {userRole === Role.ADMIN ||
          (userRole === Role.OWNER && (
            <CreateProjectDialog workspaceId={workspaceId} />
          ))}
      </div>
      <section className={cardContainer}>
        {projects.map((p) => (
          <ProjectCard
            title={p.name}
            description={p.description || ''}
            projectId={p.id}
            workspaceId={workspace.id}
            key={p.id}
            tasksTotal={tasksTotal}
            tasksDone={tasksDone}
            tasksInProgress={tasksInProgress}
            tasksToDoCount={tasksToDoCount}
            tasksOverdue={tasksOverdue}
          />
        ))}
        {projects.length === 0 && (
          <div className="w-full py-8 text-center text-muted-foreground">
            No projects found
          </div>
        )}
      </section>
    </main>
  );
};

export default WorkspacePage;

import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import Divider from '@/components/divider';
import { Breadcrumbs } from '@/components/bread-crumbs';
import ProjectCard from '@/components/entities/projects/project-card';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import { useWorkspace } from '@/hooks/workspace/use-workspace';
import { MembershipService } from '@/lib/services/membership';
import { WorkspaceService } from '@/lib/services/workspace';
import { clientRoutes } from '@/lib/routes/client-routes';
import { cardContainer } from '@/styles/styles';
import { Role } from '@prisma/client';

const ProjectsPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const { id } = await requireUser();
  const workspaceIdNumber = Number(params.workspaceId);

  if (Number.isNaN(workspaceIdNumber)) {
    return <div>Invalid workspace</div>;
  }

  const [workspace, userRole, projects, workspaceStats] = await Promise.all([
    WorkspaceService.getWorkspaceById(workspaceIdNumber),
    MembershipService.getUserRoleInWorkspace(id, workspaceIdNumber),
    WorkspaceService.getWorkspaceProjects(workspaceIdNumber),
    useWorkspace(workspaceIdNumber),
  ]);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const {
    tasksTotal,
    tasksDone,
    tasksInProgress,
    tasksToDoCount,
    tasksOverdue,
  } = workspaceStats;

  return (
    <main className="flex flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: 'Workspaces', href: clientRoutes.workspacesPage() },
          {
            label: workspace.name,
            href: clientRoutes.workspacePage(workspaceIdNumber),
          },
          { label: 'Projects' },
        ]}
      />

      <div className="flex justify-between items-center">
        <Heading level={2}>Projects</Heading>
        {(userRole === Role.ADMIN || userRole === Role.OWNER) && (
          <CreateProjectDialog workspaceId={params.workspaceId} />
        )}
      </div>

      <Divider />

      <section className={cardContainer}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.name}
            description={project.description || ''}
            projectId={project.id}
            workspaceId={workspace.id}
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

export default ProjectsPage;

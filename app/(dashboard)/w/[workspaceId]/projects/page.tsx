import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import Divider from '@/components/divider';
import { Breadcrumbs } from '@/components/bread-crumbs';
import ProjectCard from '@/components/entities/projects/project-card';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import { MembershipService } from '@/lib/services/membership';
import { WorkspaceService } from '@/lib/services/workspace';
import { clientRoutes } from '@/lib/routes/client-routes';
import { cardContainer } from '@/styles/styles';
import { Role } from '@prisma/client';
import { isMember } from '@/helpers/is-member';
import EmptyState from '@/components/empty-state';
import { ProjectFullDTO } from '@/types/prisma/DTO/projects';

const ProjectsPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const { id } = await requireUser();
  const { workspaceId } = await params;
  const memberCheck = await isMember(Number(workspaceId), id);
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
  const workspaceIdNumber = Number(workspaceId);

  if (Number.isNaN(workspaceIdNumber)) {
    return <div>Invalid workspace</div>;
  }

  const [workspace, userRole, projects] = await Promise.all([
    WorkspaceService.getWorkspaceById(workspaceIdNumber),
    MembershipService.getUserRoleInWorkspace(id, workspaceIdNumber),
    WorkspaceService.getWorkspaceProjects(workspaceIdNumber),
    // getWorkspaceStats(workspaceIdNumber),
  ]);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  // const {
  //   tasksTotal,
  //   tasksDone,
  //   tasksInProgress,
  //   tasksToDoCount,
  //   tasksOverdue,
  // } = workspaceStats;

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
          <CreateProjectDialog workspaceId={Number(workspaceId)} />
        )}
      </div>

      <Divider />

      <section className={cardContainer}>
        {projects.map((project: ProjectFullDTO) => (
          <ProjectCard
            key={project.id}
            title={project.name}
            description={project.description || ''}
            projectId={project.id}
            projectEnd={Boolean(project.endedAt)}
            workspaceId={workspace.id}
            // tasksTotal={tasksTotal}
            // tasksDone={tasksDone}
            // tasksInProgress={tasksInProgress}
            // tasksToDoCount={tasksToDoCount}
            // tasksOverdue={tasksOverdue}
          />
        ))}

        {projects.length === 0 && (
          <EmptyState
            title="Проектов нет"
            subtitle="Создайте первый проект, чтобы начать работу."
          />
        )}
      </section>
    </main>
  );
};

export default ProjectsPage;

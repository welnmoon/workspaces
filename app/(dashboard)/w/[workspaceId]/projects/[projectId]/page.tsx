import NotFound from '@/components/not-found';
import ProjectComponent from '@/components/entities/projects/project';
import { requireUser } from '@/guards/require-user';
import { prisma } from '@/lib/prisma';
import { ProjectService } from '@/lib/services/project';
import { WorkspaceService } from '@/lib/services/workspace';
import { isMember } from '@/guards/is-member';
import EmptyState from '@/components/empty-state';
import { SprintService } from '@/lib/services/sprint';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) => {
  const { id } = await requireUser();
  const { workspaceId, projectId } = await params;
  const { isMember: userIsMember } = await isMember(Number(workspaceId), id);

  if (!userIsMember) {
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
  const project = await prisma.project.findUnique({
    where: { id: Number(projectId) },
  });
  if (!project) {
    return <NotFound text="Project" />;
  }

  const [tasks, allTaskStats, memberTaskStats, members, sprintsWithTasks] =
    await Promise.all([
      ProjectService.getProjectTasksWithAssignee(project.id),
      ProjectService.getProjectTasksStats(project.id),
      ProjectService.getProjectMemberTasksStats(project.id, id),
      WorkspaceService.getWorkspaceMembers(Number(workspaceId)),
      SprintService.getProjectSprintsWithTasks(project.id),
    ]);

  let workspaceName = await prisma.workspace.findUnique({
    where: {
      id: Number(workspaceId),
    },
    select: {
      name: true,
    },
  });

  if (!workspaceName) {
    workspaceName = { name: String(workspaceId) };
  }

  return (
    <main>
      {!project && <NotFound text="Project" />}
      {project && (
        <ProjectComponent
          sprints={sprintsWithTasks}
          workspaceId={Number(workspaceId)}
          tasks={tasks}
          project={project}
          workspaceName={workspaceName?.name || null}
          allTaskStats={allTaskStats}
          memberTaskStats={memberTaskStats}
          members={members}
        />
      )}
    </main>
  );
};

export default ProjectPage;

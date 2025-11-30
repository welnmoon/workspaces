'use client';

import type { Project } from '@prisma/client';
import type { TaskStatusDTO } from '@/const/tasks-status';
import type { TaskStats } from '@/types/service/task-stats';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import type { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Breadcrumbs } from '../../bread-crumbs';
import Divider from '../../divider';
import CreateTaskDialog from '../../dialogs/create-task-dialog';
import Description from '../../ui/desc';
import { Heading } from '../../ui/heading';
import ProjectMemberTasksAllStats from './project-member-tasks-stats';
import ProjectTabs from './tabs/project-tabs';
import ProjectTasksAllStats from './project-tasks-stats';

export type StatusFilter = TaskStatusDTO | 'ALL';

const ProjectComponent = ({
  project,
  workspaceId,
  tasks,
  workspaceName,
  allTaskStats,
  memberTaskStats,
  members,
}: {
  project: Project;
  workspaceId: number;
  tasks: TaskWithAssigneeDTO[];
  workspaceName: string | null;
  allTaskStats: TaskStats;
  memberTaskStats: TaskStats;
  members: MembershipSelectUserDTO[];
}) => {
  if (!project) return null;

  return (
    <article className="space-y-4">
      <Heading className="mb-2" level={3}>
        <Breadcrumbs
          items={[
            {
              label: `Workspaces`,
              href: clientRoutes.workspacesPage(),
            },
            {
              label: `${workspaceName}`,
              href: clientRoutes.workspacePage(workspaceId),
            },
            {
              label: `Projects`,
              href: clientRoutes.projectsPage(workspaceId),
            },
            {
              label: `${project.name}`,
              href: clientRoutes.projectPage(project.id, workspaceId),
            },
          ]}
        />
      </Heading>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0 text-sm text-muted-foreground">
          <Description text={project.description || 'No description'} />
        </div>
        <CreateTaskDialog
          members={members}
          projectId={project.id}
          workspaceId={workspaceId}
        />
      </div>

      <Divider />

      <div className="rounded-2xl border border-primary/10 bg-white/90 px-4 py-4 md:px-6 md:py-5 shadow-md ring-1 ring-primary/5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 text-sm">
            <Heading level={3}>Задачи</Heading>
            {allTaskStats && (
              <ProjectTasksAllStats allTaskStats={allTaskStats} />
            )}
            {memberTaskStats && (
              <ProjectMemberTasksAllStats memberTaskStats={memberTaskStats} />
            )}
          </div>
        </div>

        <ProjectTabs
          tasks={tasks}
          workspaceId={workspaceId}
          projectId={project.id}
          allTaskStats={allTaskStats}
        />
      </div>
    </article>
  );
};

export default ProjectComponent;

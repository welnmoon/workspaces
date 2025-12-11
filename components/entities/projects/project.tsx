'use client';

import type { Project } from '@prisma/client';
import type { TaskStatusDTO } from '@/const/tasks-status';
import type { TaskStats } from '@/types/service/task-stats';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import type { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Breadcrumbs } from '../../bread-crumbs';
import Divider from '../../divider';

import Description from '../../ui/desc';
import { Heading } from '../../ui/heading';

import ProjectTabs from './tabs/project-tabs';

import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';

export type StatusFilter = TaskStatusDTO | 'ALL';

const ProjectComponent = ({
  sprints,
  project,
  workspaceId,
  tasks,
  workspaceName,
  allTaskStats,
  memberTaskStats,
  members,
}: {
  sprints: SprintWithTasksWithAssigneesDTO[];
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
        <Description text={project.description || null} />
      </div>

      <Divider />

      <div
        className="p-4 rounded-md bg-cover bg-center bg-fixed min-h-screen"
        style={{
          backgroundImage: "url('/images/workspaces/project-bg.jpg')",
        }}
      >
        <ProjectTabs
          sprints={sprints}
          tasks={tasks}
          workspaceId={workspaceId}
          projectId={project.id}
          allTaskStats={allTaskStats}
          memberTaskStats={memberTaskStats}
        />
      </div>
    </article>
  );
};

export default ProjectComponent;

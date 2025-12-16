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
import { useCloseProject } from '@/hooks/project/use-close-project';
import toast from 'react-hot-toast';
import { RippleButton } from '@/components/buttons/ripple-button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  ProjectLockProvider,
  useProjectLock,
} from './context/project-lock-context';

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
  const router = useRouter();
  const {
    mutate: closeProject,
    isPending: isCloseProjectPending,
    isError: isCloseProjectError,
    error: closeProjectError,
  } = useCloseProject(workspaceId, project.id);
  if (!project) return null;

  const projectEnded = Boolean(project.endedAt);

  const onCloseProjectHandle = () => {
    closeProject(undefined, {
      onSuccess: () => {
        toast.success('Проект успешно завершен');
      },
      onError: () => {
        toast.error('Не удалось завершить проект');
      },
    });
  };

  return (
    <ProjectLockProvider
      value={{
        locked: Boolean(project.endedAt),
        reason: `${project.endedAt?.toISOString()} - Проект закрыт`,
      }}
    >
      <article className="space-y-4">
        <Heading className="mb-2 flex justify-between" level={3}>
          <div className="flex gap-2 items-center">
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
            <ProjectEnd />
          </div>
          <RippleButton
            isLoading={isCloseProjectPending}
            className={cn(
              'min-w-10',
              projectEnded ? 'bg-primary-500 text-white' : 'bg-zinc-800'
            )}
            onClick={() => onCloseProjectHandle()}
          >
            {projectEnded ? 'Вернуть проект' : 'Завершить проект'}
          </RippleButton>
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
            projectEnd={!!project.endedAt}
          />
        </div>
      </article>
    </ProjectLockProvider>
  );
};

export default ProjectComponent;

const ProjectEnd = () => {
  return <Badge variant={'info'}>Проект завершен</Badge>;
};

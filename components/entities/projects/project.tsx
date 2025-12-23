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
import { useToggleProjectEnd } from '@/hooks/project/use-toggle-project-end';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ProjectLockProvider } from './context/project-lock-context';
import { useProject } from '@/hooks/project/use-project';
import { RippleButton } from '@/ui/button/ripple-button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: optimisticProject, isLoading: isProjectLoading } =
    useProject(project);
  const { mutate: toggleProjectEnd, isPending: isToggleProjectPending } =
    useToggleProjectEnd(workspaceId, optimisticProject.id);
  if (!optimisticProject) return null;

  const projectEnded = Boolean(optimisticProject.endedAt);

  const onCloseProjectHandle = () => {
    setConfirmOpen(false);
    const wasEnded = projectEnded;
    toggleProjectEnd(undefined, {
      onSuccess: () => {
        toast.success(
          wasEnded ? 'Проект возвращен в работу' : 'Проект успешно завершен'
        );
        setConfirmOpen(false);
      },
      onError: () => {
        toast.error('Не удалось изменить статус проекта');
        setConfirmOpen(false);
      },
    });
  };

  const dialogTitle = projectEnded
    ? 'Вернуть проект в работу?'
    : 'Завершить проект?';
  const dialogDescription = projectEnded
    ? 'Редактирование снова станет доступным.'
    : 'После завершения нельзя создавать/редактировать/удалять задачи.';
  const dialogConfirm = projectEnded ? 'Вернуть' : 'Завершить';

  return (
    <ProjectLockProvider
      value={{
        locked: Boolean(optimisticProject.endedAt),
        reason: `Проект закрыт`,
      }}
    >
      <article className="space-y-4">
        {isProjectLoading && 'Загрузка...'}
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
                  label: `${optimisticProject.name}`,
                  href: clientRoutes.projectPage(
                    optimisticProject.id,
                    workspaceId
                  ),
                },
              ]}
            />
            {projectEnded && <ProjectEnd />}
          </div>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <RippleButton
                isLoading={isToggleProjectPending}
                className={cn(
                  'min-w-10',
                  projectEnded ? 'bg-primary-500 text-white' : 'bg-zinc-800'
                )}
                disabled={isToggleProjectPending}
              >
                {projectEnded ? 'Вернуть проект' : 'Завершить проект'}
              </RippleButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription>{dialogDescription}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isToggleProjectPending}
                  onClick={() => setConfirmOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  variant={projectEnded ? 'default' : 'destructive'}
                  disabled={isToggleProjectPending}
                  onClick={onCloseProjectHandle}
                >
                  {dialogConfirm}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Heading>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <Description text={optimisticProject.description || null} />
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
            projectId={optimisticProject.id}
            allTaskStats={allTaskStats}
            memberTaskStats={memberTaskStats}
            projectEnd={projectEnded}
          />
        </div>
      </article>
    </ProjectLockProvider>
  );
};

export default ProjectComponent;

const ProjectEnd = () => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Badge variant={'info'}>Проект завершен</Badge>
        </TooltipTrigger>
        <TooltipContent>Проект закрыт. Изменения недоступны.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '../../ui/heading';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';

import ProjectCardBadge from './project-card-badge';
import { useProject } from '@/hooks/project/use-project';
import EditProjectPopover from './edit-project-popover';

const ProjectCard = ({
  title,
  description,
  projectId,
  workspaceId,
  // tasksTotal,
  // tasksDone,
  // tasksInProgress,
  // tasksToDoCount,
  // tasksOverdue,
}: {
  title: string;
  description: string;
  projectId: number;
  workspaceId: number;
  // tasksTotal: number;
  // tasksDone: number;
  // tasksInProgress: number;
  // tasksToDoCount: number;
  // tasksOverdue: number;
}) => {
  const { data: stats, isLoading } = useProject(projectId);

  const tasksCount = stats?.tasksCount ?? 0;
  const tasksToDoCount = stats?.tasksToDoCount ?? 0;
  const tasksInProgressCount = stats?.tasksInProgressCount ?? 0;
  const tasksDoneCount = stats?.tasksDoneCount ?? 0;
  const tasksBlockedCount = stats?.tasksBlockedCount ?? 0;
  const tasksOverdueCount = stats?.tasksOverdueCount ?? 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-start justify-between gap-2">
            <Heading className="text-bold" level={2}>
              <Link
                className="flex items-center justify-between"
                href={clientRoutes.projectPage(workspaceId, projectId)}
              >
                <span className="underline-anim truncate max-w-full min-w-fit">
                  {title}
                </span>
              </Link>
            </Heading>
            <EditProjectPopover
              projectId={projectId}
              workspaceId={workspaceId}
              projectName={title}
              projectDescription={description}
            />
          </div>
        </CardTitle>
        <CardDescription className="block line-clamp-2 break-words">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="block bg-zinc-50 px-4 py-2 ">
        <Heading level={6} className="text-zinc-400 mb-2">
          Задачи
        </Heading>
        <div className=" flex flex-wrap gap-1 ">
          <div className="flex flex-wrap gap-1">
            <ProjectCardBadge
              variant="default"
              text="Всего"
              value={tasksCount}
            />

            <ProjectCardBadge
              variant="success"
              text="Выполненные"
              value={tasksDoneCount}
            />

            <ProjectCardBadge
              variant="primary"
              text="В работе"
              value={tasksInProgressCount}
            />

            <ProjectCardBadge
              variant="info"
              text="Новые"
              value={tasksToDoCount}
            />

            <ProjectCardBadge
              variant="destructive"
              text="Просроченные"
              value={tasksOverdueCount}
            />

            <ProjectCardBadge
              variant="warning"
              text="Заблокированные"
              value={tasksBlockedCount}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;

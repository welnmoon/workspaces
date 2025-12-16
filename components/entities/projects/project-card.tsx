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
import EditProjectPopover from './edit-project-popover';
import EmptyState from '@/components/empty-state';
import { useProjectStats } from '@/hooks/project/use-project-stats';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ProjectCard = ({
  title,
  description,
  projectId,
  workspaceId,
  projectEnd,
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
  projectEnd?: boolean;
  // tasksTotal: number;
  // tasksDone: number;
  // tasksInProgress: number;
  // tasksToDoCount: number;
  // tasksOverdue: number;
}) => {
  const { data: stats, isLoading } = useProjectStats(projectId);
  const isEnded = Boolean(projectEnd);

  const tasksCount = stats?.tasksCount ?? 0;
  const tasksToDoCount = stats?.tasksToDoCount ?? 0;
  const tasksInProgressCount = stats?.tasksInProgressCount ?? 0;
  const tasksDoneCount = stats?.tasksDoneCount ?? 0;
  const tasksBlockedCount = stats?.tasksBlockedCount ?? 0;
  const tasksOverdueCount = stats?.tasksOverdueCount ?? 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className={cn('h-fit', isEnded && 'bg-zinc-50')}>
        <CardTitle>
          <div className="flex items-start justify-between gap-2">
            <Heading className="text-bold" level={2}>
              <Link
                className="flex items-center justify-between"
                href={clientRoutes.projectPage(workspaceId, projectId)}
              >
                <span className="underline-anim max-w-full wrap-break-word line-clamp-2">
                  {title}
                </span>
              </Link>
              {isEnded && <Badge variant="info">Завершен</Badge>}
            </Heading>
            <EditProjectPopover
              projectId={projectId}
              workspaceId={workspaceId}
              projectName={title}
              projectDescription={description}
            />
          </div>
        </CardTitle>
        <CardDescription className="block line-clamp-2 wrap-break-word">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="block bg-zinc-50 px-4 py-2 flex-1">
        <Heading level={6} className="text-zinc-400 mb-2">
          Задачи
        </Heading>
        {isLoading && <StatsSkeleton />}
        {!isLoading && (
          <div className=" flex flex-wrap gap-1 ">
            {tasksCount === 0 && (
              <EmptyState
                title="Нет задач"
                subtitle="Задач нет — самое время начать"
                icon=""
                className="w-full py-2"
              />
            )}
            {tasksCount > 0 && (
              <>
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
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;

function StatsSkeleton() {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2 animate-pulse">
        {/* Всего */}
        <div className="h-3 w-16 bg-zinc-200 rounded-md" />
        {/* Выполненные */}
        <div className="h-3 w-24 bg-zinc-200 rounded-md" />
        {/* В работе */}
        <div className="h-3 w-20 bg-zinc-200 rounded-md" />
        {/* Новые */}
        <div className="h-3 w-20 bg-zinc-200 rounded-md" />
        {/* Просроченные */}
        <div className="h-3 w-28 bg-zinc-200 rounded-md" />
        {/* Заблокированные */}
        <div className="h-3 w-32 bg-zinc-200 rounded-md" />
      </div>
    </div>
  );
}

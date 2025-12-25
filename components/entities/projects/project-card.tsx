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
import { ReactNode } from 'react';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Progress } from '@/components/ui/progress';
import EditProjectPopover from './edit-project-popover';
import EmptyState from '@/components/empty-state';
import { useProjectStats } from '@/hooks/project/use-project-stats';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  AlarmClock,
  BadgeInfo,
  CheckCircle2,
  FolderKanban,
  InfoIcon,
  Loader,
  PlusCircle,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ProjectCardProps = {
  title: string;
  description: string;
  projectId: number;
  workspaceId: number;
  projectEnd?: boolean;
  noActions?: boolean;
  noLink?: boolean;
};

const ProjectCard = ({
  title,
  description,
  projectId,
  workspaceId,
  projectEnd,
  noActions = false,
  noLink = false,
}: ProjectCardProps) => {
  const { data: stats, isLoading } = useProjectStats(projectId);
  const isEnded = Boolean(projectEnd);

  const tasksCount = stats?.tasksCount ?? 0;
  const tasksToDoCount = stats?.tasksToDoCount ?? 0;
  const tasksInProgressCount = stats?.tasksInProgressCount ?? 0;
  const tasksDoneCount = stats?.tasksDoneCount ?? 0;
  const tasksBlockedCount = stats?.tasksBlockedCount ?? 0;
  const tasksOverdueCount = stats?.tasksOverdueCount ?? 0;
  const sprintsCount = stats?.sprintsCount ?? 0;
  const progress =
    tasksCount > 0 ? Math.round((tasksDoneCount / tasksCount) * 100) : 0;
  const hasStats =
    tasksCount > 0 ||
    tasksToDoCount > 0 ||
    tasksInProgressCount > 0 ||
    tasksDoneCount > 0 ||
    tasksBlockedCount > 0 ||
    tasksOverdueCount > 0 ||
    sprintsCount > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className={cn('h-fit', isEnded && 'bg-zinc-50')}>
        <CardTitle>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Heading className="text-bold" level={4}>
              {noLink ? (
                <span className="underline-anim max-w-full wrap-break-word line-clamp-2">
                  {title}
                </span>
              ) : (
                <Link
                  className="flex items-center justify-between"
                  href={clientRoutes.projectPage(workspaceId, projectId)}
                >
                  <span className="underline-anim max-w-full wrap-break-word line-clamp-2">
                    {title}
                  </span>
                </Link>
              )}
              {isEnded && <Badge variant="info">Завершен</Badge>}
            </Heading>
            {!noActions && (
              <EditProjectPopover
                projectId={projectId}
                workspaceId={workspaceId}
                projectName={title}
                projectDescription={description}
              />
            )}
          </div>
          {tasksCount > 0 && <Progress value={progress} className="mt-1" />}
        </CardTitle>
        <CardDescription className="block line-clamp-2 wrap-break-word">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="block bg-zinc-50 px-4 py-2 flex-1">
        <Heading level={6} className="text-zinc-500 mb-2 font-semibold">
          Сводка проекта
        </Heading>
        {isLoading && <StatsSkeleton />}
        {!isLoading && (
          <TooltipProvider>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {!hasStats && (
                <EmptyState
                  title="Нет данных"
                  subtitle="Добавьте задачи или спринты, чтобы увидеть метрики."
                  icon=""
                  className="w-full py-2"
                />
              )}
              {hasStats && (
                <>
                  <IconStat
                    icon={<FolderKanban className="h-4 w-4 text-indigo-600" />}
                    label="Спринты"
                    value={sprintsCount}
                    tooltip="Количество спринтов в проекте"
                  />
                  <IconStat
                    icon={<BadgeInfo className="h-4 w-4" />}
                    label="Всего"
                    value={tasksCount}
                    tooltip="Всего задач в проекте"
                  />
                  <IconStat
                    icon={<Loader className="h-4 w-4 text-blue-500" />}
                    label="В работе"
                    value={tasksInProgressCount}
                    tooltip="Задачи в статусе In Progress"
                  />
                  <IconStat
                    icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    label="Выполнено"
                    value={tasksDoneCount}
                    tooltip="Завершенные задачи"
                  />
                  <IconStat
                    icon={<PlusCircle className="h-4 w-4 text-blue-500" />}
                    label="Новые"
                    value={tasksToDoCount}
                    tooltip="Новые/ожидающие задачи"
                  />
                  <IconStat
                    icon={<AlarmClock className="h-4 w-4 text-red-500" />}
                    label="Просроченные"
                    value={tasksOverdueCount}
                    tooltip="Срок задачи истек"
                  />
                  <IconStat
                    icon={<InfoIcon className="h-4 w-4 text-amber-600" />}
                    label="Заблокировано"
                    value={tasksBlockedCount}
                    tooltip="Задачи в статусе Blocked"
                  />
                </>
              )}
            </div>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;

function StatsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 animate-pulse">
      <div className="h-4 w-20 bg-zinc-200 rounded-md" />
      <div className="h-4 w-20 bg-zinc-200 rounded-md" />
      <div className="h-4 w-24 bg-zinc-200 rounded-md" />
      <div className="h-4 w-24 bg-zinc-200 rounded-md" />
      <div className="h-4 w-24 bg-zinc-200 rounded-md" />
    </div>
  );
}

function IconStat({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tooltip: string;
}) {
  if (value === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm border border-zinc-200 cursor-default">
          {icon}
          <span className="font-medium text-foreground">{value}</span>
          <span className="text-[11px] text-muted-foreground">{label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

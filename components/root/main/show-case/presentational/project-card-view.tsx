'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
import { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';

type ProjectCardViewProps = {
  title: string;
  description?: string | null;
  ended?: boolean;
  tasksTotal?: number;
  tasksDone?: number;
  tasksInProgress?: number;
  tasksToDo?: number;
  tasksOverdue?: number;
  tasksBlocked?: number;
  sprintsCount?: number;
};

export function ProjectCardView({
  title,
  description,
  ended = false,
  tasksTotal,
  tasksDone,
  tasksInProgress,
  tasksToDo,
  tasksOverdue,
  tasksBlocked,
  sprintsCount = 0,
}: ProjectCardViewProps) {
  const total =
    typeof tasksTotal === 'number'
      ? tasksTotal
      : (tasksDone ?? 0) +
        (tasksInProgress ?? 0) +
        (tasksToDo ?? 0) +
        (tasksOverdue ?? 0) +
        (tasksBlocked ?? 0);

  const hasStats =
    total > 0 ||
    sprintsCount > 0 ||
    (tasksDone ?? 0) > 0 ||
    (tasksInProgress ?? 0) > 0 ||
    (tasksToDo ?? 0) > 0 ||
    (tasksOverdue ?? 0) > 0 ||
    (tasksBlocked ?? 0) > 0;
  const progress = total > 0 ? Math.round(((tasksDone ?? 0) / total) * 100) : 0;

  return (
    <Card className="flex flex-col shadow-sm">
      <CardHeader className={cn('h-fit', ended && 'bg-zinc-50')}>
        <CardTitle>
          <div className="flex items-start justify-between gap-2">
            <Heading className="text-bold" level={2}>
              <span className="underline-anim text-[18px] font-semibold leading-tight wrap-break-word line-clamp-2">
                {title}
              </span>
              {ended && <Badge variant="info">Завершен</Badge>}
            </Heading>
          </div>
        </CardTitle>
        {total > 0 && <Progress value={progress} className="mt-1" />}
        {description && (
          <CardDescription className="block line-clamp-2 wrap-break-word text-[14px] font-normal leading-tight">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="block bg-zinc-50 px-4 py-2 flex-1">
        <Heading level={6} className="text-zinc-500 mb-2 font-semibold">
          Сводка проекта
        </Heading>
        <TooltipProvider>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {!hasStats && (
              <span className="text-xs text-muted-foreground">
                Добавьте задачи или спринты, чтобы увидеть метрики.
              </span>
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
                  value={total}
                  tooltip="Всего задач в проекте"
                />
                <IconStat
                  icon={<Loader className="h-4 w-4 text-blue-500" />}
                  label="В работе"
                  value={tasksInProgress ?? 0}
                  tooltip="Задачи в статусе In Progress"
                />
                <IconStat
                  icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  label="Выполнено"
                  value={tasksDone ?? 0}
                  tooltip="Завершенные задачи"
                />
                <IconStat
                  icon={<PlusCircle className="h-4 w-4 text-blue-500" />}
                  label="Новые"
                  value={tasksToDo ?? 0}
                  tooltip="Новые/ожидающие задачи"
                />
                <IconStat
                  icon={<AlarmClock className="h-4 w-4 text-red-500" />}
                  label="Просроченные"
                  value={tasksOverdue ?? 0}
                  tooltip="Срок задачи истек"
                />
                <IconStat
                  icon={<InfoIcon className="h-4 w-4 text-amber-600" />}
                  label="Заблокировано"
                  value={tasksBlocked ?? 0}
                  tooltip="Задачи в статусе Blocked"
                />
              </>
            )}
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
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

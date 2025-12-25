'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '../../ui/heading';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';
import { cn } from '@/lib/utils';
import { taskIsExpired } from '@/helpers/task/isExpired';
import type { UserDTO } from '@/types/prisma/DTO/user';
import { Badge } from '@/components/ui/badge';
import { TASK_PRIORITY_ARRAY, TASK_PRIORITY_LABELS } from '@/const/priority';
import { TaskPriorityDTO } from '@/types/prisma/DTO/tasks';
import { useChangePriority } from '@/hooks/tasks/use-change-priority';
import { priorityIcons } from './task-select-priority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskCardProps {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: number;
  workspaceId: number;
  taskId: number;
  role: string | undefined;
  assignee?: UserDTO | null;
  priority: TaskPriorityDTO;
  noActions?: boolean;
  noLink?: boolean;
}

const priorityColors: Record<TaskPriorityDTO, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function TaskCard({
  title,
  description,
  status,
  dueDate,
  projectId,
  workspaceId,
  taskId,
  role,
  assignee,
  priority,
  noActions = false,
  noLink = false,
}: TaskCardProps) {
  const dueDateFormatted = dueDate
    ? new Date(dueDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const expired = dueDate ? taskIsExpired(new Date(dueDate)) : false;
  const deadline = dueDate
    ? new Date().getDate() - new Date(dueDate).getDate()
    : 0;

  const statusStripeClass = cn(
    'absolute inset-y-0 left-0 w-1 rounded-l-md',
    status === 'DONE'
      ? 'bg-emerald-500'
      : status === 'IN_PROGRESS'
        ? 'bg-blue-500'
        : 'bg-slate-300'
  );

  const statusTextClass = cn(
    'text-[11px] font-medium uppercase tracking-wide',
    status === 'DONE'
      ? 'text-emerald-600'
      : status === 'IN_PROGRESS'
        ? 'text-blue-600'
        : 'text-slate-500'
  );

  const assigneeInitials =
    (assignee?.firstName?.[0] ?? '') + (assignee?.lastName?.[0] ?? '');

  const priorityLabel = TASK_PRIORITY_LABELS[priority];

  const { mutate: onPriorityMutate } = useChangePriority(
    workspaceId,
    projectId
  );
  const changeTaskPriority = () => {
    if (noActions) return;
    const order: TaskPriorityDTO[] = TASK_PRIORITY_ARRAY;
    const currentIndex = order.indexOf(priority);
    const next = order[currentIndex + 1] ?? order[0];
    onPriorityMutate({ priority: next, taskId });
  };

  return (
    <Card
      role={role}
      className={cn(
        'relative flex flex-col gap-1 rounded-md border border-border bg-card',
        'px-3 py-2 text-sm shadow-sm transition-all duration-150'
        // noActions
        //   ? 'hover:translate-y-0 hover:border-border hover:shadow-sm'
        //   : 'hover:-translate-y-[1px] hover:border-primary/40 hover:shadow-md'
      )}
    >
      <span className={statusStripeClass} />

      <CardHeader className="flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-muted-foreground">
            ID: {taskId}
          </span>

          {/* статус + приоритет */}
          <div className="flex gap-2 w-fit">
            <Badge
              variant="outline"
              className="border-none flex justify-center w-full bg-muted px-2 py-0.5 text-[11px] leading-none"
            >
              <span className={statusTextClass}>{status}</span>
            </Badge>

            {noActions ? (
              <Badge
                aria-disabled
                variant="outline"
                className={cn(
                  'ml-auto flex items-center w-fit gap-1 justify-center border px-2 py-0.5 text-[11px]',
                  priorityColors[priority],
                  'cursor-default'
                )}
              >
                {priorityIcons[priority]}
              </Badge>
            ) : (
              <TooltipProvider>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <Badge
                      onClick={changeTaskPriority}
                      variant="outline"
                      className={cn(
                        'ml-auto flex items-center w-fit gap-1 justify-center border px-2 py-0.5 text-[11px]',
                        priorityColors[priority]
                      )}
                    >
                      {priorityIcons[priority]}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs text-xs text-center"
                  >
                    <div className="font-medium  text-white">
                      {priorityLabel}
                    </div>
                    <div className="text-zinc-500 mt-1">
                      Нажми для смены приоритета.
                    </div>
                    <div className="text-zinc-500 mt-1">
                      Участники с ролью Member не могут менять приоритет.
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <CardTitle className="mt-0.5">
          <Heading
            level={2}
            className="text-[13px] font-semibold text-foreground leading-snug"
          >
            {noLink ? (
              <span className="block min-w-0 truncate max-w-full">{title}</span>
            ) : (
              <Link
                href={clientRoutes.taskPage(workspaceId, projectId, taskId)}
                className="underline-anim block min-w-0"
              >
                <span className="block truncate max-w-full">{title}</span>
              </Link>
            )}
          </Heading>
        </CardTitle>

        {description && (
          <p className="line-clamp-2 text-[12px] text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="mt-2 flex items-center justify-between gap-2 p-0">
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Срок</span>
          </span>
          <span
            className={cn(
              'text-[12px]',
              expired ? 'text-red-600 font-medium' : 'text-foreground'
            )}
          >
            {dueDate ? dueDateFormatted : 'Нет срока'}
          </span>
          {dueDate && expired && (
            <span className="text-[11px] text-muted-foreground">
              {deadline === 0 && 'Сегодня'}
              {deadline > 0 && `Просрочено на ${Math.abs(deadline)} дн.`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {assignee && (
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                {assigneeInitials || '?'}
              </div>
              <span className="max-w-[120px] truncate text-[11px] text-muted-foreground">
                {assignee.firstName} {assignee.lastName}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-1 border-t pt-1.5 px-0 pb-0 text-[11px] text-muted-foreground flex justify-between">
        <span>
          Проект: {projectId} · Workspace: {workspaceId}
        </span>
      </CardFooter>
    </Card>
  );
}

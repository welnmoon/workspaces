'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TaskPriorityDTO } from '@/types/prisma/DTO/tasks';
import { priorityIcons } from '@/components/entities/tasks/task-select-priority';
import { TASK_PRIORITY_LABELS } from '@/const/priority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TaskCardViewProps = {
  title: string;
  description?: string | null;
  status: string;
  priority: TaskPriorityDTO;
  dueDate?: string | Date | null;
  assigneeLabel?: string | null;
  projectLabel?: string | null;
  workspaceLabel?: string | null;
  taskId?: number;
};

const priorityColors: Record<TaskPriorityDTO, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function TaskCardView({
  title,
  description,
  status,
  priority,
  dueDate,
  assigneeLabel,
  projectLabel,
  workspaceLabel,
  taskId,
}: TaskCardViewProps) {
  const dueDateFormatted = dueDate
    ? new Date(dueDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const expired = dueDate ? new Date(dueDate) < new Date() : false;
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

  const priorityLabel = TASK_PRIORITY_LABELS[priority];

  const assigneeInitials = assigneeLabel
    ? assigneeLabel
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <TooltipProvider>
      <Card
        className={cn(
          'relative flex flex-col gap-1 rounded-md border border-border bg-card',
          'px-3 py-2 text-sm shadow-sm',
          'transition-all duration-150 hover:-translate-y-[1px] hover:border-primary/40 hover:shadow-md'
        )}
      >
        <span className={statusStripeClass} />

        <CardHeader className="flex flex-col gap-1 p-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">
              ID: {taskId ?? '—'}
            </span>

            <div className="flex gap-2 w-fit">
              <Badge
                variant="outline"
                className="border-none flex justify-center w-full bg-muted px-2 py-0.5 text-[11px] leading-none"
              >
                <span className={statusTextClass}>{status}</span>
              </Badge>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={cn(
                      'ml-auto flex items-center w-fit gap-1 justify-center border px-2 py-0.5 text-[11px]',
                      priorityColors[priority]
                    )}
                  >
                    {priorityIcons[priority]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">{priorityLabel}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <CardTitle className="mt-0.5">
            <Heading
              level={2}
              className="text-[13px] font-semibold text-foreground leading-snug"
            >
              <span className="underline-anim block min-w-0">
                <span className="block text-[18px] truncate max-w-full">{title}</span>
              </span>
            </Heading>
          </CardTitle>

          {description && (
            <p className="line-clamp-2 text-[14px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </CardHeader>

        <CardContent className="mt-2 flex items-center justify-between gap-2 p-0">
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>Срок</span>
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    'text-[12px]',
                    expired ? 'text-red-600 font-medium' : 'text-foreground'
                  )}
                >
                  {dueDate ? dueDateFormatted : 'Нет срока'}
                </span>
              </TooltipTrigger>
              {dueDate && (
                <TooltipContent side="bottom">Дедлайн задачи</TooltipContent>
              )}
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            {assigneeLabel && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                      {assigneeInitials || '?'}
                    </div>
                    <span className="max-w-[120px] truncate text-[11px] text-muted-foreground">
                      {assigneeLabel}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Исполнитель задачи
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-1 border-t pt-1.5 px-0 pb-0 text-[11px] text-muted-foreground flex justify-between">
          <span>
            {projectLabel ? `Проект: ${projectLabel}` : 'Без проекта'}
          </span>
          <span>{workspaceLabel ? `Workspace: ${workspaceLabel}` : ''}</span>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

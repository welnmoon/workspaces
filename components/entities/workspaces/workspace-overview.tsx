import {
  Users,
  FolderKanban,
  ListTodo,
  Loader,
  CheckCircle2,
  PlusCircle,
  AlarmClock,
  BadgeInfo,
  Shield,
  BadgeCheck,
  InfoIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { clientRoutes } from '@/lib/routes/client-routes';

import type { TariffConfig } from '@/types/prisma/DTO/payment';
import type { FullRoleDTO } from '@/types/prisma/DTO/role';

type WorkspaceOverviewProps = {
  membersCount: number;
  projectsCount: number;
  tasksTotal: number;
  tasksInProgress: number;
  tasksDone: number;
  tasksToDoCount: number;
  tasksOverdue: number;
  userRole: FullRoleDTO;
  tariff: TariffConfig;
  workspaceId: number;
};

const WorkspaceOverview = ({
  membersCount,
  projectsCount,
  tasksTotal,
  tasksInProgress,
  tasksDone,
  tasksToDoCount,
  tasksOverdue,
  userRole,
  tariff,
  workspaceId,
}: WorkspaceOverviewProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground ">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-4">
          {/* Members */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-default">
                <Users size={16} />
                <b>{membersCount}</b>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Участники</TooltipContent>
          </Tooltip>

          {/* Projects */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-default">
                <FolderKanban size={16} />
                <b>{projectsCount}</b>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Проекты</TooltipContent>
          </Tooltip>
        </div>

        {/* Tasks block */}
        <div className="bg-zinc-100 px-2 py-1 rounded-md flex w-fit gap-3 items-center">
          <ListTodo size={16} className="text-zinc-400" />

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-default">
                <BadgeInfo size={14} />
                <b>{tasksTotal}</b>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Всего задач</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-default">
                <Loader size={14} />
                <b>{tasksInProgress}</b>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">В работе</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-default">
                <CheckCircle2 size={14} className="text-green-500" />
                <b className="text-green-500">{tasksDone}</b>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Выполненные</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-default">
                <PlusCircle size={14} className="text-blue-500" />
                <b className="text-blue-500">{tasksToDoCount}</b>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Новые</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-default">
                <AlarmClock size={14} className="text-red-500" />
                <b className="text-red-500">{tasksOverdue}</b>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Просроченные</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          {/* Role */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-primary-100 rounded-md px-2 py-1 flex items-center gap-1 cursor-default">
                <Shield size={16} />
                <span className="font-medium">{userRole}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">Ваша роль</TooltipContent>
          </Tooltip>

          {/* Tariff */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="rounded-md px-2 py-1 flex items-center gap-1 cursor-default"
                style={{
                  backgroundColor: tariff.color,
                  color: tariff.textColor,
                }}
              >
                <BadgeCheck size={16} />
                <span className="font-medium">{tariff.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">Тарифный план</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={clientRoutes.workspaceActivityPage(workspaceId)}
                className="inline-flex items-center gap-1 text-primary-600 underline underline-offset-4 hover:text-primary-700 transition-colors"
              >
                Журнал аудита <ArrowUpRight size={14} />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="max-w-64 py-3 text-pretty">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <InfoIcon className="size-4" />
                  <p className="text-sm font-medium">Журнал активности</p>
                </div>
                <p className="text-background/80">
                  Хронология ключевых действий в рабочем пространстве: изменения
                  задач, проектов и активности участников.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceOverview;

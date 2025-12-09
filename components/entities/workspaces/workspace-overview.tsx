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
} from 'lucide-react';

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
}: WorkspaceOverviewProps) => {
  return (
    <div className="flex gap-4 text-sm text-muted-foreground items-center">
      {/* Members */}
      <span className="flex items-center gap-1">
        <Users size={16} />
        <b>{membersCount}</b>
      </span>

      {/* Projects */}
      <span className="flex items-center gap-1">
        <FolderKanban size={16} />
        <b>{projectsCount}</b>
      </span>

      {/* Tasks block */}
      <div className="bg-zinc-100 px-2 py-1 rounded-md flex gap-3 items-center">
        <ListTodo size={16} className="text-zinc-400" />

        <span className="flex items-center gap-1">
          <BadgeInfo size={14} />
          <b>{tasksTotal}</b>
        </span>

        <span className="flex items-center gap-1">
          <Loader size={14} />
          <b>{tasksInProgress}</b>
        </span>

        <span className="flex items-center gap-1">
          <CheckCircle2 size={14} className="text-green-500" />
          <b className="text-green-500">{tasksDone}</b>
        </span>

        <span className="flex items-center gap-1">
          <PlusCircle size={14} className="text-blue-500" />
          <b className="text-blue-500">{tasksToDoCount}</b>
        </span>

        <span className="flex items-center gap-1">
          <AlarmClock size={14} className="text-red-500" />
          <b className="text-red-500">{tasksOverdue}</b>
        </span>
      </div>

      {/* Role */}
      <div className="bg-primary-100 rounded-md px-2 py-1 flex items-center gap-1">
        <Shield size={16} />
        <span className="font-medium">{userRole}</span>
      </div>

      {/* Tariff */}
      <div
        className="rounded-md px-2 py-1 flex items-center gap-1"
        style={{
          backgroundColor: tariff.color,
          color: tariff.textColor,
        }}
      >
        <BadgeCheck size={16} />
        <span className="font-medium">{tariff.name}</span>
      </div>
    </div>
  );
};

export default WorkspaceOverview;

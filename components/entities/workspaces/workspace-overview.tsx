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
      <span>
        Участников: <b>{membersCount}</b>
      </span>
      <span>
        Проектов: <b>{projectsCount}</b>
      </span>
      <div className="bg-zinc-100 px-2 py-1 rounded-md flex gap-3">
        <span className="text-zinc-400 ">Задачи</span>
        <span>
          Всего: <b>{tasksTotal}</b>
        </span>
        <span>
          В работе: <b>{tasksInProgress}</b>
        </span>
        <span>
          Выполненные: <b className="text-green-500">{tasksDone}</b>
        </span>
        <span>
          Новые: <b className="text-blue-500">{tasksToDoCount}</b>
        </span>
        <span>
          Просроченные: <b className="text-red-500">{tasksOverdue}</b>
        </span>
      </div>

      <div className="bg-primary-100 rounded-md px-2 py-1">
        Ваша роль: <span className="font-medium">{userRole}</span>
      </div>
      <div
        className="rounded-md px-2 py-1"
        style={{
          backgroundColor: tariff.color,
          color: tariff.textColor,
        }}
      >
        План: <span className="font-medium">{tariff.name}</span>
      </div>
    </div>
  );
};

export default WorkspaceOverview;

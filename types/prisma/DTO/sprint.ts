import { Prisma, Sprint, SprintColor } from '@prisma/client';

export type SprintFullDTO = Sprint;

export type SprintWithTasksWithAssigneesDTO = Prisma.SprintGetPayload<{
  include: {
    tasks: {
      include: {
        assignee: true;
      };
    };
  };
}>;

export type SprintTasksStatsDTO = {
  tasksCount: number;
  tasksToDoCount: number;
  tasksInProgressCount: number;
  tasksDoneCount: number;
  tasksBlockedCount: number;
  tasksOverdueCount: number;
};

export type SprintColorDTO = SprintColor;

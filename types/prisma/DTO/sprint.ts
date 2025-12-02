import { Prisma, Sprint } from '@prisma/client';

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

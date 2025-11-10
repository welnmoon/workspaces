import { TaskStatus } from '@prisma/client';

export type TaskFilters = {
  status?: TaskStatus;
  overdue?: boolean;
  fromDate?: Date;
  toDate?: Date;
  assigneeId?: string;
  todo?: boolean;
  done?: boolean;
  inProgress?: boolean;
};

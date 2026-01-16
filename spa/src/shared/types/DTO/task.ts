import type { TaskStatus } from './workspace';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskAssigneeDTO = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

export type TaskSprintRef = {
  id: number;
  name: string;
};

export type TaskProjectRef = {
  id: number;
  name: string;
  workspace: {
    id: number;
    name: string;
  };
};

export interface TaskDTO {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: number;
  sprintId: number | null;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  project: TaskProjectRef;
  sprint: TaskSprintRef | null;
  assignee: TaskAssigneeDTO | null;
}

export type TaskResponse = {
  data: TaskDTO[];
};

export type TaskItemResponse = {
  data: TaskDTO;
};

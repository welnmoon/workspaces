import type { TaskStatus } from './workspace';

export type SprintProjectRef = {
  id: number;
  name: string;
  workspace: {
    id: number;
    name: string;
  };
};

export type SprintTaskSummary = {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate: string | null;
  assignee: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email?: string | null;
  } | null;
};

export interface SprintDTO {
  id: number;
  name: string;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  project: SprintProjectRef;
  tasks: SprintTaskSummary[];
}

export type SprintsResponse = {
  data: SprintDTO[];
};

export type SprintResponse = {
  data: SprintDTO;
};

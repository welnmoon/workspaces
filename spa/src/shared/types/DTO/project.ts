import type { TaskPriority } from './task';
import type { TaskStatus } from './workspace';

export type ProjectWorkspaceRef = {
  id: number;
  name: string;
};

export type ProjectAssigneeRef = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email?: string | null;
};

export type ProjectSprintSummary = {
  id: number;
  name: string;
  goal?: string | null;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectTaskSummary = {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: ProjectAssigneeRef | null;
};

export interface ProjectDTO {
  id: number;
  name: string;
  description: string | null;
  workspaceId: number;
  createdAt: string;
  updatedAt: string;
  endedAt: string | null;
  workspace: ProjectWorkspaceRef;
  sprints: ProjectSprintSummary[];
  tasks: ProjectTaskSummary[];
}

export type ProjectFullTask = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  sprintId: number | null;
  assignee: ProjectAssigneeRef | null;
  sprint: {
    id: number;
    name: string;
  } | null;
};

export interface ProjectFullDTO extends Omit<ProjectDTO, 'sprints' | 'tasks'> {
  sprints: ProjectSprintSummary[];
  tasks: ProjectFullTask[];
}

export type ProjectsResponse = {
  data: ProjectDTO[];
};

export type ProjectResponse = {
  data: ProjectFullDTO;
};

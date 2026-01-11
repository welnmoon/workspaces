export interface WorkspaceDTO {
  name: string;
  id: number;
  description: string | null;
  avatarUrl: string | null;
  projects: {
    name: string;
    id: number;
    tasks: {
      status: TaskStatus;
      title: string;
    }[];
  }[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

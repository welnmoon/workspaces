export interface WorkspaceDTO {
  id: number;
  name: string;
  description: string | null;
  ownerId: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  Project: {
    name: string;
    id: number;
    description: string | null;
    workspaceId: number;
    createdAt: Date;
    updatedAt: Date;
    endedAt: Date | null;
    Task: {
      status: TaskStatus;
      title: string;
    }[];
  }[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

export type WorkspaceFullDTO = WorkspaceDTO & {
  createdAt: Date;
  updatedAt: Date;
};

// {
//     "id": 26,
//     "name": "Alpha Team",
//     "description": "",
//     "ownerId": "cmhnbfvzu0000usjcsnnp6e3f", -
//     "avatarUrl": "/images/workspaces/avatar/avatar_14.jpeg",
//     "createdAt": "2025-11-30T03:20:53.063Z",
//     "updatedAt": "2025-12-01T10:57:39.811Z"
//   },

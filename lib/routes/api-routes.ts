import { register } from 'module';
import { ProviderId } from '../providers';

export const apiRoutes = {
  createProject: (workspaceId: number) => `/api/w/${workspaceId}/projects`,
  someProject: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}`,
  createTask: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks`,
  createWorkspace: () => `/api/w`,
  updateWorkspace: (workspaceId: number) => `/api/w/${workspaceId}`,
  createInvitation: (workspaceId: number) => `/api/w/${workspaceId}/inviations`,
  getWorkspace: (workspaceId: number) => `/api/w/${workspaceId}`,
  getWorkspaces: () => `/api/w`,
  getProjects: (workspaceId: number) => `/api/w/${workspaceId}/projects`,
  getTasks: (workspaceId: string, projectId: string) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks`,
  getUser: (id: string) => `/api/user/${id}`,
  changeUserPassword: () => `/api/auth/password`,
  deleteUserAccount: (provider: ProviderId) => `/api/auth/accounts/${provider}`,
  register: () => `/api/auth/register`,

  // Invitations
  acceptInvitationById: (workspaceId: number, invId: number) =>
    `/api/w/${workspaceId}/invitations/${invId}/accept`,
  getReceivedInvitations: (userId: string) => `/api/user/${userId}/invitations`,
};

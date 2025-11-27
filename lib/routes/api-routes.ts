import { ProviderId } from '../providers';

export const apiRoutes = {
  createProject: (workspaceId: number) => `/api/w/${workspaceId}/projects`,
  someProject: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}`,
  getProjects: (workspaceId: number) => `/api/w/${workspaceId}/projects`,
  getProjectTasksStats: (projectId: number) =>
    `/api/project/${projectId}/stats`,

  createWorkspace: () => `/api/w`,
  updateWorkspace: (workspaceId: number) => `/api/w/${workspaceId}`,
  getWorkspace: (workspaceId: number) => `/api/w/${workspaceId}`,
  getWorkspaces: () => `/api/w`,
  changeWorkspaceName: (workspaceId: number) =>
    `/api/w/${workspaceId}/change-name`,
  deleteWorkspace: (workspaceId: number) => `/api/w/${workspaceId}/delete`,

  getWorkspaceMemberRole: (workspaceId: number) =>
    `/api/w/${workspaceId}/members/role`,

  // Tasks
  getTasks: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks`,
  updateTaskStatus: (taskId: number) => `/api/task/${taskId}/update-status`,
  createTask: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks`,

  getUser: (id: string) => `/api/user/${id}`,
  changeUserPassword: () => `/api/auth/password`,
  deleteUserAccount: (provider: ProviderId) => `/api/auth/accounts/${provider}`,
  register: () => `/api/auth/register`,

  // Invitations
  acceptInvitationById: (workspaceId: number, invId: number) =>
    `/api/w/${workspaceId}/invitations/${invId}/accept`,
  getReceivedInvitations: (userId: string) => `/api/user/${userId}/invitations`,
  createInvitation: (workspaceId: number) =>
    `/api/w/${workspaceId}/invitations`,

  // Notifications
  getNotifications: (userId: string) => `/api/user/${userId}/notifications`,
  markReadNotification: (userId: string, notificationId: number) =>
    `/api/user/${userId}/notifications/${notificationId}/read`,
  deleteNotification: (userId: string, notificationId: number) =>
    `/api/user/${userId}/notifications/${notificationId}/delete`,

  // member
  editMember: (memberId: number) => `/api/members/${memberId}/edit`,
  deleteMember: (memberId: number) => `/api/members/${memberId}/delete`,
};

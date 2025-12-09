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
  getTasksWithAssignee: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks/with-assignee`,
  getSprintTasks: (workspaceId: number, projectId: number, sprintId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/sprints/${sprintId}/tasks`,
  updateTaskStatus: (taskId: number) => `/api/task/${taskId}/update-status`,
  createTask: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks`,
  changePriority: (workspaceId: number, projectId: number, taskId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks/${taskId}/change-priority`,
  deleteTasksBulk: () => `/api/task/bulk-delete`,
  deleteTask: (workspaceId: number, projectId: number, taskId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
  moveTask: (workspaceId: number, projectId: number, taskId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks/${taskId}/move`,

  // Sprint
  createSprint: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/sprints/create`,
  getSprints: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/sprints`,
  getSprintTasksStats: (
    workspaceId: number,
    projectId: number,
    sprintId: number
  ) => `/api/w/${workspaceId}/projects/${projectId}/sprints/${sprintId}/stats`,

  changeSprintDates: (
    workspaceId: number,
    projectId: number,
    sprintId: number
  ) =>
    `/api/w/${workspaceId}/projects/${projectId}/sprints/${sprintId}/change-dates`,
  changeSprintColor: (
    workspaceId: number,
    projectId: number,
    sprintId: number
  ) =>
    `/api/w/${workspaceId}/projects/${projectId}/sprints/${sprintId}/change-color`,

    // User
  getUser: (id: string) => `/api/user/${id}`,
  changeUserPassword: () => `/api/auth/password`,
  deleteUserAccount: (provider: ProviderId) => `/api/auth/accounts/${provider}`,

  // auth
  register: () => `/api/auth/register`,
  registerWithProvider: (providerId: ProviderId) =>
    `/api/auth/register/${providerId}`,

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
  hiddenNotification: (userId: string, notificationId: number) =>
    `/api/user/${userId}/notifications/${notificationId}/hidden`,
  sendNotificationsToWMembers: (workspaceId: number) =>
    `/api/w/${workspaceId}/members/notifications`,
  getNotificationPages: (userId: string) =>
    `/api/user/${userId}/notifications/pages`,

  // member
  editMember: (memberId: number) => `/api/members/${memberId}/edit`,
  deleteMember: (memberId: number) => `/api/members/${memberId}/delete`,
  getMembers: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/members`,
  changeAssignee: (taskId: number, workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks/${taskId}/change-assignee`,
};

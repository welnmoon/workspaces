export const clientRoutes = {
  workspacePage: (workspaceId: number) => `/w/${workspaceId}`,
  projectPage: (workspaceId: number, projectId: number) =>
    `/w/${workspaceId}/projects/${projectId}`,
  projectsPage: (workspaceId: number) => `/w/${workspaceId}/projects`,
  workspaceActivityPage: (workspaceId: number) => `/w/${workspaceId}/activity`,

  taskPage: (workspaceId: number, projectId: number, taskId: number) =>
    `/w/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
  tasksPage: (workspaceId: number, projectId: number) =>
    `/w/${workspaceId}/projects/${projectId}/tasks`,
  workspacesPage: () => `/w`,
  authErrorPage: () => `/auth/error`,
  authRegisterPage: () => `/register`,
  authLoginPage: (returnTo?: string) =>
    returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : `/login`,
  profilePage: () => `/profile`,

            
  pricingPage: () => `/pricing`,

  notificationsPage: () => `/notifications`,
};

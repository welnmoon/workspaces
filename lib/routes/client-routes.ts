export const clientRoutes = {
  workspacePage: (workspaceId: number) => `/w/${workspaceId}`,
  projectPage: (workspaceId: number, projectId: number) =>
    `/w/${workspaceId}/projects/${projectId}`,
  taskPage: (workspaceId: number, projectId: number, taskId: number) =>
    `/w/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
  workspacesPage: () => `/w`,
  authErrorPage: () => `/auth/error`,
  authRegisterPage: () => `/register`,
  authLoginPage: () => `/login`,
};

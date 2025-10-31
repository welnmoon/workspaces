export const apiRoutes = {
  createProject: (workspaceId: number) => `/api/w/${workspaceId}/projects`,
  someProject: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}`,
  createTask: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks`,
  createWorkspace: () => `/api/w`,
  getWorkspace: (workspaceId: number) => `/api/w/${workspaceId}`,
  getWorkspaces: () => `/api/w`,
  getProjects: (workspaceId: number) => `/api/w/${workspaceId}/projects`,
  getTasks: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}/tasks`,
};

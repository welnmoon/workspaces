export const apiRoutes = {
  createProject: (workspaceId: number) =>
    `/api/w/${workspaceId}/projects`,
  someProject: (workspaceId: number, projectId: number) =>
    `/api/w/${workspaceId}/projects/${projectId}`,
};

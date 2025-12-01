export const getIdsFromPathname = (pathname: string) => {
  const workspaceMatch = pathname.match(/\/w\/(\d+)/);
  const projectMatch = pathname.match(/\/projects\/(\d+)/);

  const workspaceId = workspaceMatch ? Number(workspaceMatch[1]) : null;
  const projectId = projectMatch ? Number(projectMatch[1]) : null;

  return { workspaceId, projectId };
};
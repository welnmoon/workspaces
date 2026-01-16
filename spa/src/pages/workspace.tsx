import { Navigate, useParams } from 'react-router-dom';
import WorkspaceEditForm from '../features/workspace-edit/ui/w-edit-form';
import { useGetWorkspaceQuery } from '../entities/workspace/api/workspace.api';
import type { WorkspaceDTO } from '../shared/types/DTO/workspace';

const WorkspacePage = () => {
  const id = useParams().id;
  const { isError, isLoading, error, data } = useGetWorkspaceQuery(id!, {
    skip: !id,
  });

  const workspace = data?.data as WorkspaceDTO;

  if (!workspace && !isLoading) return <Navigate to="/workspaces" replace />;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>User not found {JSON.stringify(error)}</div>;
  return (
    <section>
      {JSON.stringify(error)}
      <WorkspaceEditForm initialValues={workspace} wId={id!} />
    </section>
  );
};

export default WorkspacePage;

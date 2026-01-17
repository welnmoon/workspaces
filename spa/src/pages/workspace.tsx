import { Navigate, useParams } from 'react-router-dom';
import WorkspaceEditForm from '../features/workspace-edit/ui/w-edit-form';
import { useGetWorkspaceQuery } from '../entities/workspace/api/workspace.api';
import type { WorkspaceDTO } from '../shared/types/DTO/workspace';
import PageHeader from '../shared/ui/page-header';

const WorkspacePage = () => {
  const id = useParams().id;
  const { isError, isLoading, error, data } = useGetWorkspaceQuery(id!, {
    skip: !id,
  });

  const workspace = data?.data as WorkspaceDTO | undefined;

  if (!workspace && !isLoading) return <Navigate to="/workspaces" replace />;

  if (isLoading) {
    return (
      <section className="page">
        <PageHeader title="Воркспейс" />
        <div>Loading...</div>
      </section>
    );
  }

  if (isError || !workspace) {
    return (
      <section className="page">
        <PageHeader title="Воркспейс" />
        <div>User not found {JSON.stringify(error)}</div>
      </section>
    );
  }

  return (
    <section className="page">
      <PageHeader title="Воркспейс" />
      <WorkspaceEditForm initialValues={workspace} wId={id!} />
    </section>
  );
};

export default WorkspacePage;

import { useGetWorkspacesQuery } from '../../../entities/workspace/api/workspace.api';
import type { WorkspaceFullDTO } from '../../../shared/types/DTO/workspace';
import { DataTable } from '../../../shared/ui/tables/data-table';
import { workspaceColumns } from '../model/workspace-columns';

const WorkspacesComponent = () => {
  const { data, isLoading, isError, error } = useGetWorkspacesQuery();
  return (
    <section className="w-full card">
      <DataTable<WorkspaceFullDTO, unknown>
        columns={workspaceColumns}
        data={data?.data!}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </section>
  );
};

export default WorkspacesComponent;

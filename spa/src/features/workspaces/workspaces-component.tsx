import { useGetWorkspacesQuery } from '../../app/store/api';
import { DataTable } from '../../shared/ui/tables/data-table';
import type { WorkspaceFullDTO } from '../../types/DTO/workspace';
import { workspaceColumns } from './workspace-columns';

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

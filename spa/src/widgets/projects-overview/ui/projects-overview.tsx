import { useGetProjectsQuery } from '../../../entities/projects/api/projects.api';
import type { ProjectFullDTO } from '../../../shared/types/DTO/project';
import { DataTable } from '../../../shared/ui/tables/data-table';
import { projectColumns } from '../model/projects-columns';

const ProjectsOverview = () => {
  const { data, isLoading, isError, error } = useGetProjectsQuery();
  return (
    <section className="w-full h-full card">
      <DataTable<ProjectFullDTO, unknown>
        columns={projectColumns}
        data={data?.data ?? []}
        error={error}
        isError={isError}
        isLoading={isLoading}
      />
      {data?.data.length === 0 && !isLoading && !isError && (
        <p className="p-4 text-center">No projects found.</p>
      )}
    </section>
  );
};

export default ProjectsOverview;

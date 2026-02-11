import { Navigate, useParams } from 'react-router-dom';
import PageHeader from '../shared/ui/page-header';
import { useGetProjectQuery } from '../entities/projects/api/projects.api';
import ProjectEditForm from '../features/project-edit/ui/use-project-edit-form';

const ProjectPage = () => {
  const pId = Number(useParams<{ id: string }>().id);

  const {
    data: project,
    isLoading,
    isFetching,

    isError,
    error,
  } = useGetProjectQuery(pId!, {
    skip: !pId,
  });

  if (!pId) return <Navigate to="/projects" replace />;

  if (isLoading) {
    return (
      <section className="page">
        <PageHeader title="Пользователь" />
        <div>Loading...</div>
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="page">
        <PageHeader title="Проект" />
        <div>User not found {JSON.stringify(error)}</div>
      </section>
    );
  }

  const mapProject = {
    name: project.name || '',
    description: project.description || '',
    // endedAt: project.endedAt?.toISOString(),
  };

  return (
    <section className="page">
      <PageHeader title="Проект" />
      <ProjectEditForm
        isFetching={isFetching || isLoading}
        pId={pId}
        initialValues={mapProject}
      />
    </section>
  );
};

export default ProjectPage;

// {"data":{"id":7,"name":"Nursultan","description":"","workspaceId":20,"createdAt":"2025-11-14T18:16:50.282Z","updatedAt":"2025-11-14T18:16:50.282Z","endedAt":null,"Sprint":[],"_count":{"Task":1}}}

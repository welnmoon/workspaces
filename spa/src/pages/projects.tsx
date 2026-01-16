import ProjectsOverview from '../widgets/projects-overview/ui/projects-overview';
import PageHeader from '../shared/ui/page-header';

const ProjectsPage = () => {
  return (
    <section className="page">
      <PageHeader title="Проекты" />
      <ProjectsOverview />
    </section>
  );
};

export default ProjectsPage;

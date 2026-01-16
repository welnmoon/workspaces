import WorkspacesComponent from '../widgets/workspaces-overview/ui/workspaces-overview';
import PageHeader from '../shared/ui/page-header';

const WorkspacesPage = () => {
  return (
    <section className="page">
      <PageHeader title="Воркспейсы" />
      <WorkspacesComponent />
    </section>
  );
};

export default WorkspacesPage;

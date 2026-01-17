import PageHeader from '../shared/ui/page-header';

const TasksPage = () => {
  return (
    <section className="page">
      <PageHeader title="Задачи" />
      <div className="page-placeholder">
        <div className="page-placeholder__card">
          <div className="page-placeholder__badge">В разработке</div>
          <p className="page-placeholder__text">
            Страница задач сейчас в работе.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TasksPage;

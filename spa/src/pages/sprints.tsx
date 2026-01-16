import PageHeader from '../shared/ui/page-header';

const SprintsPage = () => {
  return (
    <section className="page">
      <PageHeader title="Спринты" />
      <div className="page-placeholder">
        <div className="page-placeholder__card">
          <div className="page-placeholder__badge">В разработке</div>
          <p className="page-placeholder__text">
            Этот раздел скоро будет доступен.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SprintsPage;

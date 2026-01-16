import UsersComponent from '../widgets/user/ui/users-overview';
import PageHeader from '../shared/ui/page-header';

function UsersPage() {
  return (
    <section className="page">
      <PageHeader title="Пользователи" />
      <UsersComponent />
    </section>
  );
}
export default UsersPage;

import { Navigate, useParams } from 'react-router-dom';
import UserEditForm from '../features/user-edit/ui/user-edit-form';
import { useGetUserQuery } from '../entities/user/api/user.api';
import type { EditUserSchemaType } from '../entities/user/model/schema';
import type { UserFullDTO } from '../shared/types/DTO/user';
import PageHeader from '../shared/ui/page-header';

const UserPage = () => {
  const userId = useParams<{ id: string }>().id;

  const { data, isLoading, isError, error } = useGetUserQuery(userId!, {
    skip: !userId,
  });                                                                

  const user = data?.data as UserFullDTO | undefined;

  if (!userId) return <Navigate to="/users" replace />;

  if (isLoading) {
    return (
      <section className="page">
        <PageHeader title="Пользователь" />
        <div>Loading...</div>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="page">
        <PageHeader title="Пользователь" />
        <div>User not found {JSON.stringify(error)}</div>
      </section>
    );
  }

  const mapUserToEditUser = {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    currentTariff: user.currentTariff as EditUserSchemaType['currentTariff'],
    platformRole: user.platformRole as EditUserSchemaType['platformRole'],
    avatarUrl: user.image ?? '',
    emailVerified: user.emailVerified ?? null,
    password: undefined,
    confirmPassword: undefined,
  } as EditUserSchemaType;

  return (
    <section className="page">
      <PageHeader title="Пользователь" />
      <UserEditForm userId={user.id} initialValues={mapUserToEditUser} />
    </section>
  );
};

export default UserPage;

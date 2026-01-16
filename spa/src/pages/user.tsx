import { Navigate, useParams } from 'react-router-dom';
import UserEditForm from '../features/user-edit/ui/user-edit-form';
import { useGetUserQuery } from '../entities/user/api/user.api';
import type { EditUserSchemaType } from '../entities/user/model/schema';
import type { UserFullDTO } from '../shared/types/DTO/user';

const UserPage = () => {
  const userId = useParams<{ id: string }>().id;

  const { data, isLoading, isError, error } = useGetUserQuery(userId!, {
    skip: !userId,
  }); // skip - запрос не будет отправляться если userId не определен

  const user = data?.data as UserFullDTO;

  if (!userId) return <Navigate to="/users" replace />;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>User not found {JSON.stringify(error)}</div>;

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

  return <UserEditForm userId={user.id} initialValues={mapUserToEditUser} />;
};

export default UserPage;

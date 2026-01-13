import { Navigate, useParams } from 'react-router-dom';
import { useGetUserQuery } from '../app/store/api';
import type { UserFullDTO } from '../types/DTO/user';
import UserEditForm from '../features/user-edit/ui/user-edit-form';
import type { EditUserSchemaType } from '../features/user-edit/model/schema';

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

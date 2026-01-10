import { DataTable } from '../../components/ui/tables/data-table';
import { useGetUsersQuery } from '../../store/api';
import type { UserDTO } from '../../types/DTO/user';
import { userColumns } from './user-columns';

const UsersComponent = () => {
  const { isError, error, isLoading, data: users } = useGetUsersQuery();
  return (
    <>
      <DataTable<UserDTO, unknown>
        columns={userColumns}
        data={users?.data!}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </>
  );
};

export default UsersComponent;

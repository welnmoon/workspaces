import { useGetUsersQuery } from '../../app/store/api';
import { DataTable } from '../../shared/ui/tables/data-table';
import type { UserDTO } from '../../types/DTO/user';
import { userColumns } from './user-columns';

const UsersComponent = () => {
  const { isError, error, isLoading, data: users } = useGetUsersQuery();
  return (
    <section className="w-full card">
      <DataTable<UserDTO, unknown>
        columns={userColumns}
        data={users?.data!}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </section>
  );
};

export default UsersComponent;

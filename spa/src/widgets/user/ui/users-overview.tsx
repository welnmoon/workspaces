import { useGetUsersQuery } from '../../../entities/user/api/user.api';
import type { UserDTO } from '../../../shared/types/DTO/user';
import { DataTable } from '../../../shared/ui/tables/data-table';
import { userColumns } from '../model/user-columns';

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

import { toast } from 'react-toastify';
import { useDeleteUserMutation } from '../../../entities/user/api/user.api';

export const useUserDelete = ({ id }: { id: string }) => {
  const [deleteUser, deleteState] = useDeleteUserMutation();

  const onSubmit = async () => {
    try {
      const res = await deleteUser({ id });
      if (res.error) throw res.error;
      toast.success('User deleted successfully');
    } catch (e) {
      toast.error(`Error deleting user: ${JSON.stringify(e)}`);
    }
  };

  return {
    onSubmit,
    deleteState,
  };
};

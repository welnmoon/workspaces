import { toast } from 'react-toastify';
import { useDeleteSprintMutation } from '../../../entities/sprints/api/sprints.api';

export const useSprintDelete = ({ id }: { id: number }) => {
  const [deleteSprint, deleteState] = useDeleteSprintMutation();

  const onSubmit = async () => {
    try {
      const res = await deleteSprint({ id });
      if (res.error) throw res.error;
      toast.success('Sprint deleted successfully');
    } catch (e) {
      toast.error(`Error deleting sprint: ${JSON.stringify(e)}`);
    }
  };

  return {
    onSubmit,
    deleteState,
  };
};

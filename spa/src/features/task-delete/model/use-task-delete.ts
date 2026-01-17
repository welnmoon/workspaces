import { toast } from 'react-toastify';
import { useDeleteTaskMutation } from '../../../entities/tasks/api/tasks.api';

export const useTaskDelete = ({ id }: { id: number }) => {
  const [deleteTask, deleteState] = useDeleteTaskMutation();

  const onSubmit = async () => {
    try {
      const res = await deleteTask({ id });
      if (res.error) throw res.error;
      toast.success('Task deleted successfully');
    } catch (e) {
      toast.error(`Error deleting task: ${JSON.stringify(e)}`);
    }
  };

  return {
    onSubmit,
    deleteState,
  };
};

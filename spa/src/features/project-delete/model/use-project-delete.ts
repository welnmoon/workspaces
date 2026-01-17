import { toast } from 'react-toastify';
import { useDeleteProjectMutation } from '../../../entities/projects/api/projects.api';

export const useProjectDelete = ({ id }: { id: number }) => {
  const [deleteProject, deleteState] = useDeleteProjectMutation();

  const onSubmit = async () => {
    try {
      const res = await deleteProject({ id });
      if (res.error) throw res.error;
      toast.success('Project deleted successfully');
    } catch (e) {
      toast.error(`Error deleting project: ${JSON.stringify(e)}`);
    }
  };

  return {
    onSubmit,
    deleteState,
  };
};

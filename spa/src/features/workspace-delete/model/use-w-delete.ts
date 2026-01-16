import { toast } from 'react-toastify';
import { useDeleteWorkspaceMutation } from '../../../entities/workspace/api/workspace.api';

export const useWorkspaceDelete = ({ id }: { id: number }) => {
  const [deleteWorkspace, deleteState] = useDeleteWorkspaceMutation();

  const onSubmit = async () => {
    try {
      const res = await deleteWorkspace({ id });
      if (res.error) throw res.error;
      toast.success('Workspace deleted successfully');
    } catch (e) {
      toast.error(`Error deleting workspace: ${JSON.stringify(e)}`);
    }
  };

  return {
    onSubmit,
    deleteState,
  };
};

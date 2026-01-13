import { useForm } from 'react-hook-form';
import type { EditWorkspace } from './schema';
import { useUpdateWorkspaceMutation } from '../api/workspace-edit.api';
type Params = {
  wId: string;
  initialValues?: EditWorkspace;
  onSuccess?: () => void;
};
export const useWorkspaceEdit = ({ wId, initialValues, onSuccess }: Params) => {
  const form = useForm<EditWorkspace>({
    defaultValues: initialValues,
    mode: 'onSubmit',
  });

  const [updateWorkspace, updateState] = useUpdateWorkspaceMutation();

  const onSubmit = form.handleSubmit(async (values) => {
    await updateWorkspace({ id: wId, body: values }).unwrap();
    onSuccess?.();
  });

  return {
    onSubmit,
    form,
    updateState,
  };
};

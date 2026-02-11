import { useForm } from 'react-hook-form';
import {
  editProjectSchema,
  type EditProjectType,
} from '../../../entities/projects/model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProjectMutation } from '../../../entities/projects/api/projects.api';

export const useProjectEdit = ({
  pId,
  initialValues,
  onSuccess,
}: {
  pId: number;
  initialValues?: EditProjectType;
  onSuccess?: () => void;
}) => {
  const form = useForm<EditProjectType>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: initialValues,
    mode: 'onSubmit',
  });

  const [updateProject, updateState] = useUpdateProjectMutation();

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    await updateProject({ id: pId, body: values }).unwrap();
    onSuccess?.();
  });

  return {
    form,
    onSubmit,
    updateState,
  };
};
